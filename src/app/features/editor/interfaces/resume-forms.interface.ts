import { FormControl } from "@angular/forms";

export interface PersonalInfoForm {
  fullName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  location: FormControl<string>;
  website: FormControl<string>;
  linkedin: FormControl<string>;
  summary: FormControl<string>;
}

export interface ExperienceForm {
  id: FormControl<string>;
  jobTitle: FormControl<string>;
  company: FormControl<string>;
  location: FormControl<string>;
  startDate: FormControl<string>;
  endDate: FormControl<string>;
  current: FormControl<boolean>;
  description: FormControl<string>;
}

export interface EducationForm {
  id: FormControl<string>;
  degree: FormControl<string>;
  institution: FormControl<string>;
  location: FormControl<string>;
  graduationDate: FormControl<string>;
  gpa: FormControl<string>;
}

export interface SkillForm {
  id: FormControl<string>;
  name: FormControl<string>;
  level: FormControl<"Beginner" | "Intermediate" | "Advanced" | "Expert">;
}
