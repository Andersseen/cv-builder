import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach } from "vitest";

import { EducationForm } from "./education-form";
import { ProjectsForm } from "./projects-form";
import { CertificationsForm } from "./certifications-form";
import {
  Education,
  Project,
  Certification,
} from "../../../domain/models/cv-model";
import {
  inputByPlaceholder,
  textareaByPlaceholder,
  type,
  clickButton,
  clickListEntry,
  isButtonDisabled,
  text,
} from "./form-test-utils";

/**
 * Behavioural regression suite for the three plain repeated sections.
 *
 * They share the draft architecture with Experience — add / edit / cancel /
 * submit / remove / reorder — but have no conditional field logic.
 */

describe("EducationForm", () => {
  let fixture: ComponentFixture<EducationForm>;
  let emitted: Education[][];
  let removed: Education[];

  const mit: Education = {
    id: "e1",
    degree: "BSc Computer Science",
    institution: "MIT",
    location: "Cambridge, MA",
    graduationDate: "2018-06",
    gpa: "3.9",
  };
  const eth: Education = {
    id: "e2",
    degree: "MSc Robotics",
    institution: "ETH",
    location: "Zurich",
    graduationDate: "2020-06",
    gpa: "",
  };

  async function render(items: Education[]): Promise<void> {
    fixture = TestBed.createComponent(EducationForm);
    fixture.componentRef.setInput("items", items);
    emitted = [];
    removed = [];
    fixture.componentInstance.itemsChange.subscribe((v) => emitted.push(v));
    fixture.componentInstance.removed.subscribe((v) => removed.push(v));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function fillValid(degree = "BA History", institution = "Oxford"): void {
    type(fixture, inputByPlaceholder(fixture, "Bachelor of Science"), degree);
    type(fixture, inputByPlaceholder(fixture, "MIT"), institution);
    type(
      fixture,
      fixture.nativeElement.querySelector('input[type="month"]'),
      "2019-06",
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EducationForm] });
  });

  it("lists the incoming entries", async () => {
    await render([mit, eth]);
    expect(text(fixture)).toContain("BSc Computer Science");
    expect(text(fixture)).toContain("MIT");
    expect(text(fixture)).toContain("MSc Robotics");
  });

  it("adds an entry on submit", async () => {
    await render([mit]);

    clickButton(fixture, "+ Add Education");
    fillValid();
    clickButton(fixture, "Add");

    expect(emitted[0]).toHaveLength(2);
    expect(emitted[0][1]).toMatchObject({
      degree: "BA History",
      institution: "Oxford",
      graduationDate: "2019-06",
    });
  });

  it("emits nothing while the draft is being typed", async () => {
    await render([mit]);

    clickButton(fixture, "+ Add Education");
    fillValid();

    expect(emitted).toHaveLength(0);
  });

  it("requires degree, institution and graduation date", async () => {
    await render([]);

    clickButton(fixture, "+ Add Education");
    expect(isButtonDisabled(fixture, "Add")).toBe(true);

    type(fixture, inputByPlaceholder(fixture, "Bachelor of Science"), "BA");
    expect(isButtonDisabled(fixture, "Add")).toBe(true);

    type(fixture, inputByPlaceholder(fixture, "MIT"), "Oxford");
    expect(isButtonDisabled(fixture, "Add")).toBe(true);

    type(
      fixture,
      fixture.nativeElement.querySelector('input[type="month"]'),
      "2019-06",
    );
    expect(isButtonDisabled(fixture, "Add")).toBe(false);
  });

  it("loads an entry for editing and updates it in place", async () => {
    await render([mit, eth]);

    clickListEntry(fixture, "BSc Computer Science");
    expect(inputByPlaceholder(fixture, "MIT").value).toBe("MIT");

    type(fixture, inputByPlaceholder(fixture, "MIT"), "MIT Media Lab");
    clickButton(fixture, "Update");

    expect(emitted[0]).toEqual([{ ...mit, institution: "MIT Media Lab" }, eth]);
  });

  it("leaves the stored entry untouched when editing is cancelled", async () => {
    const stored = { ...mit };
    await render([stored]);

    clickListEntry(fixture, "BSc Computer Science");
    type(fixture, inputByPlaceholder(fixture, "MIT"), "Discarded");
    clickButton(fixture, "Cancel");

    expect(emitted).toHaveLength(0);
    expect(stored).toEqual(mit);
    expect(text(fixture)).not.toContain("Discarded");
  });

  it("removes an entry and reports which one went", async () => {
    await render([mit, eth]);

    clickButton(fixture, "Remove");

    expect(emitted[0]).toEqual([eth]);
    expect(removed).toEqual([mit]);
  });

  it("reorders entries", async () => {
    await render([mit, eth]);

    fixture.nativeElement
      .querySelectorAll<HTMLButtonElement>(
        'volt-button[title="Move down"] button',
      )[0]
      .click();
    fixture.detectChanges();

    expect(emitted[0]).toEqual([eth, mit]);
  });
});

describe("ProjectsForm", () => {
  let fixture: ComponentFixture<ProjectsForm>;
  let emitted: Project[][];
  let removed: Project[];

  const alpha: Project = {
    id: "p1",
    name: "Alpha",
    description: "First project",
    url: "https://alpha.dev",
    technologies: "Angular, Vite",
  };
  const beta: Project = {
    id: "p2",
    name: "Beta",
    description: "Second project",
    url: "",
    technologies: "Go",
  };

  async function render(items: Project[]): Promise<void> {
    fixture = TestBed.createComponent(ProjectsForm);
    fixture.componentRef.setInput("items", items);
    emitted = [];
    removed = [];
    fixture.componentInstance.itemsChange.subscribe((v) => emitted.push(v));
    fixture.componentInstance.removed.subscribe((v) => removed.push(v));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ProjectsForm] });
  });

  it("lists the incoming projects", async () => {
    await render([alpha, beta]);
    expect(text(fixture)).toContain("Alpha");
    expect(text(fixture)).toContain("Beta");
  });

  it("adds a project on submit", async () => {
    await render([alpha]);

    clickButton(fixture, "+ Add Project");
    type(fixture, inputByPlaceholder(fixture, "Portfolio Website"), "Gamma");
    type(
      fixture,
      textareaByPlaceholder(fixture, "What the project does"),
      "Third project",
    );
    clickButton(fixture, "Add");

    expect(emitted[0][1]).toMatchObject({
      name: "Gamma",
      description: "Third project",
    });
  });

  it("requires a project name", async () => {
    await render([]);

    clickButton(fixture, "+ Add Project");
    expect(isButtonDisabled(fixture, "Add")).toBe(true);

    type(fixture, inputByPlaceholder(fixture, "Portfolio Website"), "Gamma");
    expect(isButtonDisabled(fixture, "Add")).toBe(false);
  });

  it("emits nothing while the draft is being typed", async () => {
    await render([alpha]);

    clickButton(fixture, "+ Add Project");
    type(fixture, inputByPlaceholder(fixture, "Portfolio Website"), "Gamma");

    expect(emitted).toHaveLength(0);
  });

  it("loads a project for editing and updates it in place", async () => {
    await render([alpha, beta]);

    clickListEntry(fixture, "Alpha");
    expect(inputByPlaceholder(fixture, "Portfolio Website").value).toBe(
      "Alpha",
    );

    type(fixture, inputByPlaceholder(fixture, "Portfolio Website"), "Alpha 2");
    clickButton(fixture, "Update");

    expect(emitted[0]).toEqual([{ ...alpha, name: "Alpha 2" }, beta]);
  });

  it("leaves the stored project untouched when editing is cancelled", async () => {
    const stored = { ...alpha };
    await render([stored]);

    clickListEntry(fixture, "Alpha");
    type(
      fixture,
      inputByPlaceholder(fixture, "Portfolio Website"),
      "Discarded",
    );
    clickButton(fixture, "Cancel");

    expect(emitted).toHaveLength(0);
    expect(stored).toEqual(alpha);
  });

  it("removes a project and reports which one went", async () => {
    await render([alpha, beta]);

    clickButton(fixture, "Remove");

    expect(emitted[0]).toEqual([beta]);
    expect(removed).toEqual([alpha]);
  });

  it("reorders projects", async () => {
    await render([alpha, beta]);

    fixture.nativeElement
      .querySelectorAll<HTMLButtonElement>(
        'volt-button[title="Move down"] button',
      )[0]
      .click();
    fixture.detectChanges();

    expect(emitted[0]).toEqual([beta, alpha]);
  });
});

describe("CertificationsForm", () => {
  let fixture: ComponentFixture<CertificationsForm>;
  let emitted: Certification[][];
  let removed: Certification[];

  const aws: Certification = {
    id: "c1",
    name: "AWS Solutions Architect",
    issuer: "Amazon",
    date: "2021-03",
    url: "https://aws.example/cert",
  };
  const gcp: Certification = {
    id: "c2",
    name: "GCP Professional",
    issuer: "Google",
    date: "2022-09",
    url: "",
  };

  async function render(items: Certification[]): Promise<void> {
    fixture = TestBed.createComponent(CertificationsForm);
    fixture.componentRef.setInput("items", items);
    emitted = [];
    removed = [];
    fixture.componentInstance.itemsChange.subscribe((v) => emitted.push(v));
    fixture.componentInstance.removed.subscribe((v) => removed.push(v));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CertificationsForm] });
  });

  it("lists the incoming certifications", async () => {
    await render([aws, gcp]);
    expect(text(fixture)).toContain("AWS Solutions Architect");
    expect(text(fixture)).toContain("GCP Professional");
  });

  it("adds a certification on submit", async () => {
    await render([aws]);

    clickButton(fixture, "+ Add Certification");
    type(
      fixture,
      inputByPlaceholder(fixture, "AWS Certified Solutions Architect"),
      "CKA",
    );
    clickButton(fixture, "Add");

    expect(emitted[0][1]).toMatchObject({ name: "CKA" });
  });

  it("requires a certification name", async () => {
    await render([]);

    clickButton(fixture, "+ Add Certification");
    expect(isButtonDisabled(fixture, "Add")).toBe(true);

    type(
      fixture,
      inputByPlaceholder(fixture, "AWS Certified Solutions Architect"),
      "CKA",
    );
    expect(isButtonDisabled(fixture, "Add")).toBe(false);
  });

  it("emits nothing while the draft is being typed", async () => {
    await render([aws]);

    clickButton(fixture, "+ Add Certification");
    type(
      fixture,
      inputByPlaceholder(fixture, "AWS Certified Solutions Architect"),
      "CKA",
    );

    expect(emitted).toHaveLength(0);
  });

  it("loads a certification for editing and updates it in place", async () => {
    await render([aws, gcp]);

    clickListEntry(fixture, "AWS Solutions Architect");
    expect(
      inputByPlaceholder(fixture, "AWS Certified Solutions Architect").value,
    ).toBe("AWS Solutions Architect");

    type(fixture, inputByPlaceholder(fixture, "Amazon Web Services"), "AWS");
    clickButton(fixture, "Update");

    expect(emitted[0]).toEqual([{ ...aws, issuer: "AWS" }, gcp]);
  });

  it("leaves the stored certification untouched when editing is cancelled", async () => {
    const stored = { ...aws };
    await render([stored]);

    clickListEntry(fixture, "AWS Solutions Architect");
    type(fixture, inputByPlaceholder(fixture, "Amazon Web Services"), "Nope");
    clickButton(fixture, "Cancel");

    expect(emitted).toHaveLength(0);
    expect(stored).toEqual(aws);
  });

  it("removes a certification and reports which one went", async () => {
    await render([aws, gcp]);

    clickButton(fixture, "Remove");

    expect(emitted[0]).toEqual([gcp]);
    expect(removed).toEqual([aws]);
  });

  it("reorders certifications", async () => {
    await render([aws, gcp]);

    fixture.nativeElement
      .querySelectorAll<HTMLButtonElement>(
        'volt-button[title="Move down"] button',
      )[0]
      .click();
    fixture.detectChanges();

    expect(emitted[0]).toEqual([gcp, aws]);
  });
});
