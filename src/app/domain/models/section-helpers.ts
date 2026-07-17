import { Cv, CustomSection, CustomItem } from "./cv-model";

/**
 * Built-in section IDs in their default order. Personal is deliberately
 * handled separately by the templates (header/sidebar), so it is omitted here.
 */
export const DEFAULT_SECTION_ORDER: string[] = [
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
];

/**
 * Default display label for each built-in section.
 */
export const BUILT_IN_SECTION_LABELS: Record<string, string> = {
  personal: "Personal",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
};

/**
 * Returns a list of all non-personal section IDs that should be rendered, in order.
 * Built-in sections that are missing from `settings.sectionOrder` are appended
 * at the end in their default order. Custom sections are appended after all
 * built-in sections unless they appear in `settings.sectionOrder`. Hidden
 * sections are filtered out.
 */
export function getOrderedSections(cv: Cv): string[] {
  const customIds = cv.sections.customSections.map((section) => section.id);
  const allIds = [...DEFAULT_SECTION_ORDER, ...customIds];

  // Start from the user-defined order, but only keep IDs that still exist.
  const order = (cv.settings.sectionOrder ?? []).filter((id) => allIds.includes(id));

  // Append any missing sections in their default order.
  for (const id of allIds) {
    if (!order.includes(id)) {
      order.push(id);
    }
  }

  return order.filter((id) => isSectionVisible(cv, id));
}

/**
 * Returns true if a section is visible. A section is visible unless it is
 * explicitly set to false in `settings.sectionVisibility`.
 */
export function isSectionVisible(cv: Cv, sectionId: string): boolean {
  const visibility = cv.settings.sectionVisibility ?? {};
  return visibility[sectionId] !== false;
}

/**
 * Toggle the visibility of a section. Mutates the provided visibility record.
 */
export function toggleSectionVisibility(
  visibility: Record<string, boolean>,
  sectionId: string,
): Record<string, boolean> {
  const currentlyVisible = visibility[sectionId] !== false;
  return { ...visibility, [sectionId]: !currentlyVisible };
}

/**
 * Move a section one position up or down in the order array. Returns a new
 * array. Non-existing IDs are ignored.
 */
export function moveSection(
  order: string[],
  sectionId: string,
  direction: "up" | "down",
): string[] {
  const index = order.indexOf(sectionId);
  if (index === -1) return order;

  const newOrder = [...order];
  if (direction === "up" && index > 0) {
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
  } else if (direction === "down" && index < newOrder.length - 1) {
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
  }
  return newOrder;
}

export function createCustomSection(title = "Custom Section"): CustomSection {
  return {
    id: crypto.randomUUID(),
    title,
    items: [createCustomItem()],
  };
}

export function createCustomItem(): CustomItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    subtitle: "",
    description: "",
  };
}

/**
 * Human-readable label for a section ID. Built-in sections use fixed labels;
 * custom sections use their own title.
 */
export function getSectionLabel(cv: Cv, sectionId: string): string {
  if (sectionId === "personal") return BUILT_IN_SECTION_LABELS["personal"];
  const custom = cv.sections.customSections.find((s) => s.id === sectionId);
  if (custom) return custom.title || "Untitled section";
  return BUILT_IN_SECTION_LABELS[sectionId] ?? sectionId;
}
