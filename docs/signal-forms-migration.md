# Signal Forms migration

Record of the Angular 22 upgrade and the migration of the editor forms from
Reactive Forms to the stable Angular 22 Signal Forms API (`@angular/forms/signals`).

Written as implementation evidence: what changed, what it cost, and what did
not work as hoped.

---

## 1. Angular version before / after

| Package          | Before  | After  |
| ---------------- | ------- | ------ |
| `@angular/*`     | 21.2.18 | 22.1.1 |
| `@angular/build` | 21.2.19 | 22.1.3 |
| `@analogjs/*`    | 2.6.3   | 2.7.0  |
| `vite`           | 6.2.7   | 8.2.1  |
| `typescript`     | 5.9.3   | 6.0.3  |
| `vitest`         | 3.2.7   | 4.1.10 |
| `angular-eslint` | 21.4.0  | 22.1.0 |
| `@angular/cdk`   | 21.2.14 | 22.1.1 |

UI libraries, bumped afterwards to their latest releases:

| Package              | Before | After                  |
| -------------------- | ------ | ---------------------- |
| `@voltui/components` | 0.6.0  | 1.0.0                  |
| `angular-movement`   | 0.5.0  | 0.7.0                  |
| `quartz-headless`    | 0.0.3  | 0.0.5                  |
| `lumen-icons`        | 0.2.0  | 0.2.0 (already latest) |

`@angular/animations` was **dropped entirely**. Nothing in `src/` imported it,
`angular-movement` documents that it needs no animations setup, and
`provideAnimations()` / `provideNoopAnimations()` are deprecated (Angular 20.2,
removal intended in v23). Both providers were removed from `src/main.ts` and
`src/app/app.config.server.ts`; `provideMovement({ disabled: true })` is what
actually keeps motion inert during prerendering.

Added (dev only, for component tests): `@analogjs/vitest-angular` 2.7.0 and
`@analogjs/vite-plugin-angular` 2.7.0.

TypeScript 6.0 is not optional — `@angular/build@22` declares
`typescript: ">=6.0 <6.1"`. Vite 8 comes in as a transitive requirement of the
same package.

**The upgrade itself needed zero source changes.** `pnpm build`, `pnpm lint` and
the 75 existing unit tests all passed against Angular 22 before a single form
was touched. The only Angular-22-specific work was in the forms migration that
followed.

### Peer-range lag in the UI libraries

`@voltui/components@1.0.0`, `angular-movement@0.7.0`, `lumen-icons@0.2.0` and
`quartz-headless@0.0.5` all declare `@angular/core: ^21.x` peers. pnpm reports
these as unmet; nothing actually breaks (production build, 184 unit/component
tests and 22 Playwright tests are green). No newer release of any of them
widens the range yet. This is a metadata lag, not an incompatibility, but it
means `--strict-peer-dependencies` installs would fail.

`quartz-headless` is bumped for consistency but is **not imported anywhere in
`src/`** — a candidate for removal.

---

## 2. Forms migrated

All eight. No component was left on Reactive Forms.

| Component            | Pattern                 | Notes                                               |
| -------------------- | ----------------------- | --------------------------------------------------- |
| `PersonalInfoForm`   | continuous sync         | `model()` + `form()`; biggest win                   |
| `ExperienceForm`     | draft buffer            | `disabled()` replaces a `valueChanges` subscription |
| `EducationForm`      | draft buffer            | mechanical                                          |
| `ProjectsForm`       | draft buffer            | mechanical                                          |
| `CertificationsForm` | draft buffer            | mechanical                                          |
| `SkillsForm`         | draft buffer + select   | native `<select>` via `voltNativeSelect`            |
| `LanguagesForm`      | draft buffer + select   | native `<select>` via `voltNativeSelect`            |
| `CustomSectionForm`  | continuous sync + array | nested array; was a hybrid, now one typed model     |

`SectionsManager` was not migrated because it never had a form — it is a
list of toggle/reorder buttons over `CvSettings`.

## 3. Forms intentionally not migrated

None. Every form that used `FormGroup` now uses `form()`.

---

## 4. What was removed

Counted across the eight form components, comparing against the pre-migration
commit:

| Construct                            | Occurrences removed |
| ------------------------------------ | ------------------- |
| `new FormControl(...)`               | 38                  |
| `Validators.*`                       | 15                  |
| `ReactiveFormsModule` (import/usage) | 16                  |
| `.reset(...)` (Reactive Forms)       | 12                  |
| `patchValue(...)`                    | 8                   |
| `getRawValue()`                      | 8                   |
| `new FormGroup(...)`                 | 8                   |
| `markAllAsTouched()`                 | 6                   |
| `takeUntilDestroyed()`               | 4                   |
| `valueChanges` subscriptions         | 3                   |
| `effect()` used only to mirror state | 2                   |

### RxJS subscriptions removed (3)

1. `PersonalInfoForm` — `form.valueChanges.pipe(takeUntilDestroyed()).subscribe(...)`,
   the whole outbound half of the sync layer.
2. `ExperienceForm` — `form.controls.current.valueChanges.pipe(takeUntilDestroyed()).subscribe(...)`,
   which cleared and disabled `endDate`. Replaced by a declarative
   `disabled(exp.endDate, ({ valueOf }) => valueOf(exp.current))` in the schema.
3. `CustomSectionForm` — `form.valueChanges.subscribe(...)`. **This one had no
   `takeUntilDestroyed`**, so it leaked a subscription every time a custom
   section was opened for editing. Found while migrating; gone now.

The editor form layer no longer imports RxJS at all.

### Effects removed (2)

Both were pure mirroring effects — the exact anti-pattern Signal Forms is meant
to remove:

```ts
// PersonalInfoForm (before)
effect(() => {
  const d = this.data();
  this.form.patchValue(d, { emitEvent: false });
  this.avatarPreview.set(d.avatarUrl || "");
});
```

```ts
// CustomSectionForm (before)
effect(() => {
  const section = this.section();
  this.form.patchValue({ title: section.title }, { emitEvent: false });
  this.items.set(section.items ?? []);
});
```

No new effects were introduced anywhere in the migration.

---

## 5. Synchronisation that still exists, and why

**Draft components keep a private `signal<T>` edit buffer.** This is
deliberate and unchanged: `ExperienceForm` and friends must not mutate the
stored CV until the user presses Add/Update, and Cancel must discard. Signal
Forms does not remove the need for a draft — it just makes the draft a typed
signal instead of a `FormGroup`. `edit(entry)` copies (`{ ...entry }`) so the
draft can never alias an object inside `items()`.

**Draft components still expose `input()` + `output()` rather than `model()`.**
The parent owns the list; the child edits one element. A two-way binding would
imply the child can write the list at will, which is exactly the semantics the
draft is there to prevent.

---

## 6. Architectural change: `model()` instead of `input()` + `effect()` + `output()`

This is the single change that removed the most machinery, and it applies to the
two continuously-synchronised forms (`PersonalInfoForm`, `CustomSectionForm`).

Before:

```
input signal → effect → patchValue(…, {emitEvent:false}) → FormGroup
                                                              ↓ valueChanges
                                                           output → CvStore
```

After:

```
model() ⇄ form()
   ↑ writes from the parent do not emit
   ↓ writes from the fields emit <name>Change → CvStore
```

`form()` takes a `WritableSignal<T>`, and `ModelSignal<T>` _is_ a
`WritableSignal<T>` that emits its change output on every programmatic write.
That gives echo suppression for free: a value pushed down from the store updates
the fields but does not bounce back out, which is what the old
`{ emitEvent: false }` was for. There is no second copy of the model anywhere in
the component.

Cost: `PersonalInfoForm`'s output was renamed `changed` → `dataChange`, and
`editor.html` binds `(dataChange)` instead of `(changed)`. `CustomSectionForm`
needed no parent change at all — `model()` generates `sectionChange`, which is
already what `sections-manager.ts` listened to.

`avatarUrl` moved into the same `PersonalInfo` model rather than living in a
separate `avatarPreview` signal, so the "keep the avatar and the text fields in
sync" problem simply stopped existing.

---

## 7. Volt UI / CVA interoperability

**Result: CVA interop works, with exactly one exception.**

**Result: every Volt control the editor uses binds with `[formField]`, with no
adapter and no changes to Volt UI.** Getting there took an upstream release —
see the `volt-native-select` story below.

| Volt control               | How it binds                     | `[formField]` works? |
| -------------------------- | -------------------------------- | -------------------- |
| `volt-input`               | `ControlValueAccessor`           | yes, out of the box  |
| `volt-textarea`            | `ControlValueAccessor`           | yes, out of the box  |
| `volt-checkbox`            | `ControlValueAccessor`           | (not used here)      |
| `select[voltNativeSelect]` | directive on a native `<select>` | yes, since 1.0.0     |

`FormField` reads any `ControlValueAccessor` provided on its host element, so
`<volt-input [formField]="personalForm.fullName" />` binds with no adapter, no
wrapper and no changes to Volt UI. `writeValue`, `registerOnChange`,
`registerOnTouched` and `setDisabledState` are all driven correctly, including
the touched-on-blur behaviour the validation UI depends on. Native `<input>`,
`<input type="checkbox">`, `<textarea>` and `<select>` bind directly too.

### The `volt-native-select` problem — and a pre-existing production bug

In `@voltui/components@0.6.0`, `VoltNativeSelect` was a _component_: it rendered
its own `<select>` and projected the `<option>`s into it. It implemented no
`ControlValueAccessor` and exposed no `value` input at all.

Writing the regression tests for `SkillsForm` surfaced that this was **already
broken in production, before the migration**:

```
NG01203: No value accessor for form control name: 'level'
```

Confirmed in a real browser against the pre-migration code. The user-visible
effect: the Skill _Level_ and Language _Proficiency_ dropdowns were inert. Every
skill saved with the default level regardless of what was picked, and editing an
existing skill never showed its stored level. It went unnoticed because the
inputs still render — Angular throws during directive setup, not during
templating — and no test opened those forms.

The migration first shipped a 60-line local shim
(`shared/forms/volt-native-select-field.ts`) that declared the `value` model
Signal Forms looks for and bridged it to the wrapper's inner `<select>`.

**`@voltui/components@1.0.0` made the shim obsolete.** `VoltNativeSelect` became
a _directive on a native select_ — selector `select[voltNativeSelect]`, same host
classes — so the `<select>` now lives in the consumer's template and
`[formField]` binds to it through Angular's native form-element path:

```html
<select voltNativeSelect [formField]="skillForm.level">
  @for (level of levels; track level) {
  <option [value]="level">{{ level }}</option>
  }
</select>
```

The shim was deleted. This is the better fix by a wide margin: the control is a
real form element, so it works with Signal Forms _and_ Reactive Forms _and_
`ngModel` with no adapter of any kind, and the `NG01203` class of bug cannot
recur.

Two notes for anyone binding a `<select>` whose `<option>`s come from `@for`:

- The native binding listens for **`input`**, not `change`. A test that
  dispatches only `change` will silently fail to update the model (a real
  browser fires both).
- Angular re-applies the field value to the select via a `MutationObserver` once
  the projected options exist. That callback is a microtask, so a component test
  needs `await fixture.whenStable()` after opening the form before asserting the
  select's value — see the `settle()` helper in `form-test-utils.ts`. In a real
  browser it just works.

### Remaining Volt UI suggestions (do NOT implement in this repo)

Filed here as notes for the upstream Volt UI project:

1. **`VoltCheckbox` could implement `FormCheckboxControl`** (`checked` model)
   rather than only `ControlValueAccessor`. CVA works today, but the native
   contract is cheaper and gives correct `touch` semantics.
2. `volt-input` / `volt-textarea` could adopt `FormValueControl` too. Lower
   priority — the CVA path works well.
3. Widen the Angular peer range to `^21.2.0 || ^22.0.0`. Still `^21.2.0` as of
   `@voltui/components@1.0.0` and `angular-movement@0.7.0`.

---

## 8. Nested-array findings (`CustomSectionForm`)

The whole `CustomSection` — `title` plus `items[]`, each with three text fields
— is now one typed model. Nested fields bind exactly like top-level ones:

```html
@for (item of items(); track item.id; let i = $index) {
<input [formField]="sectionForm.items[i].title" />
}
```

This replaced a genuine hybrid: a `FormGroup` for the title, a separate
`signal<CustomItem[]>` for the items, manual `[value]`/`(input)` handlers on
every nested input, hand-written immutable array reconstruction, and explicit
`emitChange()` calls after each mutation. That component lost 21 lines and,
more importantly, one entire category of state.

**Two things to know about array fields:**

1. **Do not `@for` over the field tree.** The obvious spelling

   ```html
   @for (itemField of sectionForm.items; track itemField().value().id) { … }
   ```

   throws `NG01904: Orphan field, can't find element in array <root>.items` the
   moment an item is removed — the tracking expression still evaluates against
   the field for the index that just vanished. Iterate the _model_ array, track
   by `id`, and index back into `sectionForm.items[i]`. Reorder, remove and
   focus retention all behave correctly that way.

2. **Structural edits are not field bindings.** Add / remove / reorder go
   through the array field's own value signal
   (`sectionForm.items().value.update(fn)`). Signal Forms binds _fields_, it
   does not manage array membership. That is fine and explicit, but it is worth
   knowing that `FormArray`'s `push`/`removeAt` have no direct equivalent.

---

## 9. Experience draft-form findings

The `current` / `endDate` relationship was the most interesting case.

Before: a `valueChanges` subscription on `current` that called
`endDate.setValue("")` and `endDate.disable()`.

After: one declarative line in the schema —

```ts
disabled(exp.endDate, ({ valueOf }) => valueOf(exp.current));
```

— and the template renders the field only when `!experienceForm.endDate().disabled()`.

**But `disabled()` does not clear the value.** In Signal Forms the model _is_
the value; a disabled field keeps whatever it holds, and there is no
`getRawValue()`/`value` split to hide it. Signal Forms has `disabled`, `hidden`,
`readonly` and `validate` — declarative field _state_ — but **no declarative
value derivation**. So the "a current role has no end date" rule is enforced
explicitly at submit:

```ts
private normalize(exp: Experience): Experience {
  return exp.current ? { ...exp, endDate: "" } : { ...exp };
}
```

This is a small, deliberate behaviour improvement: the old code destroyed a
typed end date the instant the box was ticked, so a mis-click lost data. Now the
draft keeps it (un-ticking brings it back) and only the _saved_ entry is
normalised. The persisted data is identical either way.

---

## 10. Where Reactive Forms was clearer

Honest list:

- **Form submission.** `(ngSubmit)` comes from `ReactiveFormsModule`. Without
  it you use the native `(submit)` and call `preventDefault()` yourself. The
  Signal Forms `submit()` API and the `[formRoot]` directive exist, but
  `submit()` wants an `action` returning `Promise<TreeValidationResult>` — an
  async server-action shape. For a local, synchronous "push onto an array" it
  adds a Promise round-trip and hides the control flow, so all six draft forms
  keep an explicit `onSubmit(event)`. `FormRoot` was evaluated and not adopted:
  with no submission options it would only call `preventDefault()`, which the
  handler already does.
- **Cross-field value effects.** `valueChanges` could write another field's
  value in one place. Signal Forms deliberately cannot, so that logic moves to
  submit time (see §9). Declarative _state_ is better; declarative _values_ are
  simply not offered.
- **Array membership.** `FormArray.push()` / `removeAt()` read more directly
  than `items().value.update(list => [...list, newItem])`.

## 11. Where Signal Forms was clearly better

- **Continuous-sync forms.** `model()` + `form()` deletes the effect, the
  `patchValue`, the `valueChanges` subscription, the `getRawValue()` and the
  `{ emitEvent: false }` echo guard — five moving parts collapse into one
  writable signal. Single source of truth, no duplicated state.
- **Typing.** `personalForm.fullName` is typed from the model. There is no
  `formControlName="fullNmae"` string to get wrong, and `getRawValue() as
Experience` casts disappeared. Renaming a domain field is now a compile error
  instead of a silent runtime null.
- **Nested structures.** One coherent `CustomSection` model instead of a
  `FormGroup` + a parallel signal array + manual event handlers.
- **Conditional field state.** `disabled(path, predicate)` in the schema beats
  an imperative subscription that calls `enable()`/`disable()`.
- **Validation reads as a spec.** `required(p.fullName); email(p.email);` in one
  place, versus validators scattered through 38 `new FormControl` calls.

---

## 12. Line counts

Across the eight form components: **2060 → 2013 lines (−47)**. The 80-line Volt
select shim that the migration originally needed was deleted once
`@voltui/components@1.0.0` turned `VoltNativeSelect` into a directive on a native
`<select>`, so the net change is just the −47.

LOC is the wrong metric here and it is reported only because it is easy to
measure honestly. The templates dominate these files and barely changed; what
actually shrank was the _state_ — 3 subscriptions, 2 mirroring effects, 8
`patchValue` calls, 8 `getRawValue()` casts and one duplicated `signal<CustomItem[]>`
are gone. `PersonalInfoForm` (−29) and `CustomSectionForm` (−21) are the real
wins; the four mechanical draft forms are within ±9 lines of where they started.

---

## 13. Test coverage added

Component testing did not exist in this repo before (`vitest.config.ts` ran a
pure-Node project with no Angular compiler). It now has two Vitest projects:

- `domain` — unchanged, Node environment, 75 tests, still runs in ~250 ms.
- `component` — jsdom + `@analogjs/vite-plugin-angular` + zoneless TestBed,
  `*.ct.spec.ts` only.

| Suite                            | Tests | Covers                                                                                            |
| -------------------------------- | ----- | ------------------------------------------------------------------------------------------------- |
| `personal-info-form.ct.spec.ts`  | 15    | initial values, per-keystroke emission, required/email, touched UI, avatar, no echo on input push |
| `experience-form.ct.spec.ts`     | 24    | create/edit/cancel/remove/reorder, validation, `current`↔`endDate`, no mutation before submit     |
| `simple-forms.ct.spec.ts`        | 24    | Education / Projects / Certifications add-edit-cancel-remove-reorder                              |
| `select-forms.ct.spec.ts`        | 19    | Skills / Languages, including the select binding                                                  |
| `custom-section-form.ct.spec.ts` | 15    | title, nested item edits, add/remove/reorder, no echo                                             |
| `editor-store.ct.spec.ts`        | 12    | form → CvStore → preview, undo/redo, autosave debounce, draft isolation                           |

Plus `e2e/signal-forms.spec.ts` (8 Playwright tests): Volt select interop in a
real browser, draft cancel across a reload, keyboard undo/redo, nested custom
section add/reorder/remove.

Totals: **75 → 184 unit/component tests**, **14 → 22 Playwright tests**.

Every component test was written against the _pre-migration_ Reactive Forms
implementation first and had to pass there before the component was touched.
The 13 that could not pass were the `volt-native-select` bug in §7.

---

## 14. Bugs and regressions found

1. **`NG01203` on the Skills/Languages selects** — pre-existing production bug,
   see §7. Fixed, first with a local shim and then properly by
   `@voltui/components@1.0.0`, which let the shim be deleted.
2. **Leaked subscription in `CustomSectionForm`** — `valueChanges.subscribe()`
   with no `takeUntilDestroyed`, see §4. Fixed by deletion.
3. **`NG01904` orphan array fields** — a genuine Signal Forms footgun hit during
   the migration, see §8. Fixed by iterating the model.
4. No behavioural regressions were introduced. The one deliberate behaviour
   change is the non-destructive `endDate` in §9.

### Pre-existing behaviour left alone

`History` coalesces pushes within 1 s and stores the state _before_ each change,
so redo after a burst of typing restores the second-to-last keystroke ("Ad"
rather than "Ada"). `src/app/application/` was not modified by this migration,
and the migrated forms emit exactly one `updateActiveCv` per keystroke just as
`valueChanges` did — so undo/redo behaviour is unchanged. It is asserted as-is
in `editor-store.ct.spec.ts` rather than quietly "fixed", since changing it is a
product decision outside this scope.

---

## 15. Surprises

- **The Angular 22 upgrade was a non-event.** Zero source changes; the churn was
  all in the toolchain (TypeScript 6, Vite 8, Vitest 4).
- **Writing the regression tests was worth more than the migration.** The
  headline defect fixed here — dead dropdowns in two editor tabs — was found by
  Phase 1, not by Signal Forms.
- **`model()` is the real unlock**, not `form()`. Most of the deleted
  synchronisation went away because the model input writes through, not because
  the form API changed.
- **CVA interop is genuinely transparent.** No wrapper, no bridge, no changes to
  Volt UI for three of the four controls — and after the 1.0.0 bump, for all
  four. The best fix for the fourth was not a Signal Forms adapter at all but
  making the control a plain `<select>`.
- **`@angular/animations` was dead weight.** The app carried the dependency and
  two deprecated providers without a single animation using them.
- **Signal Forms is opinionated about values.** It will manage field _state_
  declaratively but refuses to derive _values_. That is defensible, and it does
  push value rules to explicit places, but it is a real difference from
  `valueChanges` that costs a few lines per rule.

---

## 16. Verdict

Signal Forms improved CV Builder. The gains are concentrated exactly where the
brief predicted: the continuously-synchronised forms lost an entire
synchronisation layer, and the nested custom-section editor lost a hybrid
architecture. The draft forms are roughly neutral on their own — a few lines
longer in places — but migrating them keeps the editor consistent, and they
gained the same type safety and schema-style validation.

The costs are real but small: an explicit submit handler per draft form and a
submit-time normalisation where a `valueChanges` write used to sit. The one
genuinely awkward piece — a local shim for a third-party control that was never
form-compatible — disappeared when `@voltui/components@1.0.0` reshaped
`VoltNativeSelect` into a directive on a native `<select>`.
