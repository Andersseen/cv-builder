import { describe, it, expect } from "vitest";
import {
  createDefaultCv,
  createDefaultSections,
  createDefaultSettings,
} from "./cv-defaults";

describe("cv-defaults", () => {
  it("creates a CV with a unique id and empty sections", () => {
    const a = createDefaultCv();
    const b = createDefaultCv();
    expect(a.id).not.toBe(b.id);
    expect(a.templateId).toBe("modern");
    expect(a.sections.experience).toEqual([]);
    expect(a.sections.education).toEqual([]);
    expect(a.sections.skills).toEqual([]);
  });

  it("applies overrides on top of defaults", () => {
    const cv = createDefaultCv({ name: "My Resume" });
    expect(cv.name).toBe("My Resume");
    expect(cv.settings).toEqual(createDefaultSettings());
  });

  it("gives new sections all required keys", () => {
    const sections = createDefaultSections();
    expect(Object.keys(sections).sort()).toContain("personal");
    expect(sections.personal.fullName).toBe("");
  });
});
