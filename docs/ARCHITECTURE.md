# ARCHITECTURE — Layers, data flow, and file map

## Layered architecture

Dependencies point **downward only**. A layer may import from layers below it, never above.

```
┌─────────────────────────────────────────────────────────┐
│ features/            UI pages & feature components       │
│   landing/  dashboard/  editor/                          │
├─────────────────────────────────────────────────────────┤
│ shared/ + core/      cross-cutting UI & services         │
│   header, footer, toast │ theme, toast service, id utils │
├─────────────────────────────────────────────────────────┤
│ application/         state & orchestration               │
│   CvStore (signals)  │  Autosave (debounced persist)     │
├─────────────────────────────────────────────────────────┤
│ infrastructure/      technical adapters                  │
│   persistence (Dexie/IndexedDB) │ export (PDF, print)    │
├─────────────────────────────────────────────────────────┤
│ domain/              pure TypeScript — NO Angular/RxJS   │
│   cv-model.ts │ cv-defaults.ts │ template-registry.ts    │
└─────────────────────────────────────────────────────────┘
```

Enforcement rules:

- `domain/` imports **nothing** from the app (and no framework). It defines `Cv`, `CvSections`, `PersonalInfo`, `Experience`, `Education`, `Skill`, `CvSettings`, `TemplateInfo`, `DeepPartial`, plus factory functions and the static `TEMPLATES` catalog.
- `infrastructure/` may import `domain/` only.
- `application/` may import `infrastructure/`, `domain/`, `core/` (toast).
- `features/` may import everything below. Feature components **never** import `infrastructure/persistence` directly — always go through `CvStore`. (Export services `PdfExport`/`PrintExport` are injected directly by the editor; that is the accepted pattern for exports.)

## Data flow (the one loop that matters)

```
user types in a form component (e.g. personal-info-form)
  → output() event up to Editor page
    → editor calls cvStore.updateActiveCv(partialPatch)
      → CvStore deep-merges patch into the active Cv signal (in memory)
        → activeCv computed updates
          → (a) ResumePreview re-renders instantly (OnPush + signals)
          → (b) editor's effect() calls autosave.scheduleAutosave(cv)
              → after 800 ms of inactivity → cvStore.persist(cv)
                → LocalCvRepository.save() → Dexie → IndexedDB
```

Key consequences for any change you make:

- **In-memory update and persistence are decoupled.** `updateActiveCv()` never writes to disk; `Autosave` does. Don't add direct `persist()` calls in components.
- Updates are **partial deep patches** (`DeepPartial<Cv>`); arrays are replaced wholesale, objects are merged (see `deepMerge` in `application/state/cv.ts`).
- `CvStore.loadAll()` also performs **schema backfill/migration** for settings added after the initial schema. If you add a field to `Cv`/`CvSettings`, add a backfill default there AND in `cv-defaults.ts`.

## Page lifecycle

- `Dashboard` calls `cvStore.loadAll()` on init, lists `cvStore.cvs()`, navigates to `/editor?cv=<id>`.
- `Editor` calls `loadAll()` on init, reads `?cv=` query param, calls `setActive(id)`; if no active CV it redirects back to `/dashboard`. On destroy it calls `autosave.destroy()`.

## Export subsystem (`infrastructure/export/`)

Two intentionally different strategies — keep both:

|                       | `PdfExport` (pdf-export.ts)                             | `PrintExport` (print-export.ts)                              |
| --------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| Mechanism             | `html-to-image` PNG @3x → `jspdf` A4, sliced into pages | hidden iframe + `print-stylesheet.ts` + browser print dialog |
| Text selectable / ATS | ❌                                                      | ✅                                                           |
| Fidelity              | pixel-perfect                                           | high                                                         |
| File size             | 2–5 MB                                                  | ~100 KB                                                      |

Both capture the DOM node `#resume-content` (rendered by `ResumePreview`). `a4.ts` holds A4 mm constants. If you change resume template markup, verify **both** export paths.

## Template system

- Catalog: `domain/models/template-registry.ts` (`TEMPLATES: TemplateInfo[]` — pure data, no component refs).
- Components: `features/editor/components/resume-templates/*-template.ts`, one standalone component per template, each receives the `Cv` as a signal input.
- Dispatch: `ResumePreview` maps `cv.templateId` to a component in an `@switch` block.

**To add a template (exactly 3 steps):**

1. Create `features/editor/components/resume-templates/<name>-template.ts` (copy the closest existing one).
2. Add a `TemplateInfo` entry to `TEMPLATES` in `template-registry.ts`.
3. Add a case to the `@switch` in `resume-preview.ts`.

## State & services inventory

| Class               | File                                          | Role                                                                                                                                                                               |
| ------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CvStore`           | `application/state/cv.ts`                     | signals store: `cvs`, `activeCvId`, `activeCv` (computed), `loading`; commands: `loadAll`, `create`, `duplicate`, `rename`, `setActive`, `updateActiveCv`, `persist`, `deleteById` |
| `Autosave`          | `application/services/autosave.ts`            | debounced persist (800 ms), exposes `saving` + `lastSavedAt` signals                                                                                                               |
| `LocalCvRepository` | `infrastructure/persistence/cv-repository.ts` | CRUD over Dexie                                                                                                                                                                    |
| `LocalCvDatabase`   | `infrastructure/persistence/cv-database.ts`   | Dexie schema (table `cvs`, indexed by `id`, `updatedAt`)                                                                                                                           |
| `Theme`             | `core/services/theme.ts`                      | dark/light: toggles `.dark`/`.light` on `<html>`, persists to localStorage key `cv-builder-theme`                                                                                  |
| `ToastService`      | `core/services/toast.ts`                      | app-wide toasts, rendered by `shared/components/toast`                                                                                                                             |

## Routing

AnalogJS **file-based routing** under `src/app/pages/`. Page components are default exports and lazy-loaded by the AnalogJS router:

- `src/app/pages/(home).page.ts` → `/`
- `src/app/pages/dashboard.page.ts` → `/dashboard`
- `src/app/pages/editor.page.ts` → `/editor`

A wildcard/catch-all route is not needed because the app is a single-page application and unmatched paths are handled by the static file server.
