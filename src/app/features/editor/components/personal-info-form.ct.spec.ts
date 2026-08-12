import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { PersonalInfoForm } from "./personal-info-form";
import { PersonalInfo } from "../../../domain/models/cv-model";
import { createDefaultPersonalInfo } from "../../../domain/models/cv-defaults";
import {
  inputByPlaceholder,
  textareaByPlaceholder,
  type,
  clickButton,
  text,
} from "./form-test-utils";

/**
 * Behavioural regression suite for the personal-info editor.
 *
 * Personal info is the one continuously-synchronised form in the editor: every
 * keystroke must reach the change output so the live preview updates while
 * typing. These tests assert that contract through the DOM only — they say
 * nothing about whether a FormGroup or a signal model sits behind it.
 */
describe("PersonalInfoForm", () => {
  let fixture: ComponentFixture<PersonalInfoForm>;
  let emitted: PersonalInfo[];

  const ada: PersonalInfo = {
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    phone: "+44 20 7946 0000",
    location: "London, UK",
    website: "https://ada.example.com",
    linkedin: "https://linkedin.com/in/ada",
    summary: "Mathematician and first computer programmer.",
    avatarUrl: "",
  };

  async function render(data: PersonalInfo): Promise<void> {
    fixture = TestBed.createComponent(PersonalInfoForm);
    fixture.componentRef.setInput("data", data);
    emitted = [];
    // `data` is a two-way `model()`; subscribing to it observes `dataChange`.
    fixture.componentInstance.data.subscribe((v) => emitted.push(v));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PersonalInfoForm] });
  });

  it("shows the incoming model in the controls", async () => {
    await render(ada);

    expect(inputByPlaceholder(fixture, "John Doe").value).toBe("Ada Lovelace");
    expect(inputByPlaceholder(fixture, "john@example.com").value).toBe(
      "ada@example.com",
    );
    expect(inputByPlaceholder(fixture, "+1 (555) 123-4567").value).toBe(
      "+44 20 7946 0000",
    );
    expect(inputByPlaceholder(fixture, "New York, NY").value).toBe(
      "London, UK",
    );
    expect(inputByPlaceholder(fixture, "https://johndoe.com").value).toBe(
      "https://ada.example.com",
    );
    expect(
      inputByPlaceholder(fixture, "https://linkedin.com/in/johndoe").value,
    ).toBe("https://linkedin.com/in/ada");
    expect(textareaByPlaceholder(fixture, "Brief overview").value).toBe(
      "Mathematician and first computer programmer.",
    );
  });

  it("emits the full model on every keystroke so the preview stays live", async () => {
    await render(createDefaultPersonalInfo());

    const name = inputByPlaceholder(fixture, "John Doe");
    type(fixture, name, "A");
    type(fixture, name, "Ad");
    type(fixture, name, "Ada");

    expect(emitted.map((p) => p.fullName)).toEqual(["A", "Ad", "Ada"]);
    // Each emission carries the whole PersonalInfo, not just the edited field.
    expect(emitted.at(-1)).toEqual({
      ...createDefaultPersonalInfo(),
      fullName: "Ada",
    });
  });

  it("keeps every field in the emitted model when editing several", async () => {
    await render(createDefaultPersonalInfo());

    type(fixture, inputByPlaceholder(fixture, "John Doe"), "Ada");
    type(fixture, inputByPlaceholder(fixture, "john@example.com"), "a@b.co");
    type(fixture, textareaByPlaceholder(fixture, "Brief overview"), "Hello");

    expect(emitted.at(-1)).toMatchObject({
      fullName: "Ada",
      email: "a@b.co",
      summary: "Hello",
    });
  });

  it("reports a required error for full name only once touched", async () => {
    await render(createDefaultPersonalInfo());

    expect(text(fixture)).not.toContain("Full Name is required");

    const name = inputByPlaceholder(fixture, "John Doe");
    name.dispatchEvent(new Event("blur", { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(text(fixture)).toContain("Full Name is required");
  });

  it("clears the required error once a name is entered", async () => {
    await render(createDefaultPersonalInfo());

    const name = inputByPlaceholder(fixture, "John Doe");
    name.dispatchEvent(new Event("blur", { bubbles: true }));
    fixture.detectChanges();
    type(fixture, name, "Ada");
    await fixture.whenStable();
    fixture.detectChanges();

    expect(text(fixture)).not.toContain("Full Name is required");
  });

  it("reports an email error for a malformed address and clears it when fixed", async () => {
    await render(createDefaultPersonalInfo());

    const email = inputByPlaceholder(fixture, "john@example.com");
    type(fixture, email, "not-an-email");
    email.dispatchEvent(new Event("blur", { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(text(fixture)).toContain("Valid email is required");

    type(fixture, email, "ada@example.com");
    await fixture.whenStable();
    fixture.detectChanges();

    expect(text(fixture)).not.toContain("Valid email is required");
  });

  describe("avatar", () => {
    it("renders the avatar from the incoming model", async () => {
      await render({ ...ada, avatarUrl: "data:image/jpeg;base64,AAAA" });

      const img = fixture.nativeElement.querySelector("img");
      expect(img).not.toBeNull();
      expect(img.getAttribute("src")).toBe("data:image/jpeg;base64,AAAA");
    });

    it("shows the placeholder icon when there is no avatar", async () => {
      await render(ada);

      expect(fixture.nativeElement.querySelector("img")).toBeNull();
      expect(fixture.nativeElement.querySelector("svg")).not.toBeNull();
    });

    it("removing the avatar emits a model that keeps the other fields", async () => {
      await render({ ...ada, avatarUrl: "data:image/jpeg;base64,AAAA" });

      clickButton(fixture, "Remove");

      expect(emitted).toHaveLength(1);
      expect(emitted[0]).toEqual({ ...ada, avatarUrl: "" });
      expect(fixture.nativeElement.querySelector("img")).toBeNull();
    });

    it("keeps the avatar attached to text edits made after it was set", async () => {
      await render({ ...ada, avatarUrl: "data:image/jpeg;base64,AAAA" });

      type(fixture, inputByPlaceholder(fixture, "John Doe"), "Grace Hopper");

      expect(emitted.at(-1)).toEqual({
        ...ada,
        fullName: "Grace Hopper",
        avatarUrl: "data:image/jpeg;base64,AAAA",
      });
    });

    it("keeps text edits attached to the avatar when the avatar is removed", async () => {
      await render({ ...ada, avatarUrl: "data:image/jpeg;base64,AAAA" });

      type(fixture, inputByPlaceholder(fixture, "John Doe"), "Grace Hopper");
      clickButton(fixture, "Remove");

      expect(emitted.at(-1)).toEqual({
        ...ada,
        fullName: "Grace Hopper",
        avatarUrl: "",
      });
    });

    it("ignores a file-input change that carries no file", async () => {
      await render(ada);

      const fileInput =
        fixture.nativeElement.querySelector<HTMLInputElement>(
          'input[type="file"]',
        );
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
      fixture.detectChanges();

      expect(emitted).toHaveLength(0);
    });
  });

  it("adopts a new model pushed in from the store", async () => {
    await render(createDefaultPersonalInfo());

    fixture.componentRef.setInput("data", ada);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(inputByPlaceholder(fixture, "John Doe").value).toBe("Ada Lovelace");
    expect(inputByPlaceholder(fixture, "john@example.com").value).toBe(
      "ada@example.com",
    );
  });

  it("does not emit merely because a new model was pushed in", async () => {
    await render(createDefaultPersonalInfo());

    fixture.componentRef.setInput("data", ada);
    await fixture.whenStable();
    fixture.detectChanges();

    // An echo here would feed the store its own value back and could corrupt
    // undo/redo history with phantom entries.
    expect(emitted).toHaveLength(0);
  });
});

describe("resizeImageToDataUrl", () => {
  it("rejects when the image cannot be decoded", async () => {
    const { resizeImageToDataUrl } = await import("./personal-info-form");

    // jsdom never fires `load` for a real File; drive `onerror` directly.
    const OriginalImage = globalThis.Image;
    class FailingImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_: string) {
        queueMicrotask(() => this.onerror?.());
      }
    }
    globalThis.Image = FailingImage as unknown as typeof Image;
    globalThis.URL.createObjectURL = vi.fn(() => "blob:fake");
    globalThis.URL.revokeObjectURL = vi.fn();

    try {
      const file = new File(["x"], "a.png", { type: "image/png" });
      await expect(resizeImageToDataUrl(file)).rejects.toThrow(
        "Failed to load image",
      );
    } finally {
      globalThis.Image = OriginalImage;
    }
  });
});
