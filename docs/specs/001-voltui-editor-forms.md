# Spec 001 — VoltUI editor forms

- **Status**: Done
- **Created**: 2026-07-10
- **Author**: Codex

## Goal

Move the editor form chrome toward `@voltui/components` while fixing the Angular `ChangeDetectionStrategy.OnPush` static-analysis errors introduced by malformed imports.

## Context

The Angular 21 upgrade and VoltUI dependency installation are already present. Several editor components now show Angular Language Service errors like `changeDetection must be a member of ChangeDetectionStrategy enum` because their `@angular/core` imports were left in an odd multi-line state. The editor forms still mostly use raw buttons/inputs even though VoltUI is available.

## Requirements

1. Every component keeps `changeDetection: ChangeDetectionStrategy.OnPush` with a statically analyzable import from `@angular/core`.
2. Editor form controls use VoltUI primitives where safe: `VoltButton`, `VoltInput`, `VoltTextarea`, and `VoltNativeSelect`.
3. CV data flow remains unchanged: all edits continue through existing form outputs and `CvStore` orchestration.
4. Resume templates remain untouched.

Should-have:

- Keep the migration focused and easy to review, without broad layout redesign.

## Non-goals

- No data model changes.
- No new dependencies.
- No migration of resume templates to semantic app tokens or VoltUI.
- No full redesign of every app chrome component in this pass.

## Data model impact

None.

## Affected files

- `docs/specs/001-voltui-editor-forms.md` — implementation contract.
- `src/app/features/editor/components/personal-info-form.ts` — normalize imports and use VoltUI controls.
- `src/app/features/editor/components/experience-form.ts` — normalize imports and use VoltUI controls.
- `src/app/features/editor/components/education-form.ts` — normalize imports and use VoltUI controls.
- `src/app/features/editor/components/skills-form.ts` — normalize imports and use VoltUI controls.
- `src/app/features/editor/components/certifications-form.ts` — use VoltUI controls.
- `src/app/features/editor/components/projects-form.ts` — use VoltUI controls.
- `src/app/features/editor/components/languages-form.ts` — use VoltUI controls.
- `src/app/features/editor/components/color-picker.ts` — normalize imports and use `VoltInput` for hex entry.
- `src/app/pages/(home).page.ts` — normalize malformed Angular import if present.
- `src/app/pages/dashboard.page.ts` — normalize malformed Angular import if present.
- `docs/STATE.md` — update session status.

## Implementation plan

1. Normalize malformed `@angular/core` imports.
2. Add focused VoltUI imports to editor form components.
3. Replace raw buttons/inputs/textarea/select with VoltUI equivalents where CVA-compatible.
4. Build to catch Angular template/type regressions.
5. Mark spec done and update state.

## Acceptance criteria

- [x] Angular no longer reports unknown `ChangeDetectionStrategy` references in edited components.
- [x] Editor form inputs and primary actions render through VoltUI components.
- [x] CV form submit/edit/remove/reorder behavior remains wired to existing methods.
- [x] `pnpm build` passes with zero errors.
- [x] Works in both light and dark app theme.

## Manual QA steps

1. Run `pnpm start`.
2. Open `/dashboard`, create or open a CV, then open `/editor?cv=<id>`.
3. Add/edit/remove/reorder entries in Personal, Experience, Education, Skills, Projects, Certifications, and Languages.
4. Toggle light/dark theme and verify form controls remain readable.
5. Verify preview still updates live.

## Deviations

- Kept native labels instead of `VoltLabel` because the current inline/wrapping label markup is safer for file upload and checkbox interactions; VoltUI migration focused on buttons, inputs, textarea, and native select.
