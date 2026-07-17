# Spec 002 — Onboarding & Completeness Guide (Fase 5)

- **Status**: Done
- **Created**: 2026-07-17
- **Author**: Kimi Code CLI

## Goal

Add a one-click example CV and a live completeness score with actionable suggestions so new users are not intimidated by a blank editor. Ties to the product principle: *Fast and simple wins over feature-rich*.

## Context

The editor opens with 8 tabs and a blank form. A non-technical user has no reference for what a good CV looks like in this app, nor any guidance on what is missing. This feature gives them a realistic example in one click and a live score that tells them what to improve next.

## Requirements

Must-have:

1. **Example CV factory**: `createExampleCv()` in `src/app/domain/models/cv-example.ts` returns a fully populated `Cv` with realistic personal info, summary, 2 experience entries with markdown bullets, 1 education, 4 skills, 2 projects, 2 certifications, and 2 languages.
2. **Example CV entry points**: a "Start with an example" action in the dashboard empty state and as a secondary button in the dashboard header. Both create the example CV and open the editor.
3. **Completeness score**: pure function `scoreCompleteness(cv: Cv)` in `src/app/domain/models/cv-completeness.ts` returning `score` (0–100) and a list of `suggestions` with `{ severity, message, tabId }`. Covered by unit tests.
4. **Completeness UI**: a small badge/ring in the editor toolbar showing the score. Clicking it opens a popover with the suggestions; each suggestion is a button that navigates to its tab. The score and suggestions update live via `computed` on the active CV.
5. **Backfill safety**: no model changes, so no backfill is needed. The example CV must use only existing fields.

Should-have:

- Color-coded score ring: red (<50), yellow (50–79), green (≥80).
- Summary length suggestion if summary is present but very short (<80 chars).

## Non-goals

- No AI-generated content.
- No new CV sections or custom sections.
- No i18n (Phase 9).
- No export changes.

## Data model impact

None. Uses the existing `Cv`/`CvSections`/`CvSettings` interfaces.

## Affected files

- `src/app/domain/models/cv-example.ts` — new example CV factory.
- `src/app/domain/models/cv-example.spec.ts` — new tests for the factory.
- `src/app/domain/models/cv-completeness.ts` — new pure scoring function.
- `src/app/domain/models/cv-completeness.spec.ts` — new tests for scoring.
- `src/app/features/dashboard/components/empty-state.ts` — add "Start with an example" button.
- `src/app/features/dashboard/components/dashboard-header.ts` — add "Start with an example" output and secondary button.
- `src/app/pages/dashboard.page.ts` — wire `createExample()` to the store and open the editor.
- `src/app/features/editor/components/completeness-score.ts` — new UI component for the score + suggestions popover.
- `src/app/features/editor/components/editor-toolbar.ts` — integrate the score component.
- `src/app/pages/editor.page.ts` — import `CompletenessScore`.
- `docs/plan/PLAN.md` — check Fase 5 boxes.
- `docs/STATE.md` — update session log and next steps.

## Implementation plan

1. Create `cv-example.ts` + `cv-example.spec.ts` with realistic data and a test that the factory returns a valid CV with all populated sections.
2. Create `cv-completeness.ts` + `cv-completeness.spec.ts` with scoring heuristics and tests for blank/example CVs.
3. Add "Start with an example" buttons to `empty-state.ts` and `dashboard-header.ts`; wire outputs to `dashboard.page.ts`.
4. Add `createExample()` in `Dashboard` page that calls a new `cvStore.createExample()` method (preferred over exposing the factory directly to keep state centralized).
5. Add `createExample()` to `CvStore` using the factory, persist, and activate the new CV.
6. Create `completeness-score.ts` UI component.
7. Integrate `completeness-score` into `editor-toolbar.ts` and pass the active CV from the editor page.
8. Verify: `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm e2e`.
9. Update docs.

## Acceptance criteria

- [ ] Empty state shows a "Start with an example" button that creates an example CV and opens the editor.
- [ ] Dashboard header shows a secondary "Start with an example" button with the same behavior.
- [ ] `createExampleCv()` returns a CV with all sections populated and no empty required-looking fields.
- [ ] `scoreCompleteness()` returns a score of 0–100 plus suggestions with `severity` and `tabId`.
- [ ] A blank CV has a low score with useful suggestions (e.g., missing name, summary, experience, skills).
- [ ] An example CV has a high score (≥80) and few or no suggestions.
- [ ] The editor toolbar shows a live score badge that updates while typing.
- [ ] Clicking the badge opens suggestions; clicking a suggestion navigates to the corresponding tab.
- [ ] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm e2e` pass.
- [ ] Light and dark app themes both render the score UI correctly.
- [ ] Preview and exports are unaffected.

## Manual QA steps

1. `pnpm start` → open dashboard.
2. Delete all CVs or use a fresh profile; click "Start with an example" in the empty state.
3. Confirm the editor opens and the preview shows a complete CV with name, summary, experience bullets, etc.
4. Check the score badge in the toolbar is ≥80.
5. Open the suggestions popover; confirm there are no critical warnings.
6. Switch to the Personal tab, clear the full name, and switch to another tab.
7. Confirm the score drops and a suggestion for the Personal tab appears.
8. Click that suggestion; confirm it navigates to the Personal tab.
9. Go back to the dashboard, click "New Resume", then open the editor.
10. Confirm the blank CV has a low score and suggestions for multiple tabs.

## Deviations

- (none yet)
