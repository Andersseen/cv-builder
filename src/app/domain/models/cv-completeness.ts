import { Cv } from "./cv-model";

export type SuggestionSeverity = "critical" | "warning" | "info";

export interface CompletenessSuggestion {
  severity: SuggestionSeverity;
  message: string;
  tabId: string;
}

export interface CompletenessResult {
  score: number;
  suggestions: CompletenessSuggestion[];
}

const MIN_SUMMARY_CHARS = 80;
const MIN_EXPERIENCE_DESCRIPTION_CHARS = 80;

/**
 * Pure function that scores a CV from 0 to 100 and returns actionable
 * suggestions. Each suggestion maps to an editor tab so the UI can navigate
 * the user directly to the missing field.
 */
export function scoreCompleteness(cv: Cv): CompletenessResult {
  let score = 0;
  const suggestions: CompletenessSuggestion[] = [];

  const { personal, experience, education, skills, projects, certifications, languages } =
    cv.sections;

  // Personal: full name (15 pts)
  if (personal.fullName.trim().length > 0) {
    score += 15;
  } else {
    suggestions.push({
      severity: "critical",
      message: "Add your full name",
      tabId: "personal",
    });
  }

  // Personal: email (5 pts) — only count if present and valid
  if (isValidEmail(personal.email)) {
    score += 5;
  } else if (personal.email.trim().length > 0) {
    suggestions.push({
      severity: "warning",
      message: "Add a valid email address",
      tabId: "personal",
    });
  } else {
    suggestions.push({
      severity: "warning",
      message: "Add an email address",
      tabId: "personal",
    });
  }

  // Summary: present (10 pts) + length (10 pts)
  const summaryLength = personal.summary.trim().length;
  if (summaryLength > 0) {
    score += 10;
  } else {
    suggestions.push({
      severity: "critical",
      message: "Add a professional summary",
      tabId: "personal",
    });
  }

  if (summaryLength >= MIN_SUMMARY_CHARS) {
    score += 10;
  } else if (summaryLength > 0) {
    suggestions.push({
      severity: "warning",
      message: "Expand your summary to at least 80 characters",
      tabId: "personal",
    });
  }

  // Experience: at least one entry (15 pts) + quality (10 pts)
  if (experience.length > 0) {
    score += 15;

    const hasDetailedEntry = experience.some(
      (e) =>
        e.description.trim().length >= MIN_EXPERIENCE_DESCRIPTION_CHARS &&
        e.description.includes("-"),
    );
    if (hasDetailedEntry) {
      score += 10;
    } else {
      suggestions.push({
        severity: "warning",
        message: "Add more detail to your experience descriptions (use bullet points)",
        tabId: "experience",
      });
    }
  } else {
    suggestions.push({
      severity: "critical",
      message: "Add at least one work experience entry",
      tabId: "experience",
    });
  }

  // Education (10 pts)
  if (education.length > 0) {
    score += 10;
  } else {
    suggestions.push({
      severity: "warning",
      message: "Add your education background",
      tabId: "education",
    });
  }

  // Skills: at least one (5 pts) + three or more (5 pts)
  if (skills.length > 0) {
    score += 5;
  } else {
    suggestions.push({
      severity: "warning",
      message: "Add at least one skill",
      tabId: "skills",
    });
  }

  if (skills.length >= 3) {
    score += 5;
  } else if (skills.length > 0) {
    suggestions.push({
      severity: "info",
      message: "Add a few more skills to strengthen your CV",
      tabId: "skills",
    });
  }

  // Projects (5 pts)
  if (projects.length > 0) {
    score += 5;
  } else {
    suggestions.push({
      severity: "info",
      message: "Add personal or open-source projects",
      tabId: "projects",
    });
  }

  // Certifications (5 pts)
  if (certifications.length > 0) {
    score += 5;
  } else {
    suggestions.push({
      severity: "info",
      message: "Add relevant certifications",
      tabId: "certifications",
    });
  }

  // Languages (5 pts)
  if (languages.length > 0) {
    score += 5;
  } else {
    suggestions.push({
      severity: "info",
      message: "Add languages you speak",
      tabId: "languages",
    });
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    suggestions: suggestions.sort((a, b) => severityRank(a.severity) - severityRank(b.severity)),
  };
}

function isValidEmail(email: string): boolean {
  if (!email) return false;
  // Basic RFC-style regex, sufficient for CV guidance.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function severityRank(severity: SuggestionSeverity): number {
  switch (severity) {
    case "critical":
      return 0;
    case "warning":
      return 1;
    case "info":
      return 2;
  }
}
