/**
 * Domain models for the CV Builder.
 * Pure TypeScript — no Angular, no RxJS, no side effects.
 */

// ─── Root Aggregate ──────────────────────────────────────────

export interface Cv {
  id: string;
  name: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  templateId: string;
  sections: CvSections;
  settings: CvSettings;
}

// ─── Sections ────────────────────────────────────────────────

export interface CvSections {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa: string;
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

// ─── Settings ────────────────────────────────────────────────

export interface CvSettings {
  accentColor: string;
  fontFamily: string;
}

// ─── Template metadata (pure data, no component refs) ────────

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  previewLayout:
    | "single-column"
    | "sidebar-left"
    | "sidebar-right"
    | "two-column"
    | "header-accent";
}

// ─── Utility type for partial deep updates ───────────────────

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
