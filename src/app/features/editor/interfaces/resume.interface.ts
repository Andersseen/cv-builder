export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
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
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface Resume {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
}
