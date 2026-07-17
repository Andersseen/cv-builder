# Spec 003 — Form & Data Polish (Fase 6)

- **Status**: Done
- **Created**: 2026-07-17
- **Author**: Kimi Code CLI

## Goal

Polish the editor forms so only essential fields are required, uploaded avatars are not stored at full mobile resolution, repeated Tailwind classes are centralized, and the per-CV font setting is finally wired to the templates and exports.

## Context

Four long-standing rough edges from the VoltUI migration and earlier phases:
1. `personal-info-form.ts` requires phone and location even though those are optional on most CVs.
2. Mobile avatar uploads can be several megabytes and bloat IndexedDB and the PDF.
3. The same ~40 Tailwind classes are copy-pasted across every form input.
4. `CvSettings.fontFamily` exists in the model but is dead UI and ignored by the templates.

## Requirements

Must-have:

1. **Relax required fields**: only `fullName` is required in `personal-info-form.ts`. `email` must still be validated as an email, but only when it is not empty. Remove the `*` labels and required error messages from Phone and Location.
2. **Avatar downscale**: when a file is selected in `personal-info-form.ts`, resize it on a canvas to max 400 px on the longest side, export as JPEG quality 0.85, and store the resulting data URL. Accept any image file type the browser can decode.
3. **Deduplicate input classes**: add a Tailwind v4 `@utility input-field` in `src/styles.css` that captures the canonical input styling; replace the duplicated class strings on every `volt-input`/`volt-textarea` in the 7 editor forms with `input-field`. Include a `resize-none` modifier for `volt-textarea` where needed.
4. **Wire `fontFamily`**: add a native `<select>` font picker to `template-selector.ts` with 4 print-safe options. Add `fontFamily` inputs to the 5 resume templates and bind them to `[style.font-family]`. Pass `cv().settings.fontFamily` from `resume-preview.ts`. Wire the selector output through `editor.page.ts` to `cvStore.updateActiveCv({ settings: { fontFamily } })`.
5. **Backfill**: no model changes — `fontFamily` already has a default in `createDefaultSettings()`. Existing CVs load fine because the field was already backfilled in `CvStore.loadAll()` (via `migrateCv`).

Should-have:

- A small unit test for the avatar downscale helper that asserts the output data URL is JPEG and smaller than the original (using a tiny canvas blob).

## Non-goals

- No new CV sections or model fields.
- No external font loading (only web-safe/generic font stacks).
- No changes to export rendering logic beyond the inherited font style.

## Data model impact

None. `CvSettings.fontFamily` already exists.

## Affected files

- `src/app/features/editor/components/personal-info-form.ts` — required validators, labels, avatar resize.
- `src/app/features/editor/components/{experience,education,skills,projects,certifications,languages}-form.ts` — replace duplicated classes with `input-field`.
- `src/app/styles.css` — new `@utility input-field`.
- `src/app/features/editor/components/template-selector.ts` — font selector.
- `src/app/features/editor/components/resume-preview.ts` — pass `fontFamily` to templates.
- `src/app/features/editor/components/resume-templates/{modern,classic,minimal,creative,executive}-template.ts` — accept `fontFamily` input and bind to `[style.font-family]`.
- `src/app/pages/editor.page.ts` — handle `fontFamilyChanged` from `template-selector`.
- `src/app/pages/editor.html` — wire `(fontFamilyChanged)`.
- `docs/plan/PLAN.md` — check Fase 6 boxes.
- `docs/STATE.md` — update session log and next steps.

## Implementation plan

1. Update `personal-info-form.ts` validators and labels; add a pure-ish helper to resize image via canvas and use it in `onAvatarSelected`.
2. Define `input-field` and `input-field-resize-none` utilities in `styles.css`.
3. Replace duplicated classes in all 7 form files with `input-field` (and `input-field-resize-none` for textareas that need it).
4. Add `fontFamily` input + selector to `template-selector.ts`; emit `fontFamilyChanged`.
5. Add `fontFamily` input to each resume template and bind `[style.font-family]="fontFamily()"`.
6. Update `resume-preview.ts` to pass `[fontFamily]="cv().settings.fontFamily"` to every template.
7. Wire `fontFamilyChanged` in `editor.page.ts` → `cvStore.updateActiveCv({ settings: { fontFamily } })`.
8. Verify `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm e2e`.
9. Update docs.

## Acceptance criteria

- [ ] Only `fullName` is marked required and shows an error in `personal-info-form`; Phone/Location have no `*` and no required error.
- [ ] An empty email is allowed; an invalid email shows a validation error.
- [ ] Uploading an 8 MP photo stores a JPEG under ~100 KB and the preview still shows it.
- [ ] All `volt-input`/`volt-textarea` in the 7 forms use `input-field` instead of the duplicated long string.
- [ ] The editor visually looks the same after the deduplication (no missing borders/radius/padding).
- [ ] `template-selector` shows a font selector with 4 options.
- [ ] Changing the font updates the live preview and both exports (PDF image + print) reflect the selected font.
- [ ] All 5 templates respect the `fontFamily` setting.
- [ ] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm e2e` pass.

## Manual QA steps

1. `pnpm start` → dashboard → new resume.
2. Personal tab: confirm only Full Name has `*`; leave Email empty and confirm no error; type "bad-email" and confirm error appears; leave Phone/Location empty and confirm no error.
3. Upload a large photo (or use a device photo); confirm the avatar renders and the stored data URL is JPEG (`data:image/jpeg`) and reasonably small.
4. Check each form tab: inputs should have consistent border, radius, padding, focus ring.
5. Template tab: change font family; confirm preview text changes font.
6. Export both PDFs and confirm the font is applied in the generated files.

## Deviations

- (none yet)
