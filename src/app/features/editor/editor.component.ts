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
import { CvStore } from "../../application/state/cv.store";
import { AutosaveService } from "../../application/services/autosave.service";
import { PdfExportService } from "../../infrastructure/export/pdf-export.service";
import { EditorToolbarComponent } from "./components/editor-toolbar.component";
import { PersonalInfoFormComponent } from "./components/personal-info-form.component";
import { ExperienceFormComponent } from "./components/experience-form.component";
import { EducationFormComponent } from "./components/education-form.component";
import { SkillsFormComponent } from "./components/skills-form.component";
import { TemplateSelectorComponent } from "./components/template-selector.component";
import { ResumePreviewComponent } from "./components/resume-preview.component";
import {
  PersonalInfo,
  Experience,
  Education,
  Skill,
} from "../../domain/models/cv.model";
import { ToastService } from "../../core/services/toast.service";

type EditorTab =
  | "personal"
  | "experience"
  | "education"
  | "skills"
  | "template";

@Component({
  selector: "app-editor",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditorToolbarComponent,
    PersonalInfoFormComponent,
    ExperienceFormComponent,
    EducationFormComponent,
    SkillsFormComponent,
    TemplateSelectorComponent,
    ResumePreviewComponent,
  ],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Top Bar -->
      <app-editor-toolbar
        [cvName]="cvStore.activeCv()?.name"
        [saving]="autosaveService.saving()"
        [lastSavedAt]="autosaveService.lastSavedAt()"
        [isExporting]="isExporting()"
        (back)="goBack()"
        (exportPdf)="exportPdf()"
      />

      @if (cvStore.loading()) {
        <div class="flex items-center justify-center py-24">
          <div
            class="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"
          ></div>
        </div>
      } @else if (cvStore.activeCv()) {
        <!-- Main layout -->
        <div class="max-w-[1600px] mx-auto px-4 py-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- LEFT: Forms -->
            <div class="space-y-0">
              <!-- Tabs -->
              <div
                class="flex gap-1 bg-surface rounded-t-xl p-1.5 border border-border border-b-0 overflow-x-auto"
              >
                @for (tab of tabs; track tab.id) {
                  <button
                    (click)="activeTab.set(tab.id)"
                    class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap"
                    [class]="
                      activeTab() === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                    "
                  >
                    {{ tab.label }}
                  </button>
                }
              </div>

              <!-- Tab content -->
              <div
                class="bg-surface backdrop-blur-sm rounded-b-xl border border-border p-6"
              >
                @switch (activeTab()) {
                  @case ("personal") {
                    <app-personal-info-form
                      [data]="cvStore.activeCv()!.sections.personal"
                      (changed)="onPersonalInfoChange($event)"
                    />
                  }
                  @case ("experience") {
                    <app-experience-form
                      [items]="cvStore.activeCv()!.sections.experience"
                      (itemsChange)="onExperienceChange($event)"
                    />
                  }
                  @case ("education") {
                    <app-education-form
                      [items]="cvStore.activeCv()!.sections.education"
                      (itemsChange)="onEducationChange($event)"
                    />
                  }
                  @case ("skills") {
                    <app-skills-form
                      [items]="cvStore.activeCv()!.sections.skills"
                      (itemsChange)="onSkillsChange($event)"
                    />
                  }
                  @case ("template") {
                    <app-template-selector
                      [selectedTemplateId]="cvStore.activeCv()!.templateId"
                      [accentColor]="cvStore.activeCv()!.settings.accentColor"
                      (templateSelected)="onTemplateChange($event)"
                      (colorChanged)="onAccentColorChange($event)"
                    />
                  }
                }
              </div>
            </div>

            <!-- RIGHT: Preview -->
            <div class="lg:sticky lg:top-20 lg:self-start">
              <app-resume-preview [cv]="cvStore.activeCv()!" />
            </div>
          </div>
        </div>
      } @else {
        <!-- No CV found -->
        <div class="text-center py-24">
          <p class="text-muted-foreground mb-4">Resume not found</p>
          <button
            (click)="goBack()"
            class="text-primary hover:text-primary-700 transition-colors"
          >
            &larr; Back to dashboard
          </button>
        </div>
      }
    </div>
  `,
})
export default class EditorComponent implements OnInit, OnDestroy {
  readonly cvStore = inject(CvStore);
  readonly autosaveService = inject(AutosaveService);
  private readonly pdfExportService = inject(PdfExportService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isExporting = signal(false);
  activeTab = signal<EditorTab>("personal");

  readonly tabs: { id: EditorTab; label: string }[] = [
    { id: "personal", label: "Personal" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "template", label: "Template" },
  ];

  private autosaveEffect = effect(() => {
    const cv = this.cvStore.activeCv();
    if (!cv) return;
    this.autosaveService.scheduleAutosave(cv);
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
    this.autosaveService.destroy();
  }

  goBack() {
    this.router.navigate(["/dashboard"]);
  }

  onPersonalInfoChange(personal: PersonalInfo) {
    this.cvStore.updateActiveCv({ sections: { personal } });
  }

  onExperienceChange(experience: Experience[]) {
    this.cvStore.updateActiveCv({ sections: { experience } });
  }

  onEducationChange(education: Education[]) {
    this.cvStore.updateActiveCv({ sections: { education } });
  }

  onSkillsChange(skills: Skill[]) {
    this.cvStore.updateActiveCv({ sections: { skills } });
  }

  onTemplateChange(templateId: string) {
    this.cvStore.updateActiveCv({ templateId });
  }

  onAccentColorChange(accentColor: string) {
    this.cvStore.updateActiveCv({ settings: { accentColor } });
  }

  async exportPdf() {
    const cv = this.cvStore.activeCv();
    if (!cv) return;
    const el = document.getElementById("resume-content");
    if (!el) {
      this.toastService.show("Preview not ready", "error");
      return;
    }
    this.isExporting.set(true);
    try {
      await this.pdfExportService.exportToPdf(cv, el);
      this.toastService.show("PDF exported successfully", "success");
    } catch (err) {
      console.error("PDF export error:", err);
      this.toastService.show("Error exporting PDF", "error");
    } finally {
      this.isExporting.set(false);
    }
  }
}
