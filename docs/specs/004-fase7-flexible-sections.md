# Spec 004 — Flexible Sections (Fase 7)

- **Status**: Done
- **Created**: 2026-07-17
- **Author**: Kimi Code CLI

## Goal

Let users hide, reorder and add custom sections so the CV can fit individual backgrounds (volunteering, publications, awards, etc.) without needing hardcoded new section types.

## Context

Today the CV has 7 fixed sections. Real CVs often need other sections, and some users want to hide or reorder the built-in ones. This phase adds flexible sections while keeping all rendering client-side and avoiding a backend.

## Requirements

Must-have:

1. **Data model extension**: add to `Cv`:
   - `sections.customSections: CustomSection[]` where `CustomSection = { id, title, items: { id, title, subtitle, description }[] }`. `description` supports the same lightweight markdown as experience/project descriptions.
   - `settings.sectionVisibility: Record<string, boolean>` controlling whether a section is shown. Default `true` for all sections.
   - `settings.sectionOrder: string[]` defining the render order of section IDs. Default order is the built-in order (`personal`, `experience`, `education`, `skills`, `projects`, `certifications`, `languages`) followed by custom sections.
2. **Backfill**: `createDefaultCv()` and `migrateCv()` must provide `customSections: []`, `sectionVisibility: {}`, and `sectionOrder: []` for existing CVs.
3. **Domain helpers** (pure, unit-tested):
   - `getOrderedSections(cv): string[]` returns the ordered list of visible section IDs, defaulting missing sections to the end and filtering out hidden ones.
   - `isSectionVisible(cv, sectionId): boolean`.
   - `createCustomSection(title): CustomSection` and `createCustomItem(): CustomItem` factories.
4. **Editor UI**: new tab `"Sections"` (id `sections`) with two areas:
   - **Visibility & order**: a list of all current section IDs (built-in + custom) with toggle switches and ↑/↓ buttons to reorder.
   - **Custom sections**: add/edit/delete custom sections and their items. Each custom section has a title and a list of items (title, subtitle, description) with ↑/↓ reorder and delete.
5. **Template rendering**: all 5 templates render sections according to `sectionOrder` and `sectionVisibility`, and render custom sections with the same layout as the closest built-in section (e.g., projects or experience). Document layout constraints in code comments:
   - **Creative**: the sidebar renders a fixed subset (`personal`, `skills`, `education`, `languages`) in that order; other sections render in the main column. The `sectionOrder` is respected within each group.
   - **Modern / Classic / Minimal / Executive**: respect `sectionOrder` across all sections.
6. **Exports**: both image PDF and print export render the same ordered/visible sections as the preview.

Should-have:

- A small e2e test that hides one built-in section, adds a custom section, and verifies the preview updates.

## Non-goals

- No backend or cloud storage.
- No pre-defined section templates beyond the custom-section model.
- No changes to the built-in section forms beyond what's needed for visibility/reorder wiring.
- No i18n of section titles (Phase 9).

## Data model impact

Changes to `CvSections`, `CvSettings`, and two new interfaces. Must update:
- `src/app/domain/models/cv-model.ts`
- `src/app/domain/models/cv-defaults.ts`
- `src/app/domain/models/cv-migration.ts`

## Affected files

- `src/app/domain/models/cv-model.ts` — add `CustomSection`, `CustomItem`, update `CvSections` and `CvSettings`.
- `src/app/domain/models/cv-defaults.ts` — backfill defaults.
- `src/app/domain/models/cv-migration.ts` — backfill `customSections`, `sectionVisibility`, `sectionOrder`.
- `src/app/domain/models/section-helpers.ts` — new pure helpers.
- `src/app/domain/models/section-helpers.spec.ts` — tests for helpers.
- `src/app/features/editor/components/editor-tabs.ts` — add `sections` to the `EditorTab` union.
- `src/app/features/editor/components/sections-manager.ts` — new UI component for visibility/order + custom sections list.
- `src/app/features/editor/components/custom-section-form.ts` — new inline form to edit a custom section and its items.
- `src/app/features/editor/components/resume-templates/{modern,classic,minimal,creative,executive}-template.ts` — render by ordered visible sections + custom sections.
- `src/app/features/editor/components/resume-preview.ts` — no change if templates receive the full `Cv`.
- `src/app/pages/editor.page.ts` — add `sections` to `tabs`, wire `updateSectionVisibility`, `updateSectionOrder`, `addCustomSection`, `updateCustomSection`, `removeCustomSection`, `moveSection`, `moveCustomItem`.
- `src/app/pages/editor.html` — add `@case ("sections")` with the new components.
- `e2e/smoke.spec.ts` — optional new regression test.
- `docs/plan/PLAN.md` — check Fase 7 boxes.
- `docs/STATE.md` — update session log and next steps.

## Implementation plan

1. Extend `cv-model.ts` with `CustomSection`, `CustomItem`, update `CvSections`/`CvSettings`.
2. Update `cv-defaults.ts` and `cv-migration.ts` with backfill.
3. Create `section-helpers.ts` + `section-helpers.spec.ts` with `getOrderedSections`, `isSectionVisible`, factories.
4. Add `sections` to `EditorTab` union in `editor-tabs.ts`.
5. Create `custom-section-form.ts` (edit title + items with title/subtitle/description, add/remove/reorder items).
6. Create `sections-manager.ts` that combines:
   - A list of section IDs with visibility toggles and ↑/↓ reorder.
   - A list of custom sections; selecting one opens the `custom-section-form` inline.
   - A button to add a new custom section.
7. Update each resume template to:
   - Use `getOrderedSections(cv)` to decide which sections to render and in which order.
   - Render custom sections in the appropriate column (sidebar for Creative if the section ID belongs to a custom section in the sidebar group; otherwise main column). For simplicity, custom sections always render in the main column of Creative.
   - Keep existing section rendering logic but call it from inside the iteration/switch.
8. Wire the new tab in `editor.page.ts` and `editor.html`.
9. Add tests and run `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm e2e`.
10. Update docs.

## Acceptance criteria

- [x] `cv-model.ts` defines `CustomSection`, `CustomItem`, `sectionVisibility`, and `sectionOrder`.
- [x] Old CVs (without the new fields) load correctly via `migrateCv` with `customSections: []`, `sectionVisibility: {}`, `sectionOrder: []`.
- [x] `getOrderedSections` and `isSectionVisible` are covered by unit tests.
- [x] Editor has a "Sections" tab with visibility toggles and reorder buttons for all sections.
- [x] Users can add a custom section, give it a title, add items with title/subtitle/description, and reorder items.
- [x] Hiding a section removes it from the preview and both exports.
- [x] Reordering sections changes the order in the preview and both exports.
- [x] Custom sections render in all 5 templates and in both exports.
- [x] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm e2e` pass.

## Manual QA steps

1. `pnpm start` → create a new CV.
2. Open the "Sections" tab.
3. Hide "Skills" and confirm it disappears from the preview.
4. Reorder "Education" above "Experience" and confirm the preview updates.
5. Add a custom section "Volunteering" with one item (title "Food Bank", subtitle "Helper", description "- Served meals\n- **Organized** events").
6. Confirm the custom section appears in the preview with markdown bullets.
7. Switch through all 5 templates and confirm the custom section is visible in each.
8. Export both PDFs and confirm the hidden section is gone and the custom section is present.

## Deviations

- (none yet)
