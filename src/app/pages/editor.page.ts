import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  effect,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CvStore } from "../application/state/cv";
import { Autosave } from "../application/services/autosave";
import { PdfExport } from "../infrastructure/export/pdf-export";
import { PrintExport } from "../infrastructure/export/print-export";
import { EditorToolbar } from "../features/editor/components/editor-toolbar";
import { PersonalInfoForm } from "../features/editor/components/personal-info-form";
import { ExperienceForm } from "../features/editor/components/experience-form";
import { EducationForm } from "../features/editor/components/education-form";
import { SkillsForm } from "../features/editor/components/skills-form";
import { ProjectsForm } from "../features/editor/components/projects-form";
import { CertificationsForm } from "../features/editor/components/certifications-form";
import { LanguagesForm } from "../features/editor/components/languages-form";
import { TemplateSelector } from "../features/editor/components/template-selector";
import { ResumePreview } from "../features/editor/components/resume-preview";
import {
  EditorTabs,
  EditorTab,
  TabConfig,
} from "../features/editor/components/editor-tabs";
import {
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
} from "../domain/models/cv-model";
import { ToastService } from "../core/services/toast";

@Component({
  selector: "app-editor",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditorToolbar,
    PersonalInfoForm,
    ExperienceForm,
    EducationForm,
    SkillsForm,
    ProjectsForm,
    CertificationsForm,
    LanguagesForm,
    TemplateSelector,
    ResumePreview,
    EditorTabs,
  ],
  templateUrl: "./editor.html",
})
export default class Editor implements OnInit, OnDestroy {
  readonly cvStore = inject(CvStore);
  readonly autosave = inject(Autosave);
  private readonly pdfExport = inject(PdfExport);
  private readonly printExport = inject(PrintExport);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected isExporting = signal(false);
  protected activeTab = signal<EditorTab>("personal");
  protected previewOpen = signal(true);

  protected readonly tabs: TabConfig[] = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "projects", label: "Projects", icon: "🛠️" },
    { id: "certifications", label: "Certifications", icon: "📜" },
    { id: "languages", label: "Languages", icon: "🌐" },
    { id: "template", label: "Template", icon: "🎨" },
  ];

  private autosaveEffect = effect(() => {
    const cv = this.cvStore.activeCv();
    if (!cv) return;
    this.autosave.scheduleAutosave(cv);
  });

  async ngOnInit() {
    await this.cvStore.loadAll();
    const cvId = this.route.snapshot.queryParamMap.get("cv");
    if (cvId) {
      this.cvStore.setActive(cvId);
    }
    if (!this.cvStore.activeCv()) {
      // No valid ?cv= id — don't leave the user on a blank editor.
      this.toast.show(
        cvId
          ? "That resume no longer exists — pick one from your dashboard."
          : "Open a resume from your dashboard to start editing.",
        "error",
      );
      this.router.navigate(["/dashboard"]);
    }
  }

  ngOnDestroy() {
    this.autosave.destroy();
  }

  protected goBack() {
    this.router.navigate(["/dashboard"]);
  }

  protected updatePersonalInfo(personal: PersonalInfo) {
    this.cvStore.updateActiveCv({ sections: { personal } });
  }

  protected updateExperience(experience: Experience[]) {
    this.cvStore.updateActiveCv({ sections: { experience } });
  }

  protected updateEducation(education: Education[]) {
    this.cvStore.updateActiveCv({ sections: { education } });
  }

  protected updateSkills(skills: Skill[]) {
    this.cvStore.updateActiveCv({ sections: { skills } });
  }

  protected updateProjects(projects: Project[]) {
    this.cvStore.updateActiveCv({ sections: { projects } });
  }

  protected updateCertifications(certifications: Certification[]) {
    this.cvStore.updateActiveCv({ sections: { certifications } });
  }

  protected updateLanguages(languages: Language[]) {
    this.cvStore.updateActiveCv({ sections: { languages } });
  }

  protected changeTemplate(templateId: string) {
    this.cvStore.updateActiveCv({ templateId });
  }

  protected changeAccentColor(accentColor: string) {
    this.cvStore.updateActiveCv({ settings: { accentColor } });
  }

  protected changeBackgroundColor(backgroundColor: string) {
    this.cvStore.updateActiveCv({ settings: { backgroundColor } });
  }

  protected changePrimaryColor(primaryColor: string) {
    this.cvStore.updateActiveCv({ settings: { primaryColor } });
  }

  protected async exportPdf() {
    const cv = this.cvStore.activeCv();
    if (!cv) return;
    const el = document.getElementById("resume-content");
    if (!el) {
      this.toast.show("Preview not ready", "error");
      return;
    }
    this.isExporting.set(true);
    try {
      await this.pdfExport.exportToPdf(cv, el);
      this.toast.show("PDF exported successfully", "success");
    } catch (err) {
      console.error("PDF export error:", err);
      this.toast.show("Error exporting PDF", "error");
    } finally {
      this.isExporting.set(false);
    }
  }

  protected async printResume() {
    const el = document.getElementById("resume-content");
    if (!el) {
      this.toast.show("Preview not ready — show the preview first", "error");
      return;
    }
    try {
      await this.printExport.printResume(el);
    } catch (err) {
      console.error("Print error:", err);
      this.toast.show("Error opening print dialog", "error");
    }
  }
}
