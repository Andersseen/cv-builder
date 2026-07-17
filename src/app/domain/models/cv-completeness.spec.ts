import { describe, it, expect } from "vitest";
import { scoreCompleteness } from "./cv-completeness";
import { createDefaultCv } from "./cv-defaults";
import { createExampleCv } from "./cv-example";

describe("scoreCompleteness", () => {
  it("returns 0 for a completely blank CV with critical suggestions", () => {
    const cv = createDefaultCv();
    const result = scoreCompleteness(cv);
    expect(result.score).toBe(0);
    expect(result.suggestions.some((s) => s.severity === "critical")).toBe(true);
  });

  it("returns a high score for the example CV", () => {
    const cv = createExampleCv();
    const result = scoreCompleteness(cv);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.suggestions.filter((s) => s.severity === "critical").length).toBe(0);
  });

  it("adds points for full name and summary", () => {
    const cv = createDefaultCv();
    cv.sections.personal.fullName = "Jane Doe";
    cv.sections.personal.summary = "A passionate software engineer with 5 years of experience.";
    const result = scoreCompleteness(cv);
    expect(result.score).toBeGreaterThan(0);
  });

  it("flags an invalid email", () => {
    const cv = createDefaultCv();
    cv.sections.personal.fullName = "Jane Doe";
    cv.sections.personal.email = "not-an-email";
    const result = scoreCompleteness(cv);
    expect(result.suggestions.some((s) => s.message.includes("valid email"))).toBe(true);
  });

  it("flags a short summary", () => {
    const cv = createDefaultCv();
    cv.sections.personal.fullName = "Jane Doe";
    cv.sections.personal.summary = "Short summary.";
    const result = scoreCompleteness(cv);
    expect(result.suggestions.some((s) => s.message.includes("at least 80 characters"))).toBe(true);
  });

  it("flags missing experience and rewards detailed descriptions", () => {
    const cv = createDefaultCv();
    cv.sections.personal.fullName = "Jane Doe";
    cv.sections.personal.summary =
      "A dedicated software engineer with a strong background in web development and team leadership.";

    // Without experience, score should be lower and a critical suggestion should appear.
    const before = scoreCompleteness(cv);
    expect(before.suggestions.some((s) => s.tabId === "experience" && s.severity === "critical")).toBe(true);

    // With a detailed experience entry, the critical suggestion should disappear.
    cv.sections.experience = [
      {
        id: "exp-1",
        jobTitle: "Engineer",
        company: "Acme",
        location: "Remote",
        startDate: "2020-01",
        endDate: "",
        current: true,
        description:
          "Built scalable web applications used by thousands of users.\n- Improved performance by 40%.\n- Led migration to modern frontend stack.",
      },
    ];
    const after = scoreCompleteness(cv);
    expect(after.suggestions.some((s) => s.tabId === "experience" && s.severity === "critical")).toBe(false);
    expect(after.score).toBeGreaterThan(before.score);
  });

  it("sorts suggestions by severity (critical first)", () => {
    const cv = createDefaultCv();
    cv.sections.personal.fullName = "Jane Doe";
    cv.sections.personal.summary = "Short.";
    const result = scoreCompleteness(cv);
    const severities = result.suggestions.map((s) => s.severity);
    expect(severities.indexOf("critical")).toBeLessThan(severities.indexOf("warning"));
  });
});
