# Agent Guide — Modern CV Builder

You are working on **Modern CV Builder**: a 100% client-side Angular 19 app for creating resumes with live preview and PDF export. No backend, no auth — everything is stored locally in IndexedDB.

## Session protocol (do this every session)

1. **Start**: read [docs/CONTEXT.md](docs/CONTEXT.md) (what/why) and [docs/STATE.md](docs/STATE.md) (where we are now).
2. **Before writing code**: read [docs/CONVENTIONS.md](docs/CONVENTIONS.md). For any non-trivial feature, follow the spec-driven workflow in [docs/specs/README.md](docs/specs/README.md) — write the spec first, then implement.
3. **End**: update [docs/STATE.md](docs/STATE.md) with what you did, what's unfinished, and any new known issues.

## Commands

```bash
pnpm install     # install deps (pnpm is the package manager, not npm)
pnpm start       # dev server at http://localhost:5173 (Vite default)
pnpm build       # production build
```

There are **no tests and no linter configured yet**. Verify changes by building (`pnpm build`) — TypeScript is fully strict and `strictTemplates` is on, so the compiler catches most mistakes.

## Stack

- **Angular 21** — standalone components only, signals everywhere, zoneless change detection (`provideZonelessChangeDetection`). Upgraded from 19 to unblock the user's UI libs (`@voltui/components` etc., which require Angular ^21).
- **AnalogJS 2.x + Vite 6** — meta-framework with file-based routing and Vite-based dev/build
- **Zone.js removed** — `provideExperimentalZonelessChangeDetection()` is used at bootstrap
- **Tailwind CSS v4** — CSS-first config in `src/styles.css` (`@theme` block), semantic HSL tokens, dark mode via `.dark` class on `<html>`
- **Dexie 4** — IndexedDB wrapper (the only persistence)
- **html-to-image + jspdf** — image-based PDF export; native print dialog for text-based export
- **TypeScript 5.8 strict** — all strict flags on

## Golden rules

1. **Standalone components only.** Never create or reference an NgModule.
2. **`ChangeDetectionStrategy.OnPush` on every component.** No exceptions.
3. **Signals-first**: `signal()` / `computed()` / `effect()` for state, `input()` / `output()` for component I/O (never `@Input()` / `@Output()` decorators). Mark inputs/outputs `readonly`.
4. **`inject()` function, not constructor injection.**
5. **Routed page components use `export default`** — routing is file-based (AnalogJS): each file in `src/app/pages/` named `*.page.ts` becomes a route, and its default export is the page component. There is no route config file.
6. **New template control flow only**: `@if`, `@for`, `@switch`. Never `*ngIf` / `*ngFor`.
7. **File naming**: plain names without suffixes — `editor.ts`, `cv-card.ts`, `theme.ts`. NOT `editor.component.ts` or `theme.service.ts`. Class names also without suffixes: `Editor`, `Autosave`, `Theme`.
8. **Respect the layer boundaries** (dependencies point downward only):
   - `features/` → UI pages/components, may use `application/`, `core/`, `shared/`, `domain/`
   - `application/` → state (`CvStore`) + orchestration (`Autosave`), may use `infrastructure/`, `domain/`
   - `infrastructure/` → persistence (Dexie) + export (PDF/print), may use `domain/`
   - `domain/` → pure TypeScript models. **No Angular imports, no RxJS, no side effects. Ever.**
   - `core/` + `shared/` → cross-cutting services (theme, toast) and layout components
9. **All CV state changes go through `CvStore`** (`src/app/application/state/cv.ts`). Components never touch the repository or Dexie directly. Persistence is handled by `Autosave` — do not call `persist()` from components.
10. **App UI styling uses semantic tokens only** (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-destructive`…). Never hardcode colors in app chrome. **Exception**: resume templates (`features/editor/components/resume-templates/`) intentionally use direct Tailwind utilities (`bg-white`, `text-gray-900`) because a resume must render identically in light/dark app theme and in PDF export.
11. **No new dependencies without explicit user approval.**
12. **Prettier-style formatting with double quotes** (matches existing code).
13. **Don't generate placeholder/demo content** (lorem ipsum sections, fake features) unless asked.

## Where things live (quick map)

| Concern | File |
|---|---|
| Routes (3 lazy pages: landing `/`, `/dashboard`, `/editor`) | `src/app/pages/(home).page.ts`, `dashboard.page.ts`, `editor.page.ts` |
| Domain models (`Cv`, sections, settings, `TemplateInfo`) | `src/app/domain/models/cv-model.ts` |
| Default/factory CV | `src/app/domain/models/cv-defaults.ts` |
| Template catalog (add new templates here) | `src/app/domain/models/template-registry.ts` |
| Central state (signals store, CRUD, deep-merge patch) | `src/app/application/state/cv.ts` |
| Debounced autosave (800 ms) | `src/app/application/services/autosave.ts` |
| IndexedDB schema / repository | `src/app/infrastructure/persistence/` |
| PDF export (image-based) + print export (text-based) | `src/app/infrastructure/export/` |
| Design system tokens (Tailwind v4 `@theme` + HSL vars) | `src/styles.css` |
| Theme service (dark/light, localStorage) | `src/app/core/services/theme.ts` |
| Toasts | `src/app/core/services/toast.ts` + `src/app/shared/components/toast/` |

Full architecture and data flow: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
