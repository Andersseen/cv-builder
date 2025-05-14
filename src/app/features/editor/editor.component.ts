import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Resume, SectionType } from "../../core/models/resume.model";
import { ExportService } from "../../core/services/export.service";
import { ResumeService } from "../../core/services/resume.service";
import { generateId } from "../../core/utils/id.utils";
import { EducationSectionComponent } from "./components/education-section.component";
import { ExperienceSectionComponent } from "./components/experience-section.component";
import { PersonalInfoFormComponent } from "./components/personal-info-form.component";
import { SectionControlsComponent } from "./components/section-controls.component";
import { SkillsSectionComponent } from "./components/skills-section.component";
import { TemplateSelectorComponent } from "./components/template-selector.component";

@Component({
  selector: "app-editor",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PersonalInfoFormComponent,
    SectionControlsComponent,
    ExperienceSectionComponent,
    EducationSectionComponent,
    SkillsSectionComponent,
    TemplateSelectorComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div class="container mx-auto px-4 pt-8">
        <div
          class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 class="text-3xl font-bold">Resume Editor</h1>
            <p class="text-gray-600 dark:text-gray-300">
              Create and customize your professional resume
            </p>
          </div>

          <div class="flex gap-3">
            <button
              class="btn btn-secondary px-4 py-2"
              (click)="togglePreviewMode()"
            >
              {{ previewMode() ? "Edit Mode" : "Preview Mode" }}
            </button>

            <div class="relative">
              <button
                class="btn btn-primary px-4 py-2"
                (click)="toggleExportMenu()"
              >
                Export
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              @if (exportMenuOpen) {
              <div
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
              >
                <div class="py-1" role="menu" aria-orientation="vertical">
                  <button
                    class="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 block px-4 py-2 text-sm w-full text-left"
                    (click)="exportToPDF()"
                  >
                    Export as PDF
                  </button>
                  <button
                    class="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 block px-4 py-2 text-sm w-full text-left"
                    (click)="exportToJSON()"
                  >
                    Export as JSON
                  </button>
                </div>
              </div>
              }
            </div>
          </div>
        </div>

        @if (!previewMode()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Editor Panel -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Resume Controls -->
            <div class="card">
              <h2 class="text-lg font-semibold mb-4">Resume Settings</h2>
              <div class="mb-4">
                <label
                  for="resumeName"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Resume Name
                </label>
                <input
                  type="text"
                  id="resumeName"
                  class="input"
                  [(ngModel)]="resumeName"
                  (blur)="updateResumeName()"
                />
              </div>

              <app-template-selector
                [currentTemplate]="currentResume?.settings.template || 'modern'"
                (templateSelected)="changeTemplate($event)"
              ></app-template-selector>
            </div>

            <!-- Personal Info Section -->
            <app-personal-info-form
              [personalInfo]="currentResume?.personalInfo || {}"
              (infoChanged)="updatePersonalInfo($event)"
            ></app-personal-info-form>

            <!-- Sections Controls -->
            <app-section-controls
              [sections]="currentResume?.sections || []"
              (addSection)="addSection($event)"
              (reorderSections)="reorderSections($event)"
            ></app-section-controls>
          </div>

          <!-- Sections Editor -->
          <div class="lg:col-span-1 space-y-6">
            @if (currentResume) { @for (section of currentResume.sections; track
            section.id) { @if (section.type === 'experience') {
            <app-experience-section
              [section]="section"
              (sectionUpdated)="updateSection($event)"
              (sectionDeleted)="deleteSection($event)"
              (itemAdded)="addSectionItem(section.id, $event)"
              (itemUpdated)="updateSectionItem(section.id, $event)"
              (itemDeleted)="deleteSectionItem(section.id, $event)"
              (itemsReordered)="reorderSectionItems(section.id, $event)"
            ></app-experience-section>
            } @else if (section.type === 'education') {
            <app-education-section
              [section]="section"
              (sectionUpdated)="updateSection($event)"
              (sectionDeleted)="deleteSection($event)"
              (itemAdded)="addSectionItem(section.id, $event)"
              (itemUpdated)="updateSectionItem(section.id, $event)"
              (itemDeleted)="deleteSectionItem(section.id, $event)"
              (itemsReordered)="reorderSectionItems(section.id, $event)"
            ></app-education-section>
            } @else if (section.type === 'skills') {
            <app-skills-section
              [section]="section"
              (sectionUpdated)="updateSection($event)"
              (sectionDeleted)="deleteSection($event)"
              (itemAdded)="addSectionItem(section.id, $event)"
              (itemUpdated)="updateSectionItem(section.id, $event)"
              (itemDeleted)="deleteSectionItem(section.id, $event)"
              (itemsReordered)="reorderSectionItems(section.id, $event)"
            ></app-skills-section>
            } } }
          </div>

          <!-- Preview Panel -->
          <div class="lg:col-span-1">
            <div class="sticky top-20">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
                <h2 class="text-lg font-semibold mb-2">Preview</h2>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  This is how your resume will look when exported
                </p>
              </div>
            </div>
          </div>
        </div>
        } @else {
        <!-- Preview Mode -->
        <div class="flex justify-center"></div>
        }
      </div>
    </div>
  `,
})
export default class EditorComponent implements OnInit {
  @ViewChild("resumePreview") resumePreviewElement?: ElementRef;

  private resumeService = inject(ResumeService);
  private exportService = inject(ExportService);

  public currentResume: Resume | null = null;
  public resumeName: string = "";
  public exportMenuOpen: boolean = false;
  public previewMode = signal(false);

  ngOnInit(): void {
    // Check if we have a current resume
    const resume = this.resumeService.currentResume();

    if (resume) {
      this.currentResume = resume;
      this.resumeName = resume.name;
    } else {
      // Create a new resume
      const newResume = this.resumeService.createResume();
      this.currentResume = newResume;
      this.resumeName = newResume.name;
    }
  }

  togglePreviewMode(): void {
    this.previewMode.update((prev) => !prev);
  }

  toggleExportMenu(): void {
    this.exportMenuOpen = !this.exportMenuOpen;
  }

  exportToPDF(): void {
    this.exportMenuOpen = false;

    if (this.currentResume) {
      const elementId = this.previewMode()
        ? "resumeFullPreview"
        : "resumePreview";
      this.exportService.exportToPdf(this.currentResume, elementId);
    }
  }

  exportToJSON(): void {
    this.exportMenuOpen = false;

    if (this.currentResume) {
      this.exportService.exportToJSON(this.currentResume);
    }
  }

  updateResumeName(): void {
    if (this.currentResume && this.resumeName.trim()) {
      this.resumeService.updateResume({
        ...this.currentResume,
        name: this.resumeName.trim(),
      });
    }
  }

  changeTemplate(templateId: string): void {
    if (this.currentResume) {
      this.resumeService.updateSettings({ template: templateId });
      this.currentResume = this.resumeService.currentResume();
    }
  }

  updatePersonalInfo(personalInfo: Partial<Resume["personalInfo"]>): void {
    this.resumeService.updatePersonalInfo(personalInfo);
    this.currentResume = this.resumeService.currentResume();
  }

  addSection(type: SectionType): void {
    this.resumeService.addSection(type);
    this.currentResume = this.resumeService.currentResume();
  }

  updateSection(section: { id: string; updates: Partial<any> }): void {
    this.resumeService.updateSection(section.id, section.updates);
    this.currentResume = this.resumeService.currentResume();
  }

  deleteSection(sectionId: string): void {
    this.resumeService.deleteSection(sectionId);
    this.currentResume = this.resumeService.currentResume();
  }

  reorderSections(orderedIds: string[]): void {
    this.resumeService.reorderSections(orderedIds);
    this.currentResume = this.resumeService.currentResume();
  }

  addSectionItem(sectionId: string, item: any): void {
    this.resumeService.addSectionItem(sectionId, { ...item, id: generateId() });
    this.currentResume = this.resumeService.currentResume();
  }

  updateSectionItem(
    sectionId: string,
    data: { id: string; updates: any }
  ): void {
    this.resumeService.updateSectionItem(sectionId, data.id, data.updates);
    this.currentResume = this.resumeService.currentResume();
  }

  deleteSectionItem(sectionId: string, itemId: string): void {
    this.resumeService.deleteSectionItem(sectionId, itemId);
    this.currentResume = this.resumeService.currentResume();
  }

  reorderSectionItems(sectionId: string, orderedIds: string[]): void {
    this.resumeService.reorderSectionItems(sectionId, orderedIds);
    this.currentResume = this.resumeService.currentResume();
  }
}
