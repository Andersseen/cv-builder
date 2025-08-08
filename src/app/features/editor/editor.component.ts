import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { EducationFormComponent } from "./components/education-form.component";
import { ExperienceFormComponent } from "./components/experience-form.component";
import { PersonalInfoFormComponent } from "./components/personal-info-form.component";
import { ResumePreviewComponent } from "./components/resume-preview.component";
import { SkillsFormComponent } from "./components/skills-form.component";
import { TemplateSelectorComponent } from "./components/template-selector.component";

@Component({
  selector: "app-editor",
  standalone: true,
  imports: [
    CommonModule,
    PersonalInfoFormComponent,
    ExperienceFormComponent,
    EducationFormComponent,
    SkillsFormComponent,
    TemplateSelectorComponent,
    ResumePreviewComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Forms Section -->
          <div
            class="space-y-6"
            [class.hidden]="showMobilePreview() && isMobile()"
          >
            <app-template-selector></app-template-selector>
            <app-personal-info-form></app-personal-info-form>
            <app-experience-form></app-experience-form>
            <app-education-form></app-education-form>
            <app-skills-form></app-skills-form>
          </div>

          <!-- Preview Section -->
          <div
            class="sticky top-8"
            [class.hidden]="!showMobilePreview() && isMobile()"
          >
            <app-resume-preview></app-resume-preview>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-16">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <div class="text-center">
            <p class="text-gray-600">Built with Angular 20 & Tailwind CSS</p>
            <p class="text-sm text-gray-500 mt-2">
              Export your resume as PDF directly in your browser
            </p>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export default class EditorComponent implements OnInit {
  showMobilePreview = signal(false);
  private screenWidth = signal(window.innerWidth);

  ngOnInit() {
    // Listen for window resize events
    window.addEventListener("resize", () => {
      this.screenWidth.set(window.innerWidth);
    });
  }

  toggleMobileView() {
    this.showMobilePreview.update((show) => !show);
  }

  isMobile(): boolean {
    return this.screenWidth() < 1024; // lg breakpoint
  }
}
