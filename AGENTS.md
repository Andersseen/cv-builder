# Agent Guide — Modern CV Builder

You are working on **Modern CV Builder**: an Angular 21 app for creating resumes with live preview and PDF export. No accounts, no auth — CVs are stored locally in IndexedDB. The only server round-trip is the opt-in Cloud PDF export, which renders on the project's own Cloudflare Worker.

## Session protocol (do this every session)

1. **Start**: read [docs/CONTEXT.md](docs/CONTEXT.md) (what/why) and [docs/STATE.md](docs/STATE.md) (where we are now).
2. **Before writing code**: read [docs/CONVENTIONS.md](docs/CONVENTIONS.md). For any non-trivial feature, follow the spec-driven workflow in [docs/specs/README.md](docs/specs/README.md) — write the spec first, then implement.
3. **End**: update [docs/STATE.md](docs/STATE.md) with what you did, what's unfinished, and any new known issues.

## Commands

```bash
pnpm install     # install deps (pnpm is the package manager, not npm)
pnpm start       # local app + Cloud PDF Worker (:5173 + :8787)
pnpm dev:pages   # build + Cloudflare Pages dev server
pnpm dev:worker  # Cloud PDF Worker dev server at http://localhost:8787
pnpm build       # production build → dist/analog/public
pnpm lint        # ESLint + angular-eslint
pnpm test        # unit tests (Vitest)
pnpm e2e         # end-to-end tests (Playwright)
pnpm deploy:prod # build + deploy Pages app and PDF Worker (production)
```

**Before declaring work done, run `pnpm lint`, `pnpm test`, `pnpm e2e` and `pnpm build`** — all four must be green (CI runs the first three plus the build). TypeScript is fully strict and `strictTemplates` is on, so the compiler catches most mistakes.

## Deployment

**Cloudflare is the only deployment platform.** Apps live on Cloudflare Pages; server-side services live in Cloudflare Workers. Do not add config for other hosts.

- Pages project: `cv-builder` · production URL: <https://cv-builder.andersseen.dev>.
- PDF Worker: `cv-builder-pdf` · route `cv-builder.andersseen.dev/api/*` so the client can keep calling `/api/pdf`.
- Pages config: [wrangler.jsonc](wrangler.jsonc) — `pages_build_output_dir: dist/analog/public`.
- Worker config: [worker/wrangler.jsonc](worker/wrangler.jsonc) — `main: index.ts`, Browser Run binding `BROWSER`, route for `/api/*`.
- `worker/index.ts` exposes `POST /api/pdf` (server-side PDF via `@cloudflare/puppeteer`). Keep it thin — no business logic belongs there.
- Local Cloud PDF uses `pnpm start`, which starts `pnpm dev:worker` first and then `pnpm dev:app`; `vite.config.ts` has a dev-only middleware that forwards `/api/pdf` to `http://127.0.0.1:8787/api/pdf` before Analog's `/api` dev router can 404 it.
- Cache + security headers live in `public/_headers`; SPA fallback lives in `public/_redirects`. Vite copies both into the build output — edit them in `public/`, not in `dist/`.
- Every push to `main` runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml) then [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets.

## Stack

- **Angular 21** — standalone components only, signals everywhere, zoneless change detection (`provideZonelessChangeDetection`). Upgraded from 19 to unblock the user's UI libs (`@voltui/components` etc., which require Angular ^21).
- **AnalogJS 2.x + Vite 6** — meta-framework with file-based routing and Vite-based dev/build
- **Zone.js removed** — `provideExperimentalZonelessChangeDetection()` is used at bootstrap
- **Tailwind CSS v4** — CSS-first config in `src/styles.css` (`@theme` block), semantic HSL tokens, dark mode via `.dark` class on `<html>`
- **Dexie 4** — IndexedDB wrapper (the only persistence)
- **html-to-image + jspdf** — image-based PDF export; native print dialog for text-based export
- **Cloudflare Pages + Workers + Browser Run** (`@cloudflare/puppeteer`, devDep) — Pages serves the app; Worker in `worker/index.ts` renders the third, server-side PDF path at `POST /api/pdf`
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

| Concern                                                                    | File                                                                  |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Routes (3 lazy pages: landing `/`, `/dashboard`, `/editor`)                | `src/app/pages/(home).page.ts`, `dashboard.page.ts`, `editor.page.ts` |
| Domain models (`Cv`, sections, settings, `TemplateInfo`)                   | `src/app/domain/models/cv-model.ts`                                   |
| Default/factory CV                                                         | `src/app/domain/models/cv-defaults.ts`                                |
| Template catalog (add new templates here)                                  | `src/app/domain/models/template-registry.ts`                          |
| Central state (signals store, CRUD, deep-merge patch)                      | `src/app/application/state/cv.ts`                                     |
| Debounced autosave (800 ms)                                                | `src/app/application/services/autosave.ts`                            |
| IndexedDB schema / repository                                              | `src/app/infrastructure/persistence/`                                 |
| PDF exports: image-based + print (client) + cloud (server, via `/api/pdf`) | `src/app/infrastructure/export/` + `worker/index.ts`                  |
| Design system tokens (Tailwind v4 `@theme` + HSL vars)                     | `src/styles.css`                                                      |
| Theme service (dark/light, localStorage)                                   | `src/app/core/services/theme.ts`                                      |
| Toasts                                                                     | `src/app/core/services/toast.ts` + `src/app/shared/components/toast/` |

Full architecture and data flow: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
