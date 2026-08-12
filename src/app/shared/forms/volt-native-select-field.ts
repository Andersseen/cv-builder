import {
  Directive,
  ElementRef,
  afterRenderEffect,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { FormValueControl } from "@angular/forms/signals";

/**
 * Makes Volt UI's `<volt-native-select>` usable as a form control.
 *
 * **Why this exists.** Every other Volt control the editor uses (`volt-input`,
 * `volt-textarea`, `volt-checkbox`) implements `ControlValueAccessor`, which
 * Angular 22's `[formField]` binds to out of the box. `VoltNativeSelect` does
 * not: it is a presentational wrapper that renders its own `<select>` and
 * projects the `<option>`s into it, and it exposes no `value` at all. Binding a
 * form control to it therefore fails — with Reactive Forms it threw
 * `NG01203: No value accessor`, and Signal Forms would reject it as an invalid
 * `[formField]` host for the same reason.
 *
 * **What this does.** Declares the `value` model that Signal Forms looks for on
 * a custom control host, and bridges it to the wrapper's inner `<select>`:
 * writes flow model → DOM after render (so projected `<option>`s already
 * exist), and user selections flow back on the `change` event, which bubbles
 * out of the inner select.
 *
 * This is a local shim, not a fix. The proper fix belongs in Volt UI — see
 * docs/signal-forms-migration.md.
 */
@Directive({
  // Opt-in attribute rather than matching `[formField]` directly, so the
  // selector keeps the repo's `app` directive prefix. Pair it with
  // `[formField]` on every `<volt-native-select>` that binds a field.
  selector: "volt-native-select[appVoltSelectField]",
  host: {
    "(change)": "onSelectChange($event)",
    "(focusout)": "touch.emit()",
  },
})
export class VoltNativeSelectField<
  T extends string,
> implements FormValueControl<T> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The bound field's value. Signal Forms keeps this in sync both ways. */
  readonly value = model("" as T);

  /** Bound by `[formField]` from the field's disabled state. */
  readonly disabled = input(false);

  /** Emitted on blur so the field can mark itself touched. */
  readonly touch = output<void>();

  constructor() {
    afterRenderEffect(() => {
      const select = this.selectElement();
      if (!select) return;

      const value = this.value();
      if (select.value !== value) select.value = value;

      const isDisabled = this.disabled();
      if (select.disabled !== isDisabled) select.disabled = isDisabled;
    });
  }

  protected onSelectChange(event: Event): void {
    const select = event.target;
    if (select instanceof HTMLSelectElement) {
      this.value.set(select.value as T);
    }
  }

  private selectElement(): HTMLSelectElement | null {
    return this.host.nativeElement.querySelector("select");
  }
}
