import { Injectable, signal, computed } from "@angular/core";
import {
  Resume,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  ResumeTemplate,
} from "../interfaces/resume.interface";

@Injectable({
  providedIn: "root",
})
export class ResumeService {
  private resumeData = signal<Resume>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
  });

  private selectedTemplate = signal<string>("modern");

  // Computed signals
  resume = computed(() => this.resumeData());
  currentTemplate = computed(() => this.selectedTemplate());

  templates: ResumeTemplate[] = [
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
    { id: "minimal", name: "Minimal", description: "Simple and elegant" },
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

  updatePersonalInfo(personalInfo: PersonalInfo) {
    this.resumeData.update((resume) => ({
      ...resume,
      personalInfo,
    }));
  }

  addExperience(experience: Experience) {
    this.resumeData.update((resume) => ({
      ...resume,
      experience: [...resume.experience, experience],
    }));
  }

  updateExperience(id: string, updatedExperience: Experience) {
    this.resumeData.update((resume) => ({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === id ? updatedExperience : exp
      ),
    }));
  }

  removeExperience(id: string) {
    this.resumeData.update((resume) => ({
      ...resume,
      experience: resume.experience.filter((exp) => exp.id !== id),
    }));
  }

  addEducation(education: Education) {
    this.resumeData.update((resume) => ({
      ...resume,
      education: [...resume.education, education],
    }));
  }

  updateEducation(id: string, updatedEducation: Education) {
    this.resumeData.update((resume) => ({
      ...resume,
      education: resume.education.map((edu) =>
        edu.id === id ? updatedEducation : edu
      ),
    }));
  }

  removeEducation(id: string) {
    this.resumeData.update((resume) => ({
      ...resume,
      education: resume.education.filter((edu) => edu.id !== id),
    }));
  }

  addSkill(skill: Skill) {
    this.resumeData.update((resume) => ({
      ...resume,
      skills: [...resume.skills, skill],
    }));
  }

  updateSkill(id: string, updatedSkill: Skill) {
    this.resumeData.update((resume) => ({
      ...resume,
      skills: resume.skills.map((skill) =>
        skill.id === id ? updatedSkill : skill
      ),
    }));
  }

  removeSkill(id: string) {
    this.resumeData.update((resume) => ({
      ...resume,
      skills: resume.skills.filter((skill) => skill.id !== id),
    }));
  }

  selectTemplate(templateId: string) {
    this.selectedTemplate.set(templateId);
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
