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
import { CloudPdfExport } from "../infrastructure/export/cloud-pdf-export";
import { EditorToolbar } from "../features/editor/components/editor-toolbar";
import { PersonalInfoForm } from "../features/editor/components/personal-info-form";
import { ExperienceForm } from "../features/editor/components/experience-form";
import { EducationForm } from "../features/editor/components/education-form";
import { SkillsForm } from "../features/editor/components/skills-form";
import { ProjectsForm } from "../features/editor/components/projects-form";
import { CertificationsForm } from "../features/editor/components/certifications-form";
import { LanguagesForm } from "../features/editor/components/languages-form";
import { TemplateSelector } from "../features/editor/components/template-selector";
import { SectionsManager } from "../features/editor/components/sections-manager";
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
  CustomSection,
} from "../domain/models/cv-model";
import { ToastService } from "../core/services/toast";
import { Viewport } from "../core/services/viewport";
import { A4 } from "../infrastructure/export/a4";
import { createCustomSection } from "../domain/models/section-helpers";

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
    SectionsManager,
  ],
  templateUrl: "./editor.html",
  host: {
    "(window:keydown)": "onKeydown($event)",
  },
})
export default class Editor implements OnInit, OnDestroy {
  readonly cvStore = inject(CvStore);
  readonly autosave = inject(Autosave);
  readonly viewport = inject(Viewport);
  private readonly pdfExport = inject(PdfExport);
  private readonly printExport = inject(PrintExport);
  private readonly cloudPdfExport = inject(CloudPdfExport);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected isExporting = signal(false);
  protected activeTab = signal<EditorTab>("personal");
  protected previewOpen = signal(true);
  protected mobilePreviewOpen = signal(false);
  protected previewScale = signal(1);

  protected readonly tabs: TabConfig[] = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "projects", label: "Projects", icon: "🛠️" },
    { id: "certifications", label: "Certifications", icon: "📜" },
    { id: "languages", label: "Languages", icon: "🌐" },
    { id: "sections", label: "Sections", icon: "📋" },
    { id: "template", label: "Template", icon: "🎨" },
  ];

  private autosaveEffect = effect(() => {
    const cv = this.cvStore.activeCv();
    if (!cv) return;
    this.autosave.scheduleAutosave(cv);
  });

  private scaleEffect = effect(() => {
    const width = this.viewport.width();
    const padding = 32;
    const available = Math.max(width - padding, 0);
    const scale = Math.min(available / A4.WIDTH_PX, 1);
    this.previewScale.set(scale);
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

  protected togglePreview() {
    if (this.viewport.isMobile()) {
      this.mobilePreviewOpen.set(!this.mobilePreviewOpen());
    } else {
      this.previewOpen.set(!this.previewOpen());
    }
  }

  protected closeMobilePreview() {
    this.mobilePreviewOpen.set(false);
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

  protected updateSectionVisibility(sectionVisibility: Record<string, boolean>) {
    this.cvStore.updateActiveCv({ settings: { sectionVisibility } });
  }

  protected updateSectionOrder(sectionOrder: string[]) {
    this.cvStore.updateActiveCv({ settings: { sectionOrder } });
  }

  protected addCustomSection() {
    const section = createCustomSection("Custom Section");
    const cv = this.cvStore.activeCv();
    if (!cv) return;
    const customSections = [...cv.sections.customSections, section];
    this.cvStore.updateActiveCv({
      sections: { customSections },
      settings: {
        sectionOrder: [...(cv.settings.sectionOrder ?? []), section.id],
      },
    });
  }

  protected updateCustomSection(id: string, section: CustomSection) {
    const cv = this.cvStore.activeCv();
    if (!cv) return;
    const customSections = cv.sections.customSections.map((s) =>
      s.id === id ? section : s,
    );
    this.cvStore.updateActiveCv({ sections: { customSections } });
  }

  protected removeCustomSection(id: string) {
    const cv = this.cvStore.activeCv();
    if (!cv) return;
    const customSections = cv.sections.customSections.filter((s) => s.id !== id);
    const sectionOrder = (cv.settings.sectionOrder ?? []).filter((sId) => sId !== id);
    this.cvStore.updateActiveCv({
      sections: { customSections },
      settings: { sectionOrder },
    });
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

  protected selectTab(tabId: string) {
    // The tab IDs emitted by the completeness score are constrained to the
    // same union used by the editor tabs.
    this.activeTab.set(tabId as EditorTab);
  }

  protected changePrimaryColor(primaryColor: string) {
    this.cvStore.updateActiveCv({ settings: { primaryColor } });
  }

  protected changeFontFamily(fontFamily: string) {
    this.cvStore.updateActiveCv({ settings: { fontFamily } });
  }

  protected async exportPdf() {
    const cv = this.cvStore.activeCv();
    if (!cv) return;
    const el = this.findResumeContentElement();
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
    const cv = this.cvStore.activeCv();
    const el = this.findResumeContentElement();
    if (!el) {
      this.toast.show("Preview not ready — show the preview first", "error");
      return;
    }
    if (!cv) return;
    try {
      await this.printExport.printResume(cv, el);
    } catch (err) {
      console.error("Print error:", err);
      this.toast.show("Error opening print dialog", "error");
    }
  }

  protected async exportCloudPdf() {
    const cv = this.cvStore.activeCv();
    if (!cv) return;
    const el = this.findResumeContentElement();
    if (!el) {
      this.toast.show("Preview not ready", "error");
      return;
    }
    this.isExporting.set(true);
    try {
      await this.cloudPdfExport.exportToPdf(cv, el);
      this.toast.show("Cloud PDF exported successfully", "success");
    } catch (err) {
      console.error("Cloud PDF export error:", err);
      this.toast.show("Error exporting cloud PDF", "error");
    } finally {
      this.isExporting.set(false);
    }
  }

  protected exportCvJson() {
    const cv = this.cvStore.activeCv();
    if (!cv) return;
    this.cvStore.exportCv(cv);
  }

  protected onKeydown(event: KeyboardEvent) {
    const isMod = event.ctrlKey || event.metaKey;
    if (!isMod || event.key.toLowerCase() !== "z") return;

    event.preventDefault();
    if (event.shiftKey) {
      this.cvStore.redo();
    } else {
      this.cvStore.undo();
    }
  }

  /** Show an undo toast when a list item is deleted. */
  protected onListItemRemoved(label: string) {
    this.toast.show(
      `${label} deleted`,
      "info",
      5000,
      { label: "Undo", handler: () => this.cvStore.undo() },
    );
  }

  private findResumeContentElement(): HTMLElement | null {
    return (
      document.querySelector("[data-export-preview] .resume-content") ??
      document.querySelector(".resume-content")
    );
  }
}
