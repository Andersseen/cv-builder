import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach } from "vitest";

import { SkillsForm } from "./skills-form";
import { LanguagesForm } from "./languages-form";
import { Skill, Language } from "../../../domain/models/cv-model";
import {
  inputByPlaceholder,
  select,
  clickListEntry,
  settle,
  type,
  choose,
  clickButton,
  isButtonDisabled,
  text,
} from "./form-test-utils";

/**
 * Behavioural regression suite for the two select-driven repeated sections.
 *
 * Both follow the same draft architecture as Experience, and both pair a text
 * field with a `<select>` rendered by Volt UI's native-select wrapper — the one
 * control in the editor that is not a `ControlValueAccessor`.
 */

describe("SkillsForm", () => {
  let fixture: ComponentFixture<SkillsForm>;
  let emitted: Skill[][];
  let removed: Skill[];

  const ts: Skill = { id: "s1", name: "TypeScript", level: "Expert" };
  const go: Skill = { id: "s2", name: "Go", level: "Intermediate" };

  async function render(items: Skill[]): Promise<void> {
    fixture = TestBed.createComponent(SkillsForm);
    fixture.componentRef.setInput("items", items);
    emitted = [];
    removed = [];
    fixture.componentInstance.itemsChange.subscribe((v) => emitted.push(v));
    fixture.componentInstance.removed.subscribe((v) => removed.push(v));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SkillsForm] });
  });

  it("lists the incoming skills with their level", async () => {
    await render([ts, go]);

    expect(text(fixture)).toContain("TypeScript");
    expect(text(fixture)).toContain("Expert");
    expect(text(fixture)).toContain("Go");
    expect(text(fixture)).toContain("Intermediate");
  });

  it("offers every skill level in the select", async () => {
    await render([]);
    clickButton(fixture, "+ Add Skill");

    const options = Array.from(select(fixture).options).map((o) => o.value);
    expect(options).toEqual(["Beginner", "Intermediate", "Advanced", "Expert"]);
  });

  it("adds a skill with the level chosen in the select", async () => {
    await render([ts]);

    clickButton(fixture, "+ Add Skill");
    type(
      fixture,
      inputByPlaceholder(fixture, "TypeScript, React, Docker..."),
      "Rust",
    );
    choose(fixture, select(fixture), "Advanced");
    clickButton(fixture, "Add");

    expect(emitted).toHaveLength(1);
    expect(emitted[0][0]).toEqual(ts);
    expect(emitted[0][1]).toMatchObject({ name: "Rust", level: "Advanced" });
  });

  it("defaults a new skill to Beginner", async () => {
    await render([]);

    clickButton(fixture, "+ Add Skill");
    type(
      fixture,
      inputByPlaceholder(fixture, "TypeScript, React, Docker..."),
      "Rust",
    );
    clickButton(fixture, "Add");

    expect(emitted[0][0]).toMatchObject({ name: "Rust", level: "Beginner" });
  });

  it("loads the stored level into the select when editing", async () => {
    await render([ts, go]);

    clickButton(fixture, "Edit");
    await settle(fixture);

    expect(
      inputByPlaceholder(fixture, "TypeScript, React, Docker...").value,
    ).toBe("TypeScript");
    expect(select(fixture).value).toBe("Expert");
  });

  it("updates a skill in place, keeping its id and position", async () => {
    await render([ts, go]);

    clickButton(fixture, "Edit");
    choose(fixture, select(fixture), "Advanced");
    clickButton(fixture, "Update");

    expect(emitted[0]).toEqual([{ ...ts, level: "Advanced" }, go]);
  });

  it("leaves the stored skill untouched when editing is cancelled", async () => {
    const stored = { ...ts };
    await render([stored, go]);

    clickButton(fixture, "Edit");
    type(
      fixture,
      inputByPlaceholder(fixture, "TypeScript, React, Docker..."),
      "Nope",
    );
    choose(fixture, select(fixture), "Beginner");
    clickButton(fixture, "Cancel");

    expect(emitted).toHaveLength(0);
    expect(stored).toEqual(ts);
  });

  it("requires a name before the skill can be submitted", async () => {
    await render([]);

    clickButton(fixture, "+ Add Skill");
    expect(isButtonDisabled(fixture, "Add")).toBe(true);

    type(
      fixture,
      inputByPlaceholder(fixture, "TypeScript, React, Docker..."),
      "Rust",
    );
    expect(isButtonDisabled(fixture, "Add")).toBe(false);
  });

  it("removes a skill and reports which one went", async () => {
    await render([ts, go]);

    clickButton(fixture, "✕");

    expect(emitted[0]).toEqual([go]);
    expect(removed).toEqual([ts]);
  });

  it("reorders skills", async () => {
    await render([ts, go]);

    const down = fixture.nativeElement.querySelectorAll<HTMLButtonElement>(
      'volt-button[title="Move down"] button',
    );
    down[0].click();
    fixture.detectChanges();

    expect(emitted[0]).toEqual([go, ts]);
  });
});

describe("LanguagesForm", () => {
  let fixture: ComponentFixture<LanguagesForm>;
  let emitted: Language[][];
  let removed: Language[];

  const es: Language = { id: "l1", name: "Spanish", proficiency: "Native" };
  const en: Language = { id: "l2", name: "English", proficiency: "Fluent" };

  async function render(items: Language[]): Promise<void> {
    fixture = TestBed.createComponent(LanguagesForm);
    fixture.componentRef.setInput("items", items);
    emitted = [];
    removed = [];
    fixture.componentInstance.itemsChange.subscribe((v) => emitted.push(v));
    fixture.componentInstance.removed.subscribe((v) => removed.push(v));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [LanguagesForm] });
  });

  it("lists the incoming languages with their proficiency", async () => {
    await render([es, en]);

    expect(text(fixture)).toContain("Spanish");
    expect(text(fixture)).toContain("Native");
    expect(text(fixture)).toContain("English");
    expect(text(fixture)).toContain("Fluent");
  });

  it("offers every proficiency level in the select", async () => {
    await render([]);
    clickButton(fixture, "+ Add Language");

    const options = Array.from(select(fixture).options).map((o) => o.value);
    expect(options).toEqual([
      "Basic",
      "Conversational",
      "Professional",
      "Fluent",
      "Native",
    ]);
  });

  it("adds a language with the proficiency chosen in the select", async () => {
    await render([es]);

    clickButton(fixture, "+ Add Language");
    type(
      fixture,
      inputByPlaceholder(fixture, "Spanish, English, German..."),
      "German",
    );
    choose(fixture, select(fixture), "Conversational");
    clickButton(fixture, "Add");

    expect(emitted[0][1]).toMatchObject({
      name: "German",
      proficiency: "Conversational",
    });
  });

  it("defaults a new language to Professional", async () => {
    await render([]);

    clickButton(fixture, "+ Add Language");
    type(
      fixture,
      inputByPlaceholder(fixture, "Spanish, English, German..."),
      "German",
    );
    clickButton(fixture, "Add");

    expect(emitted[0][0]).toMatchObject({
      name: "German",
      proficiency: "Professional",
    });
  });

  it("loads the stored proficiency into the select when editing", async () => {
    await render([es, en]);

    clickListEntry(fixture, "Spanish");
    await settle(fixture);

    expect(
      inputByPlaceholder(fixture, "Spanish, English, German...").value,
    ).toBe("Spanish");
    expect(select(fixture).value).toBe("Native");
  });

  it("requires a name before the language can be submitted", async () => {
    await render([]);

    clickButton(fixture, "+ Add Language");
    expect(isButtonDisabled(fixture, "Add")).toBe(true);

    type(
      fixture,
      inputByPlaceholder(fixture, "Spanish, English, German..."),
      "German",
    );
    expect(isButtonDisabled(fixture, "Add")).toBe(false);
  });

  it("leaves the stored language untouched when editing is cancelled", async () => {
    const stored = { ...es };
    await render([stored]);

    clickListEntry(fixture, "Spanish");
    type(
      fixture,
      inputByPlaceholder(fixture, "Spanish, English, German..."),
      "Nope",
    );
    clickButton(fixture, "Cancel");

    expect(emitted).toHaveLength(0);
    expect(stored).toEqual(es);
  });

  it("removes a language and reports which one went", async () => {
    await render([es, en]);

    clickButton(fixture, "✕");

    expect(emitted[0]).toEqual([en]);
    expect(removed).toEqual([es]);
  });

  it("reorders languages", async () => {
    await render([es, en]);

    const down = fixture.nativeElement.querySelectorAll<HTMLButtonElement>(
      'volt-button[title="Move down"] button',
    );
    down[0].click();
    fixture.detectChanges();

    expect(emitted[0]).toEqual([en, es]);
  });
});
