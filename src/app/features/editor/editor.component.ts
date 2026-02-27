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
import { PrintExportService } from "../../infrastructure/export/print-export.service";
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
        (printPdf)="printResume()"
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
          <div class="flex gap-6">
            <!-- LEFT: Sidebar Tabs + Form Content -->
            <div class="flex-1 min-w-0 flex gap-0">
              <!-- Vertical Sidebar Tabs -->
              <div
                class="hidden md:flex flex-col gap-1 bg-surface rounded-l-xl p-2 border border-border border-r-0 shrink-0"
                style="width: 160px;"
              >
                @for (tab of tabs; track tab.id) {
                  <button
                    (click)="activeTab.set(tab.id)"
                    class="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-left w-full"
                    [class]="
                      activeTab() === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                    "
                  >
                    <span class="text-base shrink-0">{{ tab.icon }}</span>
                    <span class="truncate">{{ tab.label }}</span>
                  </button>
                }
              </div>

              <!-- Mobile: horizontal tabs -->
              <div
                class="flex md:hidden gap-1 bg-surface rounded-t-xl p-1.5 border border-border border-b-0 overflow-x-auto mb-0"
              >
                @for (tab of tabs; track tab.id) {
                  <button
                    (click)="activeTab.set(tab.id)"
                    class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap"
                    [class]="
                      activeTab() === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                    "
                  >
                    <span>{{ tab.icon }}</span>
                    <span>{{ tab.label }}</span>
                  </button>
                }
              </div>

              <!-- Form content -->
              <div
                class="flex-1 min-w-0 bg-surface backdrop-blur-sm border border-border p-6
                       md:rounded-r-xl md:rounded-l-none rounded-b-xl md:rounded-b-xl"
              >
                @switch (activeTab()) {
                  @case ("personal") {
                    <app-personal-info-form
                      [data]="cvStore.activeCv()!.sections.personal"
                      (changed)="updatePersonalInfo($event)"
                    />
                  }
                  @case ("experience") {
                    <app-experience-form
                      [items]="cvStore.activeCv()!.sections.experience"
                      (itemsChange)="updateExperience($event)"
                    />
                  }
                  @case ("education") {
                    <app-education-form
                      [items]="cvStore.activeCv()!.sections.education"
                      (itemsChange)="updateEducation($event)"
                    />
                  }
                  @case ("skills") {
                    <app-skills-form
                      [items]="cvStore.activeCv()!.sections.skills"
                      (itemsChange)="updateSkills($event)"
                    />
                  }
                  @case ("template") {
                    <app-template-selector
                      [selectedTemplateId]="cvStore.activeCv()!.templateId"
                      [accentColor]="cvStore.activeCv()!.settings.accentColor"
                      [backgroundColor]="
                        cvStore.activeCv()!.settings.backgroundColor
                      "
                      [primaryColor]="cvStore.activeCv()!.settings.primaryColor"
                      (templateSelected)="changeTemplate($event)"
                      (colorChanged)="changeAccentColor($event)"
                      (backgroundColorChanged)="changeBackgroundColor($event)"
                      (primaryColorChanged)="changePrimaryColor($event)"
                    />
                  }
                }
              </div>
            </div>

            <!-- RIGHT: Preview (collapsible) -->
            @if (previewOpen()) {
              <div
                class="hidden lg:block w-[45%] shrink-0 lg:sticky lg:top-20 lg:self-start"
              >
                <app-resume-preview [cv]="cvStore.activeCv()!" />
              </div>
            }
          </div>
        </div>

        <!-- Preview toggle button -->
        <button
          (click)="previewOpen.set(!previewOpen())"
          class="hidden lg:flex fixed bottom-6 right-6 z-50 items-center gap-2 px-4 py-2.5 rounded-full
                 bg-surface border border-border shadow-xl shadow-foreground/10
                 hover:bg-surface-hover transition-all duration-200 text-sm font-medium text-foreground"
          [title]="previewOpen() ? 'Hide preview' : 'Show preview'"
        >
          <span class="text-base">{{ previewOpen() ? "👁️" : "👁️‍🗨️" }}</span>
          {{ previewOpen() ? "Hide Preview" : "Show Preview" }}
        </button>
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
  private readonly printExportService = inject(PrintExportService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected isExporting = signal(false);
  protected activeTab = signal<EditorTab>("personal");
  protected previewOpen = signal(true);

  protected readonly tabs: { id: EditorTab; label: string; icon: string }[] = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "template", label: "Template", icon: "🎨" },
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

  protected async printResume() {
    const el = document.getElementById("resume-content");
    if (!el) {
      this.toastService.show(
        "Preview not ready — show the preview first",
        "error",
      );
      return;
    }
    try {
      await this.printExportService.printResume(el);
    } catch (err) {
      console.error("Print error:", err);
      this.toastService.show("Error opening print dialog", "error");
    }
  }
}
