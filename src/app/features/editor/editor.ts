import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  effect,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CvStore } from "../../application/state/cv";
import { Autosave } from "../../application/services/autosave";
import { PdfExport } from "../../infrastructure/export/pdf-export";
import { PrintExport } from "../../infrastructure/export/print-export";
import { EditorToolbar } from "./components/editor-toolbar";
import { PersonalInfoForm } from "./components/personal-info-form";
import { ExperienceForm } from "./components/experience-form";
import { EducationForm } from "./components/education-form";
import { SkillsForm } from "./components/skills-form";
import { TemplateSelector } from "./components/template-selector";
import { ResumePreview } from "./components/resume-preview";
import { EditorTabs, EditorTab, TabConfig } from "./components/editor-tabs";
import {
  PersonalInfo,
  Experience,
  Education,
  Skill,
} from "../../domain/models/cv-model";
import { ToastService } from "../../core/services/toast";

@Component({
  selector: "app-editor",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditorToolbar,
    PersonalInfoForm,
    ExperienceForm,
    EducationForm,
    SkillsForm,
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
