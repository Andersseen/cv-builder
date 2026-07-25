# CONVENTIONS — How code is written in this repo

Follow existing code style exactly. When in doubt, open a similar existing file and imitate it.

## Angular (v21, signals-first)

**Components**

- Standalone always (`strictStandalone` is enforced by the compiler). No NgModules anywhere.
- `changeDetection: ChangeDetectionStrategy.OnPush` on **every** component.
- Small components use inline `template:`; only large pages use `templateUrl` (currently only `editor.html`).
- Selectors: `app-` prefix, kebab-case (`app-resume-preview`).
- Routed page components: `export default class Landing …` placed under `src/app/pages/<route>.page.ts` for AnalogJS file-based routing.
- Non-routed components: named exports.

**File & class naming (important — non-standard):**

- Files: short kebab-case **without type suffixes** → `editor.ts`, `cv-card.ts`, `autosave.ts`, `theme.ts`. Never `*.component.ts`, `*.service.ts`.
- Classes: **without suffixes** where the name is unambiguous → `Editor`, `Autosave`, `Theme`, `PdfExport`. Exceptions that keep a suffix: `ToastService`, `LocalCvRepository`, `LocalCvDatabase`, form components (`PersonalInfoForm`), template components (`ModernTemplate`).

**Signals & DI**

- State: `signal()` + `computed()`; side effects: `effect()` (as class field initializers, e.g. `private autosaveEffect = effect(() => …)`).
- Component I/O: `input()` / `input.required()` / `output()` functions, declared `readonly`. Never decorator-based `@Input()`/`@Output()`.
- Services expose private writable signals + public `.asReadonly()` views (see `CvStore`, `Autosave`).
- Dependency injection: `private readonly x = inject(X)` fields. Never constructor parameters.
- Visibility: `protected` for members used only by the template, `private` for internals, `readonly` wherever possible.

**Templates**

- Built-in control flow only: `@if`, `@for (… ; track item.id)`, `@switch`. Never structural directives (`*ngIf`, `*ngFor`).
- Forms: **typed Reactive Forms** (`FormGroup`/`FormControl` with `Validators`), not template-driven `ngModel`.
- Icons are inline SVG (heroicons-style paths) or emoji for tab icons. There is no icon library — don't add one.

**Services**

- `@Injectable({ providedIn: "root" })` for all services.
- Async work uses `async/await` with Promises. **RxJS is available but avoided** for app logic — don't introduce observables where a signal or Promise works.

## Tailwind CSS v4 (CSS-first config — there is NO tailwind.config.js)

All design tokens live in `src/styles.css`:

- `@theme` block maps Tailwind color names to semantic CSS variables.
- `:root` / `.dark` define the HSL values (violet-tinted palette, hue 262).
- Dark mode: `Theme` service toggles `.dark`/`.light` classes on `<html>`; there is also a `prefers-color-scheme` fallback.

**Semantic tokens available** (use ONLY these for app UI):

`background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `border`, `input`, `ring` — plus legacy aliases `surface`, `surface-alt`, `surface-hover` (being phased out; prefer `card`/`muted`/`accent`).

Usage: `bg-background`, `text-foreground`, `bg-card border border-border`, `text-muted-foreground`, `bg-primary text-primary-foreground`, `text-destructive`, `focus:ring-ring`.

**Rules:**

1. App chrome (headers, forms, buttons, cards, toolbars): semantic tokens only. Never `bg-white`, `text-gray-500`, hex values, or palette classes like `bg-primary-500`.
2. **Resume templates are the exception**: `features/editor/components/resume-templates/` intentionally use direct utilities (`bg-white`, `text-slate-700`) + inline styles driven by `cv.settings` colors, because resumes must look identical regardless of app theme and must export cleanly to PDF. Do not "fix" templates to use semantic tokens.
3. Do not invent token names. If a class isn't derivable from the list above, it doesn't exist and silently renders unstyled (Tailwind v4 drops unknown utilities). Check `docs/STATE.md` → known issues: the codebase currently contains broken classes (`text-muted-foreground-foreground`, `bg-card-alt`, `bg-card-hover`, `text-danger`) awaiting cleanup — never copy them into new code. Correct equivalents: `text-muted-foreground`, `bg-muted`, `hover:bg-accent`, `text-destructive`.
4. Radii: `rounded-lg`/`rounded-xl` (mapped to `--radius`). Animations: custom `animate-fade-in`, `animate-slide-up`, `animate-float` defined in `styles.css`.

## TypeScript

- All strict flags on, plus `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature`, and Angular's `strictTemplates`. Code must compile with zero errors — that is the current substitute for tests.
- Domain models are `interface`s + union types (`SkillLevel`), never classes.
- IDs: `crypto.randomUUID()` (see `core/utils/id.ts`). Dates stored as ISO 8601 strings.
- Double quotes, trailing commas, 2-space indent (Prettier defaults).

## Comments & docs

- JSDoc block on every service class explaining its responsibility (see `CvStore`, `Autosave`, `PdfExport` for the expected style).
- Section separators in longer files: `// ─── Section name ───────────`.
- No noise comments explaining obvious lines.

## Git

- Branches: `feature/<name>`, `feat/<name>`.
- Commit messages: conventional-commit style prefixes (`feat:`, `refactor:`, `fix:`) + descriptive sentence. Look at `git log --oneline` and match.
- Never commit `dist/`, `node_modules/`, `.angular/`.

## Common recipes

**Add a field to the CV model** — touch all of these or data will be inconsistent:

1. `domain/models/cv-model.ts` — add to the interface.
2. `domain/models/cv-defaults.ts` — add default value for new CVs.
3. `application/state/cv.ts` → `loadAll()` — add backfill default for CVs already stored in IndexedDB.
4. The relevant form component + `Editor` update handler.
5. Every template in `resume-templates/` that should render it.

**Add a resume template** — 3 steps, documented in `docs/ARCHITECTURE.md` § Template system.

**Add a page/route** — create `src/app/pages/<route>.page.ts` with `export default`. AnalogJS file-based routing discovers the page automatically; no `app.routes.ts` entry needed.

**Verify your work** — `pnpm build` must pass. Then `pnpm start` and manually check: editor updates preview live, autosave indicator fires, both PDF export and Print work, dark and light themes both look right.
