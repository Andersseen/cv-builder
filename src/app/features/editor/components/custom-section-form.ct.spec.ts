import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach } from "vitest";

import { CustomSectionForm } from "./custom-section-form";
import { CustomSection } from "../../../domain/models/cv-model";
import { inputByPlaceholder, type, clickButton, text } from "./form-test-utils";

/**
 * Behavioural regression suite for the custom-section editor.
 *
 * This is the only editor with a nested array: a section title plus an
 * arbitrary list of items, each with three text fields. It is *not* a draft
 * editor — every edit propagates immediately, like personal info.
 */
describe("CustomSectionForm", () => {
  let fixture: ComponentFixture<CustomSectionForm>;
  let emitted: CustomSection[];
  let removedCount: number;

  const awards: CustomSection = {
    id: "cs-1",
    title: "Awards",
    items: [
      {
        id: "i1",
        title: "Best Paper",
        subtitle: "ACM 2021",
        description: "For the **signals** paper.",
      },
      {
        id: "i2",
        title: "Hackathon Winner",
        subtitle: "Berlin 2022",
        description: "",
      },
    ],
  };

  async function render(section: CustomSection): Promise<void> {
    fixture = TestBed.createComponent(CustomSectionForm);
    fixture.componentRef.setInput("section", section);
    emitted = [];
    removedCount = 0;
    // `section` is a two-way `model()`; subscribing observes `sectionChange`.
    fixture.componentInstance.section.subscribe((v) => emitted.push(v));
    fixture.componentInstance.removed.subscribe(() => removedCount++);
    await fixture.whenStable();
    fixture.detectChanges();
  }

  /** Item title/subtitle/description inputs, in render order. */
  function itemTitleInputs(): HTMLInputElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll<HTMLInputElement>(
        'input[placeholder="Award name / Project title"]',
      ),
    );
  }
  function itemSubtitleInputs(): HTMLInputElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll<HTMLInputElement>(
        'input[placeholder="Issuer / Year / Organization"]',
      ),
    );
  }
  function itemDescriptionInputs(): HTMLTextAreaElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll<HTMLTextAreaElement>("textarea"),
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CustomSectionForm] });
  });

  it("shows the section title and every item", async () => {
    await render(awards);

    expect(
      inputByPlaceholder(fixture, "Volunteering, Awards, Publications...")
        .value,
    ).toBe("Awards");

    expect(itemTitleInputs().map((i) => i.value)).toEqual([
      "Best Paper",
      "Hackathon Winner",
    ]);
    expect(itemSubtitleInputs().map((i) => i.value)).toEqual([
      "ACM 2021",
      "Berlin 2022",
    ]);
    expect(itemDescriptionInputs().map((i) => i.value)).toEqual([
      "For the **signals** paper.",
      "",
    ]);
  });

  it("shows an empty state when the section has no items", async () => {
    await render({ id: "cs-2", title: "Empty", items: [] });
    expect(text(fixture)).toContain("No items yet.");
  });

  it("emits the whole section when the title is edited", async () => {
    await render(awards);

    type(
      fixture,
      inputByPlaceholder(fixture, "Volunteering, Awards, Publications..."),
      "Honours",
    );

    expect(emitted.at(-1)).toEqual({ ...awards, title: "Honours" });
  });

  it("emits on every keystroke in the title", async () => {
    await render({ id: "cs-2", title: "", items: [] });

    const title = inputByPlaceholder(
      fixture,
      "Volunteering, Awards, Publications...",
    );
    type(fixture, title, "A");
    type(fixture, title, "Aw");

    expect(emitted.map((s) => s.title)).toEqual(["A", "Aw"]);
  });

  it("adds an empty item", async () => {
    await render(awards);

    clickButton(fixture, "+ Add Item");

    expect(emitted.at(-1)!.items).toHaveLength(3);
    expect(emitted.at(-1)!.items[2]).toMatchObject({
      title: "",
      subtitle: "",
      description: "",
    });
    expect(emitted.at(-1)!.items[2].id).toBeTruthy();
    expect(itemTitleInputs()).toHaveLength(3);
  });

  it("edits a nested item field without disturbing its siblings", async () => {
    await render(awards);

    type(fixture, itemTitleInputs()[1], "Hackathon Champion");

    const result = emitted.at(-1)!;
    expect(result.items[1].title).toBe("Hackathon Champion");
    expect(result.items[1].subtitle).toBe("Berlin 2022");
    expect(result.items[0]).toEqual(awards.items[0]);
    expect(result.title).toBe("Awards");
  });

  it("edits every field of a nested item", async () => {
    await render(awards);

    type(fixture, itemTitleInputs()[0], "New Title");
    type(fixture, itemSubtitleInputs()[0], "New Subtitle");
    type(fixture, itemDescriptionInputs()[0], "New description");

    expect(emitted.at(-1)!.items[0]).toMatchObject({
      id: "i1",
      title: "New Title",
      subtitle: "New Subtitle",
      description: "New description",
    });
  });

  it("removes an item", async () => {
    await render(awards);

    const removeButtons =
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>(
        'button[title="Delete item"]',
      );
    removeButtons[0].click();
    fixture.detectChanges();

    expect(emitted.at(-1)!.items).toEqual([awards.items[1]]);
    expect(itemTitleInputs().map((i) => i.value)).toEqual(["Hackathon Winner"]);
  });

  it("moves an item down", async () => {
    await render(awards);

    fixture.nativeElement
      .querySelectorAll<HTMLButtonElement>('button[title="Move down"]')[0]
      .click();
    fixture.detectChanges();

    expect(emitted.at(-1)!.items.map((i) => i.id)).toEqual(["i2", "i1"]);
    expect(itemTitleInputs().map((i) => i.value)).toEqual([
      "Hackathon Winner",
      "Best Paper",
    ]);
  });

  it("moves an item up", async () => {
    await render(awards);

    fixture.nativeElement
      .querySelectorAll<HTMLButtonElement>('button[title="Move up"]')[1]
      .click();
    fixture.detectChanges();

    expect(emitted.at(-1)!.items.map((i) => i.id)).toEqual(["i2", "i1"]);
  });

  it("disables the move buttons at the ends of the list", async () => {
    await render(awards);

    const up = fixture.nativeElement.querySelectorAll<HTMLButtonElement>(
      'button[title="Move up"]',
    );
    const down = fixture.nativeElement.querySelectorAll<HTMLButtonElement>(
      'button[title="Move down"]',
    );

    expect(up[0].disabled).toBe(true);
    expect(down[1].disabled).toBe(true);
    expect(up[1].disabled).toBe(false);
    expect(down[0].disabled).toBe(false);
  });

  it("keeps edits to one item after another is removed", async () => {
    await render(awards);

    type(fixture, itemTitleInputs()[1], "Renamed");
    fixture.nativeElement
      .querySelectorAll<HTMLButtonElement>('button[title="Delete item"]')[0]
      .click();
    fixture.detectChanges();

    expect(emitted.at(-1)!.items).toHaveLength(1);
    expect(emitted.at(-1)!.items[0].title).toBe("Renamed");
  });

  it("reports a request to delete the whole section", async () => {
    await render(awards);

    clickButton(fixture, "Delete section");

    expect(removedCount).toBe(1);
  });

  it("adopts a new section pushed in from the store", async () => {
    await render(awards);

    const other: CustomSection = {
      id: "cs-9",
      title: "Publications",
      items: [{ id: "p1", title: "Paper", subtitle: "2020", description: "" }],
    };
    fixture.componentRef.setInput("section", other);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(
      inputByPlaceholder(fixture, "Volunteering, Awards, Publications...")
        .value,
    ).toBe("Publications");
    expect(itemTitleInputs().map((i) => i.value)).toEqual(["Paper"]);
  });

  it("does not emit merely because a new section was pushed in", async () => {
    await render(awards);

    fixture.componentRef.setInput("section", {
      id: "cs-9",
      title: "Publications",
      items: [],
    });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(emitted).toHaveLength(0);
  });
});
