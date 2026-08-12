import { ComponentFixture } from "@angular/core/testing";

/**
 * Helpers shared by the editor form component tests.
 *
 * These deliberately drive the components the way a user does — through real
 * DOM elements and real input/change events — so the tests keep passing across
 * the Reactive Forms → Signal Forms migration.
 */

/** All rendered `<input>` elements, including those inside Volt UI controls. */
export function inputs(fixture: ComponentFixture<unknown>): HTMLInputElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll("input"));
}

/** Find an `<input>` by its placeholder text. */
export function inputByPlaceholder(
  fixture: ComponentFixture<unknown>,
  placeholder: string,
): HTMLInputElement {
  const el = fixture.nativeElement.querySelector<HTMLInputElement>(
    `input[placeholder="${placeholder}"]`,
  );
  if (!el) throw new Error(`No input with placeholder "${placeholder}"`);
  return el;
}

/** Find a `<textarea>` by its placeholder text (prefix match). */
export function textareaByPlaceholder(
  fixture: ComponentFixture<unknown>,
  placeholderPrefix: string,
): HTMLTextAreaElement {
  const el = Array.from(
    fixture.nativeElement.querySelectorAll<HTMLTextAreaElement>("textarea"),
  ).find((t) => t.placeholder.startsWith(placeholderPrefix));
  if (!el) {
    throw new Error(
      `No textarea with placeholder starting "${placeholderPrefix}"`,
    );
  }
  return el;
}

/** Find an `<input>` by its `type` attribute (first match). */
export function inputByType(
  fixture: ComponentFixture<unknown>,
  type: string,
): HTMLInputElement {
  const el = fixture.nativeElement.querySelector<HTMLInputElement>(
    `input[type="${type}"]`,
  );
  if (!el) throw new Error(`No input of type "${type}"`);
  return el;
}

/** The single `<select>` rendered by a Volt native select. */
export function select(fixture: ComponentFixture<unknown>): HTMLSelectElement {
  const el = fixture.nativeElement.querySelector<HTMLSelectElement>("select");
  if (!el) throw new Error("No <select> rendered");
  return el;
}

/** Type into a text input/textarea the way a user would, then settle the view. */
export function type(
  fixture: ComponentFixture<unknown>,
  el: HTMLInputElement | HTMLTextAreaElement,
  value: string,
): void {
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  fixture.detectChanges();
}

/**
 * Toggle a checkbox the way a user would, then settle the view.
 *
 * Uses a real `click()` so the browser fires `click`, `input` and `change` in
 * the right order — form bindings listen for different ones.
 */
export function check(
  fixture: ComponentFixture<unknown>,
  el: HTMLInputElement,
  checked: boolean,
): void {
  if (el.checked !== checked) el.click();
  fixture.detectChanges();
}

/** Pick a `<select>` option by value, then settle the view. */
export function choose(
  fixture: ComponentFixture<unknown>,
  el: HTMLSelectElement,
  value: string,
): void {
  el.value = value;
  el.dispatchEvent(new Event("change", { bubbles: true }));
  fixture.detectChanges();
}

/** Click the first button whose visible text matches, then settle the view. */
export function clickButton(
  fixture: ComponentFixture<unknown>,
  text: string | RegExp,
): void {
  const matcher =
    typeof text === "string"
      ? (t: string) => t.trim() === text
      : (t: string) => text.test(t.trim());

  const button = Array.from(
    fixture.nativeElement.querySelectorAll<HTMLElement>("button"),
  ).find((b) => matcher(b.textContent ?? ""));

  if (!button) {
    const available = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLElement>("button"),
    )
      .map((b) => `"${(b.textContent ?? "").trim()}"`)
      .join(", ");
    throw new Error(`No button matching ${text}. Available: ${available}`);
  }
  button.click();
  fixture.detectChanges();
}

/**
 * Click a list entry to open it for editing. Some sections expose an explicit
 * "Edit" button, others only make the entry itself clickable.
 */
export function clickListEntry(
  fixture: ComponentFixture<unknown>,
  entryText: string,
): void {
  const el = Array.from(
    fixture.nativeElement.querySelectorAll<HTMLElement>(".cursor-pointer"),
  ).find((d) => (d.textContent ?? "").includes(entryText));
  if (!el) throw new Error(`No clickable list entry containing "${entryText}"`);
  el.click();
  fixture.detectChanges();
}

/** Whether any button with the given visible text is currently disabled. */
export function isButtonDisabled(
  fixture: ComponentFixture<unknown>,
  text: string,
): boolean {
  const button = Array.from(
    fixture.nativeElement.querySelectorAll<HTMLButtonElement>("button"),
  ).find((b) => (b.textContent ?? "").trim() === text);
  if (!button) throw new Error(`No button with text "${text}"`);
  return button.disabled;
}

/** The component's rendered text content, whitespace-collapsed. */
export function text(fixture: ComponentFixture<unknown>): string {
  return (fixture.nativeElement.textContent ?? "").replace(/\s+/g, " ").trim();
}
