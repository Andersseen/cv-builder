import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach } from "vitest";

import { ExperienceForm } from "./experience-form";
import { Experience } from "../../../domain/models/cv-model";
import {
  inputByPlaceholder,
  inputByType,
  textareaByPlaceholder,
  type,
  check,
  clickButton,
  isButtonDisabled,
  text,
} from "./form-test-utils";

/**
 * Behavioural regression suite for the experience editor.
 *
 * Experience is the reference *draft* form: the edit buffer is intentional and
 * nothing may reach `itemsChange` until the user submits. Cancel must leave the
 * stored entry byte-for-byte untouched.
 */
describe("ExperienceForm", () => {
  let fixture: ComponentFixture<ExperienceForm>;
  let emitted: Experience[][];
  let removed: Experience[];

  const acme: Experience = {
    id: "exp-1",
    jobTitle: "Engineer",
    company: "Acme",
    location: "Berlin",
    startDate: "2020-01",
    endDate: "2022-06",
    current: false,
    description: "Built things.",
  };

  const globex: Experience = {
    id: "exp-2",
    jobTitle: "Architect",
    company: "Globex",
    location: "Madrid",
    startDate: "2022-07",
    endDate: "",
    current: true,
    description: "Designed things.",
  };

  async function render(items: Experience[]): Promise<void> {
    fixture = TestBed.createComponent(ExperienceForm);
    fixture.componentRef.setInput("items", items);
    emitted = [];
    removed = [];
    fixture.componentInstance.itemsChange.subscribe((v) => emitted.push(v));
    fixture.componentInstance.removed.subscribe((v) => removed.push(v));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  /** Fill the draft with a complete, valid entry. */
  function fillValidDraft(overrides: Partial<Experience> = {}): void {
    type(
      fixture,
      inputByPlaceholder(fixture, "Software Engineer"),
      overrides.jobTitle ?? "Engineer",
    );
    type(
      fixture,
      inputByPlaceholder(fixture, "Tech Corp"),
      overrides.company ?? "Acme",
    );
    type(
      fixture,
      inputByPlaceholder(fixture, "San Francisco, CA"),
      overrides.location ?? "Berlin",
    );
    const dates = fixture.nativeElement.querySelectorAll<HTMLInputElement>(
      'input[type="month"]',
    );
    type(fixture, dates[0], overrides.startDate ?? "2020-01");
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ExperienceForm] });
  });

  it("lists the incoming entries", async () => {
    await render([acme, globex]);

    expect(text(fixture)).toContain("Engineer");
    expect(text(fixture)).toContain("Acme — Berlin");
    expect(text(fixture)).toContain("Architect");
    // A current role renders as "Present" rather than an end date.
    expect(text(fixture)).toContain("Present");
  });

  it("shows an empty-state message with no entries", async () => {
    await render([]);
    expect(text(fixture)).toContain("No work experience added yet.");
  });

  describe("creating", () => {
    it("adds a new entry on submit and appends it to the list", async () => {
      await render([acme]);

      clickButton(fixture, "+ Add Experience");
      fillValidDraft({ jobTitle: "Designer", company: "Initech" });
      clickButton(fixture, "Add");

      expect(emitted).toHaveLength(1);
      expect(emitted[0]).toHaveLength(2);
      expect(emitted[0][0]).toEqual(acme);
      expect(emitted[0][1]).toMatchObject({
        jobTitle: "Designer",
        company: "Initech",
        startDate: "2020-01",
        current: false,
      });
      expect(emitted[0][1].id).toBeTruthy();
    });

    it("emits nothing while the draft is being typed", async () => {
      await render([acme]);

      clickButton(fixture, "+ Add Experience");
      fillValidDraft();

      expect(emitted).toHaveLength(0);
    });

    it("closes the draft after a successful submit", async () => {
      await render([]);

      clickButton(fixture, "+ Add Experience");
      fillValidDraft();
      clickButton(fixture, "Add");

      expect(text(fixture)).toContain("+ Add Experience");
      expect(text(fixture)).not.toContain("New Experience");
    });

    it("starts each new draft empty rather than reusing the last one", async () => {
      await render([]);

      clickButton(fixture, "+ Add Experience");
      fillValidDraft({ jobTitle: "First", company: "One" });
      clickButton(fixture, "Add");
      clickButton(fixture, "+ Add Experience");

      expect(inputByPlaceholder(fixture, "Software Engineer").value).toBe("");
      expect(inputByPlaceholder(fixture, "Tech Corp").value).toBe("");
    });
  });

  describe("validation", () => {
    it("keeps submit disabled until the required fields are filled", async () => {
      await render([]);

      clickButton(fixture, "+ Add Experience");
      expect(isButtonDisabled(fixture, "Add")).toBe(true);

      type(fixture, inputByPlaceholder(fixture, "Software Engineer"), "Eng");
      expect(isButtonDisabled(fixture, "Add")).toBe(true);

      type(fixture, inputByPlaceholder(fixture, "Tech Corp"), "Acme");
      expect(isButtonDisabled(fixture, "Add")).toBe(true);

      const dates = fixture.nativeElement.querySelectorAll<HTMLInputElement>(
        'input[type="month"]',
      );
      type(fixture, dates[0], "2020-01");
      expect(isButtonDisabled(fixture, "Add")).toBe(false);
    });

    it("does not emit an invalid entry", async () => {
      await render([]);

      clickButton(fixture, "+ Add Experience");
      type(fixture, inputByPlaceholder(fixture, "Software Engineer"), "Eng");
      // Company and start date are still missing.
      fixture.nativeElement
        .querySelector("form")
        .dispatchEvent(new Event("submit", { bubbles: true }));
      fixture.detectChanges();

      expect(emitted).toHaveLength(0);
    });
  });

  describe("editing", () => {
    it("loads the selected entry into the draft", async () => {
      await render([acme, globex]);

      clickButton(fixture, "Edit");

      expect(text(fixture)).toContain("Edit Experience");
      expect(inputByPlaceholder(fixture, "Software Engineer").value).toBe(
        "Engineer",
      );
      expect(inputByPlaceholder(fixture, "Tech Corp").value).toBe("Acme");
      expect(inputByPlaceholder(fixture, "San Francisco, CA").value).toBe(
        "Berlin",
      );
      expect(textareaByPlaceholder(fixture, "Key responsibilities").value).toBe(
        "Built things.",
      );
    });

    it("replaces the entry in place on submit, keeping its id and position", async () => {
      await render([acme, globex]);

      clickButton(fixture, "Edit");
      type(fixture, inputByPlaceholder(fixture, "Tech Corp"), "Acme Corp");
      clickButton(fixture, "Update");

      expect(emitted).toHaveLength(1);
      expect(emitted[0]).toHaveLength(2);
      expect(emitted[0][0]).toEqual({ ...acme, company: "Acme Corp" });
      expect(emitted[0][1]).toEqual(globex);
    });

    it("emits nothing while an existing entry is being edited", async () => {
      await render([acme]);

      clickButton(fixture, "Edit");
      type(fixture, inputByPlaceholder(fixture, "Tech Corp"), "Something else");
      type(fixture, inputByPlaceholder(fixture, "Software Engineer"), "Other");

      expect(emitted).toHaveLength(0);
    });

    it("does not mutate the stored entry object while editing", async () => {
      const stored: Experience = { ...acme };
      await render([stored]);

      clickButton(fixture, "Edit");
      type(fixture, inputByPlaceholder(fixture, "Tech Corp"), "Mutated");
      type(
        fixture,
        inputByPlaceholder(fixture, "Software Engineer"),
        "Mutated",
      );

      // The draft must be an independent copy — the array the parent still
      // holds has to be untouched until Update is pressed.
      expect(stored).toEqual(acme);
    });

    it("leaves the stored entry untouched when editing is cancelled", async () => {
      const stored: Experience = { ...acme };
      await render([stored]);

      clickButton(fixture, "Edit");
      type(fixture, inputByPlaceholder(fixture, "Tech Corp"), "Discarded");
      clickButton(fixture, "Cancel");

      expect(emitted).toHaveLength(0);
      expect(stored).toEqual(acme);
      expect(text(fixture)).toContain("Acme");
      expect(text(fixture)).not.toContain("Discarded");
    });

    it("starts a clean draft after cancelling an edit", async () => {
      await render([acme]);

      clickButton(fixture, "Edit");
      clickButton(fixture, "Cancel");
      clickButton(fixture, "+ Add Experience");

      expect(text(fixture)).toContain("New Experience");
      expect(inputByPlaceholder(fixture, "Software Engineer").value).toBe("");
      expect(inputByPlaceholder(fixture, "Tech Corp").value).toBe("");
    });
  });

  describe("current role / end date", () => {
    it("hides the end date field while the role is marked current", async () => {
      await render([]);

      clickButton(fixture, "+ Add Experience");
      expect(
        fixture.nativeElement.querySelectorAll('input[type="month"]'),
      ).toHaveLength(2);

      check(fixture, inputByType(fixture, "checkbox"), true);

      expect(
        fixture.nativeElement.querySelectorAll('input[type="month"]'),
      ).toHaveLength(1);
    });

    it("does not save a stale end date when the role is marked current", async () => {
      await render([]);

      clickButton(fixture, "+ Add Experience");
      fillValidDraft();
      const dates = fixture.nativeElement.querySelectorAll<HTMLInputElement>(
        'input[type="month"]',
      );
      type(fixture, dates[1], "2022-06");

      check(fixture, inputByType(fixture, "checkbox"), true);
      clickButton(fixture, "Add");

      expect(emitted[0][0]).toMatchObject({ current: true, endDate: "" });
    });

    it("restores an editable end date when current is switched back off", async () => {
      await render([]);

      clickButton(fixture, "+ Add Experience");
      fillValidDraft();
      const checkbox = inputByType(fixture, "checkbox");

      check(fixture, checkbox, true);
      check(fixture, checkbox, false);

      const dates = fixture.nativeElement.querySelectorAll<HTMLInputElement>(
        'input[type="month"]',
      );
      expect(dates).toHaveLength(2);
      expect(dates[1].disabled).toBe(false);

      type(fixture, dates[1], "2023-03");
      clickButton(fixture, "Add");

      expect(emitted[0][0]).toMatchObject({
        current: false,
        endDate: "2023-03",
      });
    });

    it("clears a stored end date when editing an entry into a current role", async () => {
      await render([acme]);

      clickButton(fixture, "Edit");
      check(fixture, inputByType(fixture, "checkbox"), true);
      clickButton(fixture, "Update");

      expect(emitted[0][0]).toMatchObject({
        id: "exp-1",
        current: true,
        endDate: "",
      });
    });

    it("keeps a stored end date when editing an entry that is not current", async () => {
      await render([acme]);

      clickButton(fixture, "Edit");
      clickButton(fixture, "Update");

      expect(emitted[0][0]).toEqual(acme);
    });
  });

  describe("removing", () => {
    it("emits the remaining entries and the removed one", async () => {
      await render([acme, globex]);

      clickButton(fixture, "Remove");

      expect(emitted).toHaveLength(1);
      expect(emitted[0]).toEqual([globex]);
      expect(removed).toEqual([acme]);
    });

    it("closes the draft when the entry being edited is removed", async () => {
      await render([acme]);

      clickButton(fixture, "Edit");
      expect(text(fixture)).toContain("Edit Experience");

      clickButton(fixture, "Remove");

      expect(text(fixture)).not.toContain("Edit Experience");
    });
  });

  describe("reordering", () => {
    it("moves an entry down", async () => {
      await render([acme, globex]);

      const downButtons = Array.from(
        fixture.nativeElement.querySelectorAll<HTMLButtonElement>(
          'volt-button[title="Move down"] button',
        ),
      );
      downButtons[0].click();
      fixture.detectChanges();

      expect(emitted[0]).toEqual([globex, acme]);
    });

    it("moves an entry up", async () => {
      await render([acme, globex]);

      const upButtons = Array.from(
        fixture.nativeElement.querySelectorAll<HTMLButtonElement>(
          'volt-button[title="Move up"] button',
        ),
      );
      upButtons[1].click();
      fixture.detectChanges();

      expect(emitted[0]).toEqual([globex, acme]);
    });

    it("disables the move buttons at the ends of the list", async () => {
      await render([acme, globex]);

      const up = fixture.nativeElement.querySelectorAll<HTMLButtonElement>(
        'volt-button[title="Move up"] button',
      );
      const down = fixture.nativeElement.querySelectorAll<HTMLButtonElement>(
        'volt-button[title="Move down"] button',
      );

      expect(up[0].disabled).toBe(true);
      expect(down[1].disabled).toBe(true);
      expect(up[1].disabled).toBe(false);
      expect(down[0].disabled).toBe(false);
    });
  });
});
