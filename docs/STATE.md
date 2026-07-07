# STATE — Current status of the project

> **How to use this file**: read it at the start of every session to know where work stands. **Update it at the end of every session**: move finished items to the log, add new known issues, keep "Next steps" honest. Keep it short — this is a status board, not a changelog archive.

**Last updated**: 2026-07-07 · **Active branch**: `feature/style-guide` — AnalogJS migration committed here (main branch: `main`)

## What's working (stable)

- Full flow: landing → dashboard (CRUD of CVs) → editor (5 tabbed forms) → live preview → PDF/print export.
- 5 templates (Modern, Classic, Minimal, Creative, Executive) with per-CV accent/background/primary color settings.
- Autosave to IndexedDB (Dexie) with debounce + saved indicator; data survives reloads.
- Dark/light theme with localStorage persistence and system-preference fallback.
- Multi-page image PDF export and text-based print export.
- **Migrated to AnalogJS + Vite**: file-based routing under `src/app/pages/`, zoneless change detection, builds with `pnpm build`, dev server with `pnpm dev`.

## Work in progress: design-system unification (`feature/style-guide`)

The last several commits migrate the app to a **semantic token design system** (shadcn-style HSL variables in `src/styles.css`) on Tailwind v4, and modernize components (standalone API, signal inputs/outputs, OnPush). The migration is **incomplete** — that's the main thread of current work:

- App chrome should use semantic tokens (`bg-card`, `text-muted-foreground`…) — mostly done, but leftover broken/legacy classes remain (see known issues).
- Resume templates were deliberately moved OFF semantic tokens to direct utilities (commit `9b855ba`) — that direction is final, don't revert it.
- The local **volt-ui** component library (`~/Andersseen/Web/Projects/volt-ui`, Angular + Tailwind, shadcn-like) is being used as the style reference for this design system.

## Known issues (verified 2026-07-06)

0. ~~**`pnpm build` FAILS**~~ **FIXED 2026-07-07**: the failure (`src/main.server.ts` couldn't resolve `@analogjs/router/server` / `tokens`) was caused by `moduleResolution: "node"` in `tsconfig.json`, which doesn't read package `exports` subpaths. Fixed by switching to `"bundler"`. Note: `src/main.server.ts` + `src/app/app.config.server.ts` **must stay** even with `ssr: false` — Analog's `static: true` build requires the SSR bundle entry (verified: deleting them breaks the build with `Could not resolve entry module "src/main.server.ts"`).
0b. ~~**pnpm patch file missing**~~ **FIXED 2026-07-06/07**: `pnpm-workspace.yaml` + lockfile declared `patches/@analogjs__vite-plugin-angular@2.6.3-beta.5.patch` but the file was absent (fresh `pnpm install` would fail). Regenerated it by diffing the installed (patched) package against the pristine registry tarball, restored it to `patches/`, and refreshed the lockfile hash via `pnpm install`. The patch is **functional, not just debug logging**: adds `enforce: "pre"`, a transform lookup-id fallback, eager emit of all source files in dev, and a stricter fesm filter in router-plugin. Don't delete it — the project is on `2.6.3-beta.5` (newer than the latest stable `2.6.2`), so no upgrade absorbs it yet. Its noisy `[ANALOG DEBUG]` console.logs should eventually be stripped.

1. **Broken Tailwind classes across ~15 files** — these tokens don't exist in `@theme`, so they silently render unstyled:
   - `text-muted-foreground-foreground` (should be `text-muted-foreground`) — landing, dashboard, editor components
   - `bg-card-alt` / `hover:bg-card-hover` (should be `bg-muted` / `hover:bg-accent`, or the legacy `surface-alt`/`surface-hover` aliases) — editor forms, toolbar, template-selector
   - `text-danger` (should be `text-destructive`) — cv-card and all editor forms
2. **Unused `Component` import** in 6+ service files (`theme.ts`, `cv.ts`, `autosave.ts`, `cv-repository.ts`, `pdf-export.ts`, `print-export.ts`) — leftover from a codemod; harmless but should be cleaned.
3. **`src/styles.css` `@utilities` block is CONFIRMED broken** (audit 2026-07-06): the built CSS ships a literal `@utilities{ .animate-fade-in {…} … }` block — browsers ignore unknown at-rules entirely, so `animate-fade-in` / `animate-slide-up` / `animate-float` (used in hero, toast, header) do nothing in dev or prod. Fix: replace the block with one `@utility animate-fade-in { … }` per class, or plain top-level CSS classes. Also `--radius: var(--radius);` inside `@theme` is self-referential (works only because the `@layer base` definition wins the cascade).
4. **README drift**: mentions `pdf-lib`, which is not in `package.json` (export uses `html-to-image` + `jspdf` only).
5. **No tests** (a `feat/jest-setup` remote branch exists but was never merged) and **no linter/formatter config** committed. `pnpm build` is the only automated check.
6. **Editor route guard is soft**: `/editor` without a valid `?cv=` id silently redirects to `/dashboard`.
7. **AnalogJS dev warnings**: `[@analogjs/vite-plugin-angular]` warns that some `node_modules/.vite/deps/chunk-*.js` files contain Angular decorators but are not in the TypeScript program. These are pre-bundled Angular chunks and are harmless, but noisy. The local patch (see 0b) additionally prints `[ANALOG DEBUG]` lines on every transform and build.
8. ~~**Docs drift from the Analog migration**~~ **FIXED 2026-07-07**: AGENTS.md now documents file-based routing (golden rule #5) and the correct dev-server port (5173); `app.ts` now has `ChangeDetectionStrategy.OnPush` like every other component.
9. ~~**Migration work staged but uncommitted**~~ **FIXED 2026-07-07**: the AnalogJS migration, `pnpm-workspace.yaml`, `patches/`, and the audit fixes are committed on `feature/style-guide`.

## Next steps (in rough priority order)

1. Finish the style-guide migration: fix the broken classes from known issue #1 (mechanical find/replace, verify in light + dark) and the dead `@utilities` block (#3).
2. Remove unused imports (known issue #2) and fix `styles.css` constructs (#3).
3. Decide on and phase out legacy `surface-*` aliases in `@theme`.
4. Set up linting (ESLint + angular-eslint) and formatting config to lock conventions in.
5. Revisit testing setup (the abandoned `feat/jest-setup` branch; Vitest is also an option with the esbuild builder).
6. Investigate suppressing or fixing AnalogJS dev warnings for pre-bundled Angular chunks.

## Session log (newest first, keep last ~10)

- **2026-07-07** — Closed out the AnalogJS migration from the audit findings: `moduleResolution` → `"bundler"` in `tsconfig.json` (fixes the build), verified the SSR entry points must stay (`static: true` needs `src/main.server.ts` — removing them breaks the build), refreshed the patch hash in `pnpm-lock.yaml`, added `OnPush` to `app.ts`, fixed AGENTS.md drift (file-based routing in golden rule #5, dev port 5173). `pnpm build` verified green. Committed the whole migration on `feature/style-guide`. Issues #0/#0b/#8/#9 closed; remaining work is the style-guide thread (issues #1–#6).
- **2026-07-06 (evening)** — Full audit of the AnalogJS + zoneless migration. Found `pnpm build` broken (`moduleResolution: "node"` can't resolve `@analogjs/router/server|tokens` from `main.server.ts`; verified that `"bundler"` fixes it, change not applied). Found the pnpm patch file for `@analogjs/vite-plugin-angular` missing while still declared in `pnpm-workspace.yaml`/lockfile — regenerated it from the installed package and restored `patches/@analogjs__vite-plugin-angular@2.6.3-beta.5.patch` (the patch is functional: enforce pre, transform lookup fallback, eager dev emit, fesm filter guard). Confirmed the `@utilities` block ships broken to prod CSS (animate-* classes dead). Verified dev server works at `localhost:5173` and zoneless-safety of the codebase (no NgZone/zone.js references, signals everywhere, 26/27 components OnPush — only `app.ts` missing it, both `valueChanges` subscriptions use `takeUntilDestroyed` and feed signals/outputs). Counted 78 broken Tailwind class usages across 17 files (issue #1). Updated known issues #0/0b/3/7/8/9. No app code changed.
- **2026-07-06** — Migrated the project from Angular CLI to AnalogJS + Vite. Enabled zoneless change detection (`provideExperimentalZonelessChangeDetection`). Adopted AnalogJS file-based routing (`src/app/pages/(home).page.ts`, `dashboard.page.ts`, `editor.page.ts`). Removed `zone.js`, `@angular/cli`, and `angular.json`. Added `@analogjs/platform`, `@analogjs/router`, `@angular/platform-server`, and `vite`. Fixed unsubscribed RxJS `valueChanges` subscriptions in `personal-info-form.ts` and `experience-form.ts` using `takeUntilDestroyed()`. Verified `pnpm build` succeeds.
- **2026-07-06** — Added agent documentation suite: `AGENTS.md`, `CLAUDE.md`, `docs/` (CONTEXT, ARCHITECTURE, CONVENTIONS, STATE, specs workflow). Audited codebase; catalogued known issues above. No app code changed.
