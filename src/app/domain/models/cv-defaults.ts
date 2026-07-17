import {
  Cv,
  CvSections,
  CvSettings,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
  CustomSection,
  CustomItem,
} from "./cv-model";

// ─── Factory functions ───────────────────────────────────────

export function createDefaultCv(overrides?: Partial<Cv>): Cv {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: "Untitled Resume",
    createdAt: now,
    updatedAt: now,
    templateId: "modern",
    sections: createDefaultSections(),
    settings: createDefaultSettings(),
    ...overrides,
  };
}

export function createDefaultSections(): CvSections {
  return {
    personal: createDefaultPersonalInfo(),
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
  };
}

export function createDefaultPersonalInfo(): PersonalInfo {
  return {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
    avatarUrl: "",
  };
}

export function createDefaultExperience(): Experience {
  return {
    id: crypto.randomUUID(),
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

export function createDefaultEducation(): Education {
  return {
    id: crypto.randomUUID(),
    degree: "",
    institution: "",
    location: "",
    graduationDate: "",
    gpa: "",
  };
}

export function createDefaultSkill(): Skill {
  return {
    id: crypto.randomUUID(),
    name: "",
    level: "Beginner",
  };
}

export function createDefaultProject(): Project {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    url: "",
    technologies: "",
  };
}

export function createDefaultCertification(): Certification {
  return {
    id: crypto.randomUUID(),
    name: "",
    issuer: "",
    date: "",
    url: "",
  };
}

export function createDefaultLanguage(): Language {
  return {
    id: crypto.randomUUID(),
    name: "",
    proficiency: "Professional",
  };
}

export function createDefaultSettings(): CvSettings {
  return {
    accentColor: "#3B82F6",
    backgroundColor: "#ffffff",
    primaryColor: "#111827",
    fontFamily: "Inter",
    sectionVisibility: {},
    sectionOrder: [],
  };
}

export function createDefaultCustomSection(title = "Custom Section"): CustomSection {
  return {
    id: crypto.randomUUID(),
    title,
    items: [],
  };
}

export function createDefaultCustomItem(): CustomItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    subtitle: "",
    description: "",
  };
}
