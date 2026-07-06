# STATE — Current status of the project

> **How to use this file**: read it at the start of every session to know where work stands. **Update it at the end of every session**: move finished items to the log, add new known issues, keep "Next steps" honest. Keep it short — this is a status board, not a changelog archive.

**Last updated**: 2026-07-06 · **Active branch**: `feature/style-guide` (main branch: `main`)

## What's working (stable)

- Full flow: landing → dashboard (CRUD of CVs) → editor (5 tabbed forms) → live preview → PDF/print export.
- 5 templates (Modern, Classic, Minimal, Creative, Executive) with per-CV accent/background/primary color settings.
- Autosave to IndexedDB (Dexie) with debounce + saved indicator; data survives reloads.
- Dark/light theme with localStorage persistence and system-preference fallback.
- Multi-page image PDF export and text-based print export.

## Work in progress: design-system unification (`feature/style-guide`)

The last several commits migrate the app to a **semantic token design system** (shadcn-style HSL variables in `src/styles.css`) on Tailwind v4, and modernize components (standalone API, signal inputs/outputs, OnPush). The migration is **incomplete** — that's the main thread of current work:

- App chrome should use semantic tokens (`bg-card`, `text-muted-foreground`…) — mostly done, but leftover broken/legacy classes remain (see known issues).
- Resume templates were deliberately moved OFF semantic tokens to direct utilities (commit `9b855ba`) — that direction is final, don't revert it.
- The local **volt-ui** component library (`~/Andersseen/Web/Projects/volt-ui`, Angular + Tailwind, shadcn-like) is being used as the style reference for this design system.

## Known issues (verified 2026-07-06)

1. **Broken Tailwind classes across ~15 files** — these tokens don't exist in `@theme`, so they silently render unstyled:
   - `text-muted-foreground-foreground` (should be `text-muted-foreground`) — landing, dashboard, editor components
   - `bg-card-alt` / `hover:bg-card-hover` (should be `bg-muted` / `hover:bg-accent`, or the legacy `surface-alt`/`surface-hover` aliases) — editor forms, toolbar, template-selector
   - `text-danger` (should be `text-destructive`) — cv-card and all editor forms
2. **Unused `Component` import** in 6+ service files (`theme.ts`, `cv.ts`, `autosave.ts`, `cv-repository.ts`, `pdf-export.ts`, `print-export.ts`) — leftover from a codemod; harmless but should be cleaned.
3. **`src/styles.css` suspicious constructs**: `@utilities { … }` is not a valid Tailwind v4 directive (v4 uses `@utility <name>` per utility) — the custom `animate-*` classes may only work by accident of PostCSS passthrough; and `--radius: var(--radius);` inside `@theme` is self-referential. Verify both when touching styles.
4. **README drift**: mentions `pdf-lib`, which is not in `package.json` (export uses `html-to-image` + `jspdf` only).
5. **No tests** (a `feat/jest-setup` remote branch exists but was never merged) and **no linter/formatter config** committed. `pnpm build` is the only automated check.
6. **Editor route guard is soft**: `/editor` without a valid `?cv=` id silently redirects to `/dashboard`.

## Next steps (in rough priority order)

1. Finish the style-guide migration: fix the broken classes from known issue #1 (mechanical find/replace, verify in light + dark).
2. Remove unused imports (known issue #2) and fix `styles.css` constructs (#3).
3. Decide on and phase out legacy `surface-*` aliases in `@theme`.
4. Set up linting (ESLint + angular-eslint) and formatting config to lock conventions in.
5. Revisit testing setup (the abandoned `feat/jest-setup` branch; Vitest is also an option with the esbuild builder).

## Session log (newest first, keep last ~10)

- **2026-07-06** — Added agent documentation suite: `AGENTS.md`, `CLAUDE.md`, `docs/` (CONTEXT, ARCHITECTURE, CONVENTIONS, STATE, specs workflow). Audited codebase; catalogued known issues above. No app code changed.
