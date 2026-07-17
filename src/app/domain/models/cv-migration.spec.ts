import { describe, it, expect } from "vitest";
import { migrateCv } from "./cv-migration";
import { createDefaultCv } from "./cv-defaults";

describe("migrateCv", () => {
  it("returns null for non-objects", () => {
    expect(migrateCv(null)).toBeNull();
    expect(migrateCv("string")).toBeNull();
    expect(migrateCv(42)).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    expect(migrateCv({})).toBeNull();
    expect(migrateCv({ id: "x" })).toBeNull();
    expect(migrateCv({ id: "x", name: "Test" })).toBeNull();
  });

  it("backfills missing sections and settings", () => {
    const cv = createDefaultCv({ name: "Original" });
    const partial = {
      id: cv.id,
      name: cv.name,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
      templateId: cv.templateId,
      sections: {
        personal: cv.sections.personal,
        experience: cv.sections.experience,
        education: cv.sections.education,
        skills: cv.sections.skills,
        // projects, certifications, languages intentionally omitted
      },
      settings: {
        accentColor: cv.settings.accentColor,
        // backgroundColor and primaryColor intentionally omitted
      },
    };

    const migrated = migrateCv(partial);
    expect(migrated).not.toBeNull();
    expect(migrated!.sections.projects).toEqual([]);
    expect(migrated!.sections.certifications).toEqual([]);
    expect(migrated!.sections.languages).toEqual([]);
    expect(migrated!.settings.backgroundColor).toBe("#ffffff");
    expect(migrated!.settings.primaryColor).toBe("#111827");
  });

  it("preserves existing values when present", () => {
    const cv = createDefaultCv({
      name: "Custom",
      templateId: "classic",
      settings: {
        accentColor: "#ff0000",
        backgroundColor: "#eeeeee",
        primaryColor: "#333333",
        fontFamily: "Roboto",
        sectionVisibility: {},
        sectionOrder: [],
      },
    });

    const migrated = migrateCv(cv);
    expect(migrated).toEqual(cv);
  });
});
