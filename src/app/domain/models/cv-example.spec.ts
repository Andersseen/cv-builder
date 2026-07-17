import { describe, it, expect } from "vitest";
import { createExampleCv } from "./cv-example";

describe("createExampleCv", () => {
  it("returns a CV with a descriptive name", () => {
    const cv = createExampleCv();
    expect(cv.name).toContain("Example Resume");
  });

  it("populates all personal fields including summary", () => {
    const cv = createExampleCv();
    const { personal } = cv.sections;
    expect(personal.fullName).toBeTruthy();
    expect(personal.email).toContain("@");
    expect(personal.phone).toBeTruthy();
    expect(personal.location).toBeTruthy();
    expect(personal.summary.length).toBeGreaterThan(100);
  });

  it("has at least two experience entries with markdown bullets", () => {
    const cv = createExampleCv();
    expect(cv.sections.experience.length).toBeGreaterThanOrEqual(2);
    for (const entry of cv.sections.experience) {
      expect(entry.jobTitle).toBeTruthy();
      expect(entry.company).toBeTruthy();
      expect(entry.description).toContain("-");
    }
  });

  it("has education, skills, projects, certifications and languages", () => {
    const cv = createExampleCv();
    expect(cv.sections.education.length).toBeGreaterThan(0);
    expect(cv.sections.skills.length).toBeGreaterThanOrEqual(4);
    expect(cv.sections.projects.length).toBeGreaterThan(0);
    expect(cv.sections.certifications.length).toBeGreaterThan(0);
    expect(cv.sections.languages.length).toBeGreaterThan(0);
  });

  it("accepts overrides", () => {
    const cv = createExampleCv({ name: "Override" });
    expect(cv.name).toBe("Override");
  });
});
