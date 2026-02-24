import { TemplateInfo } from "./cv.model";

/**
 * Static template catalog.
 * To add a new template:
 *   1. Create a standalone component in resume-templates/
 *   2. Add an entry here
 *   3. Register it in ResumePreviewComponent's @switch block
 */
export const TEMPLATES: TemplateInfo[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Gradient header with card-based sections",
    accentColor: "#4f46e5",
    previewLayout: "header-accent",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional centered layout with serif feel",
    accentColor: "#475569",
    previewLayout: "single-column",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Maximum whitespace, clean typography",
    accentColor: "#171717",
    previewLayout: "single-column",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Dark sidebar with timeline and progress bars",
    accentColor: "#f59e0b",
    previewLayout: "sidebar-left",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Bold dark header with pill badges",
    accentColor: "#111827",
    previewLayout: "header-accent",
  },
];
