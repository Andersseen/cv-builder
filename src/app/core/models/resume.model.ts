export interface Resume {
  id: string;
  name: string;
  lastModified: Date;
  personalInfo: PersonalInfo;
  sections: Section[];
  settings: ResumeSettings;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  location: string;
  website?: string;
  linkedIn?: string;
  github?: string;
  summary: string;
  profileImage?: string;
}

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  items: SectionItem[];
  visible: boolean;
  order: number;
}

export enum SectionType {
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  SKILLS = 'skills',
  PROJECTS = 'projects',
  CERTIFICATES = 'certificates',
  LANGUAGES = 'languages',
  CUSTOM = 'custom'
}

export interface SectionItem {
  id: string;
  [key: string]: any;
}

export interface ExperienceItem extends SectionItem {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface EducationItem extends SectionItem {
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface SkillItem extends SectionItem {
  name: string;
  level: number; // 1-5
  category?: string;
}

export interface ProjectItem extends SectionItem {
  name: string;
  description: string;
  url?: string;
  technologies: string[];
  startDate?: string;
  endDate?: string;
}

export interface CertificateItem extends SectionItem {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface LanguageItem extends SectionItem {
  name: string;
  level: string; // Beginner, Intermediate, Advanced, Native
}

export interface CustomItem extends SectionItem {
  title: string;
  content: string;
}

export interface ResumeSettings {
  template: string;
  color: string;
  font: string;
  fontSize: string;
  spacing: string;
  showHeader: boolean;
  darkMode: boolean;
}

export const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern', thumbnail: 'assets/templates/modern.png' },
  { id: 'classic', name: 'Classic', thumbnail: 'assets/templates/classic.png' },
  { id: 'minimal', name: 'Minimal', thumbnail: 'assets/templates/minimal.png' },
  { id: 'creative', name: 'Creative', thumbnail: 'assets/templates/creative.png' },
];

export const DEFAULT_RESUME_SETTINGS: ResumeSettings = {
  template: 'modern',
  color: '#3B82F6', // primary-500
  font: 'Inter',
  fontSize: 'medium',
  spacing: 'comfortable',
  showHeader: true,
  darkMode: false,
};

export const DEFAULT_RESUME: Resume = {
  id: '',
  name: 'Untitled Resume',
  lastModified: new Date(),
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    location: '',
    summary: '',
    website: '',
    linkedIn: '',
    github: '',
  },
  sections: [],
  settings: DEFAULT_RESUME_SETTINGS
};