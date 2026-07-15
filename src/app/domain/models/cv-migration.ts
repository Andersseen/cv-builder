import { Cv } from "./cv-model";
import { createDefaultCv } from "./cv-defaults";

/**
 * Backfill a CV that may be missing fields added after the initial schema.
 * Used both when loading from IndexedDB and when importing JSON.
 *
 * If the input is structurally invalid (missing id/name/etc.), it returns
 * `null` so the caller can decide whether to drop it or report an error.
 */
export function migrateCv(cv: unknown): Cv | null {
  if (!cv || typeof cv !== "object") return null;

  const source = cv as Partial<Cv>;

  if (
    typeof source.id !== "string" ||
    typeof source.name !== "string" ||
    typeof source.createdAt !== "string" ||
    typeof source.updatedAt !== "string" ||
    typeof source.templateId !== "string" ||
    !source.sections ||
    typeof source.sections !== "object"
  ) {
    return null;
  }

  const defaults = createDefaultCv({
    id: source.id,
    name: source.name,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    templateId: source.templateId,
  });

  return {
    ...defaults,
    sections: {
      personal: {
        ...defaults.sections.personal,
        ...(source.sections.personal ?? {}),
      },
      experience: source.sections.experience ?? defaults.sections.experience,
      education: source.sections.education ?? defaults.sections.education,
      skills: source.sections.skills ?? defaults.sections.skills,
      projects: source.sections.projects ?? defaults.sections.projects,
      certifications:
        source.sections.certifications ?? defaults.sections.certifications,
      languages: source.sections.languages ?? defaults.sections.languages,
    },
    settings: {
      ...defaults.settings,
      ...source.settings,
      backgroundColor:
        source.settings?.backgroundColor ?? defaults.settings.backgroundColor,
      primaryColor:
        source.settings?.primaryColor ?? defaults.settings.primaryColor,
    },
  };
}
