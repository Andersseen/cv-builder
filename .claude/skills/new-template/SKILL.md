---
name: new-template
description: Add a new resume template — component, registry entry, and ResumePreview dispatch — following the repo's template conventions.
disable-model-invocation: true
---

# New resume template

Adding a template is exactly **3 edits**. Missing any one of them means the
template either never appears in the picker or renders as a blank preview.

## The 3 steps

### 1. Component

Create `src/app/features/editor/components/resume-templates/<name>-template.ts`.
Copy the closest existing template and adapt it — do not write one from scratch:

| Existing               | Layout                                        |
| ---------------------- | --------------------------------------------- |
| `minimal-template.ts`  | simplest; best starting point                 |
| `modern-template.ts`   | gradient header, card sections                |
| `classic-template.ts`  | centered, serif feel                          |
| `creative-template.ts` | dark left sidebar, timeline, progress bars    |
| `executive-template.ts`| bold dark header, pill badges                 |

### 2. Registry

Add a `TemplateInfo` entry to `TEMPLATES` in
`src/app/domain/models/template-registry.ts`. `previewLayout` must be one of
`single-column | sidebar-left | sidebar-right | two-column | header-accent`.

### 3. Dispatch

Add a `@case` for the new `id` to the `@switch` in
`src/app/features/editor/components/resume-preview.ts`, and import the component.

## Requirements the new component must satisfy

**Angular conventions** (see [docs/CONVENTIONS.md](../../../docs/CONVENTIONS.md)):

- Standalone, `changeDetection: ChangeDetectionStrategy.OnPush`, inline `template:`.
- Selector `app-<name>-template`, class `<Name>Template`, file `<name>-template.ts`.
- Inputs via `input()` functions declared `readonly` — never `@Input()`.
- Template control flow: `@if` / `@for (…; track …)` / `@switch` only.

**Styling — the documented exception to golden rule 10:**

Resume templates use **direct Tailwind utilities** (`bg-white`, `text-gray-900`,
`text-slate-700`) plus inline styles bound to `cv().settings`. Do **not** use
semantic tokens (`bg-background`, `text-foreground`) here. A resume must render
identically in light and dark app theme and export cleanly to PDF.

Bind all four settings so the template respects the user's choices:

- `[style.background-color]="backgroundColor()"`
- `[style.font-family]="fontFamily()"` — the print-safe font from the selector
- `[style.color]="accentColor()"` on section headings
- primary color where the design calls for it

Keep the `class="resume-content"` marker on the root element — PDF and print
export select on it.

**Flexible sections (Fase 7) — mandatory, not optional:**

```ts
protected readonly orderedSections = computed(() => getOrderedSections(this.cv()));
```

Then render with `@for (sectionId of orderedSections(); track sectionId)` around
a `@switch (sectionId)`. `getOrderedSections()` already applies both
`settings.sectionOrder` and `settings.sectionVisibility`, so do not re-check
visibility yourself. Include a `@default` branch that renders **custom
sections** from `cv().sections.customSections` — a template that ignores them
silently drops user content.

## Verify

1. `pnpm lint && pnpm test && pnpm build` — all green.
2. `pnpm start`, open the editor, pick the new template: preview updates live,
   section reorder/hide from the "Sections" tab is reflected, custom sections
   render.
3. Export both PDF and Print — check page breaks and that colors survive.
4. Toggle dark mode: the resume itself must look **unchanged**.
