import {
  Cv,
  CvSections,
  CvSettings,
  PersonalInfo,
  Experience,
  Education,
  Skill,
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

export function createDefaultSettings(): CvSettings {
  return {
    accentColor: "#3B82F6",
    backgroundColor: "#ffffff",
    primaryColor: "#111827",
    fontFamily: "Inter",
  };
}
