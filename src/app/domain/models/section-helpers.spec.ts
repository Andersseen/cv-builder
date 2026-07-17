import { describe, it, expect } from "vitest";
import {
  getOrderedSections,
  isSectionVisible,
  toggleSectionVisibility,
  moveSection,
  getSectionLabel,
  createCustomSection,
  DEFAULT_SECTION_ORDER,
} from "./section-helpers";
import { createDefaultCv } from "./cv-defaults";

describe("section helpers", () => {
  it("returns default order for a blank CV", () => {
    const cv = createDefaultCv();
    const order = getOrderedSections(cv);
    expect(order).toEqual([...DEFAULT_SECTION_ORDER]);
  });

  it("filters out hidden sections", () => {
    const cv = createDefaultCv();
    cv.settings.sectionVisibility = { skills: false, experience: false };
    const order = getOrderedSections(cv);
    expect(order).not.toContain("skills");
    expect(order).not.toContain("experience");
    expect(order).toContain("education");
  });

  it("respects a custom section order", () => {
    const cv = createDefaultCv();
    cv.settings.sectionOrder = ["skills", "education", "experience"];
    const order = getOrderedSections(cv);
    expect(order.indexOf("skills")).toBeLessThan(order.indexOf("education"));
    expect(order.indexOf("education")).toBeLessThan(order.indexOf("experience"));
  });

  it("appends missing built-in sections at the end", () => {
    const cv = createDefaultCv();
    cv.settings.sectionOrder = ["experience"];
    const order = getOrderedSections(cv);
    expect(order[0]).toBe("experience");
    expect(order).toContain("education");
    expect(order).toContain("skills");
  });

  it("appends custom sections after built-in ones by default", () => {
    const cv = createDefaultCv();
    const custom = createCustomSection("Volunteering");
    cv.sections.customSections = [custom];
    const order = getOrderedSections(cv);
    expect(order[order.length - 1]).toBe(custom.id);
  });

  it("places custom sections according to sectionOrder when present", () => {
    const cv = createDefaultCv();
    const custom = createCustomSection("Volunteering");
    cv.sections.customSections = [custom];
    cv.settings.sectionOrder = [custom.id, "experience"];
    const order = getOrderedSections(cv);
    expect(order[0]).toBe(custom.id);
    expect(order[1]).toBe("experience");
  });

  it("reports all sections visible by default", () => {
    const cv = createDefaultCv();
    expect(isSectionVisible(cv, "experience")).toBe(true);
    expect(isSectionVisible(cv, "skills")).toBe(true);
  });

  it("reports a section hidden when explicitly set to false", () => {
    const cv = createDefaultCv();
    cv.settings.sectionVisibility = { skills: false };
    expect(isSectionVisible(cv, "skills")).toBe(false);
  });

  it("toggles section visibility", () => {
    let visibility: Record<string, boolean> = {};
    visibility = toggleSectionVisibility(visibility, "skills");
    expect(visibility.skills).toBe(false);
    visibility = toggleSectionVisibility(visibility, "skills");
    expect(visibility.skills).toBe(true);
  });

  it("moves a section up and down", () => {
    const order = ["a", "b", "c"];
    expect(moveSection(order, "b", "up")).toEqual(["b", "a", "c"]);
    expect(moveSection(order, "b", "down")).toEqual(["a", "c", "b"]);
    expect(moveSection(order, "a", "up")).toEqual(["a", "b", "c"]);
    expect(moveSection(order, "c", "down")).toEqual(["a", "b", "c"]);
  });

  it("returns labels for built-in and custom sections", () => {
    const cv = createDefaultCv();
    expect(getSectionLabel(cv, "experience")).toBe("Experience");
    const custom = createCustomSection("Volunteering");
    cv.sections.customSections = [custom];
    expect(getSectionLabel(cv, custom.id)).toBe("Volunteering");
  });

  it("handles a custom section with an empty title", () => {
    const cv = createDefaultCv();
    const custom = createCustomSection("");
    cv.sections.customSections = [custom];
    expect(getSectionLabel(cv, custom.id)).toBe("Untitled section");
  });
});
