import { Cv, Experience, Education, Skill, Project, Certification, Language } from "./cv-model";
import { createDefaultCv } from "./cv-defaults";

/**
 * Returns a fully populated example CV to help new users understand
 * what a complete resume looks like in the app. Uses only existing
 * Cv fields — no model changes required.
 */
export function createExampleCv(overrides?: Partial<Cv>): Cv {
  const now = new Date().toISOString();
  return {
    ...createDefaultCv({
      name: "Alex Rivera - Example Resume",
      createdAt: now,
      updatedAt: now,
      templateId: "modern",
    }),
    sections: {
      personal: {
        fullName: "Alex Rivera",
        email: "alex.rivera@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "https://alexrivera.example.com",
        linkedin: "https://linkedin.com/in/alexrivera",
        summary:
          "Product-minded senior frontend engineer with 8+ years of experience building fast, accessible web applications. Proven track record leading design-system migrations, improving Core Web Vitals, and shipping products used by millions. Passionate about developer experience, performance budgets, and clean UI.",
        avatarUrl: "",
      },
      experience: createExampleExperience(),
      education: createExampleEducation(),
      skills: createExampleSkills(),
      projects: createExampleProjects(),
      certifications: createExampleCertifications(),
      languages: createExampleLanguages(),
      customSections: [],
    },
    ...overrides,
  };
}

function createExampleExperience(): Experience[] {
  return [
    {
      id: crypto.randomUUID(),
      jobTitle: "Senior Frontend Engineer",
      company: "PixelBridge",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "",
      current: true,
      description:
        "Lead the frontend platform team of 6 engineers.\n- Migrated the core product from a legacy AngularJS stack to Angular with signals, reducing bundle size by 34%.\n- Defined performance budgets and drove LCP from 4.2s to 1.1s on 3G.\n- Shipped a design system used by 12 internal product teams.\n- Mentored junior engineers through pair programming and code reviews.",
    },
    {
      id: crypto.randomUUID(),
      jobTitle: "Frontend Engineer",
      company: "CloudLoop",
      location: "Remote",
      startDate: "2017-06",
      endDate: "2021-02",
      current: false,
      description:
        "Built customer-facing dashboards and data-visualization features.\n- Implemented real-time charts with WebSockets used by 50k+ daily users.\n- Reduced average page load time by 40% through code splitting and lazy loading.\n- Collaborated with designers to establish accessibility guidelines (WCAG 2.1 AA).",
    },
  ];
}

function createExampleEducation(): Education[] {
  return [
    {
      id: crypto.randomUUID(),
      degree: "B.S. in Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      graduationDate: "2017-05",
      gpa: "3.8",
    },
  ];
}

function createExampleSkills(): Skill[] {
  return [
    { id: crypto.randomUUID(), name: "TypeScript", level: "Expert" },
    { id: crypto.randomUUID(), name: "Angular", level: "Expert" },
    { id: crypto.randomUUID(), name: "React", level: "Advanced" },
    { id: crypto.randomUUID(), name: "Performance Optimization", level: "Advanced" },
    { id: crypto.randomUUID(), name: "Accessibility", level: "Advanced" },
    { id: crypto.randomUUID(), name: "Testing (Vitest, Playwright)", level: "Intermediate" },
  ];
}

function createExampleProjects(): Project[] {
  return [
    {
      id: crypto.randomUUID(),
      name: "OpenResume",
      description:
        "An open-source resume generator with live preview and PDF export.\n- Built with Angular signals and Tailwind CSS.\n- Supports 5 templates and offline storage via IndexedDB.\n- 1,200+ GitHub stars.",
      url: "https://github.com/alexrivera/openresume",
      technologies: "Angular, TypeScript, Dexie, html-to-image, jspdf",
    },
    {
      id: crypto.randomUUID(),
      name: "TaskPilot",
      description:
        "A productivity dashboard for remote teams.\n- Implemented drag-and-drop boards and real-time sync.\n- Focused on keyboard navigation and screen-reader support.",
      url: "https://taskpilot.example.com",
      technologies: "React, TypeScript, Firebase, Tailwind CSS",
    },
  ];
}

function createExampleCertifications(): Certification[] {
  return [
    {
      id: crypto.randomUUID(),
      name: "Google UX Design Certificate",
      issuer: "Google",
      date: "2022-08",
      url: "https://coursera.org/verify/google-ux-design",
    },
    {
      id: crypto.randomUUID(),
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2023-03",
      url: "",
    },
  ];
}

function createExampleLanguages(): Language[] {
  return [
    { id: crypto.randomUUID(), name: "English", proficiency: "Native" },
    { id: crypto.randomUUID(), name: "Spanish", proficiency: "Fluent" },
    { id: crypto.randomUUID(), name: "Portuguese", proficiency: "Conversational" },
  ];
}
