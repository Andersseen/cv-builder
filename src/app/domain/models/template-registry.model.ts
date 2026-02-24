import { TemplateInfo } from "./cv.model";

/**
 * Static template catalog.
 * To add a new template:
 *   1. Create a standalone component in resume-templates/
 *   2. Add an entry here
 *   3. Register it in TemplateRegistryService
 */
export const TEMPLATES: TemplateInfo[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional professional layout",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Unique and eye-catching",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated and formal",
  },
];
