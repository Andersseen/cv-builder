import { Component, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ResumeService } from "../services/resume.service";
import { ModernTemplateComponent } from "./resume-templates/modern-template.component";
import { ClassicTemplateComponent } from "./resume-templates/classic-template.component";
import { MinimalTemplateComponent } from "./resume-templates/minimal-template.component";
import { CreativeTemplateComponent } from "./resume-templates/creative-template.component";
import { ExecutiveTemplateComponent } from "./resume-templates/executive-template.component";

declare const html2pdf: any;

@Component({
  selector: "app-resume-preview",
  standalone: true,
  imports: [
    CommonModule,
    ModernTemplateComponent,
    ClassicTemplateComponent,
    MinimalTemplateComponent,
    CreativeTemplateComponent,
    ExecutiveTemplateComponent,
  ],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Resume Preview</h2>
        <button
          (click)="downloadPDF()"
          class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold"
          [disabled]="isGenerating"
        >
          {{ isGenerating ? "Generating PDF..." : "Download as PDF" }}
        </button>
      </div>

      <div
        class="border border-gray-200 rounded-lg overflow-hidden"
        #previewContainer
      >
        @switch (resumeService.currentTemplate()) { @case ('modern') {
        <app-modern-template
          [resume]="resumeService.resume()"
        ></app-modern-template>
        } @case ('classic') {
        <app-classic-template
          [resume]="resumeService.resume()"
        ></app-classic-template>
        } @case ('minimal') {
        <app-minimal-template
          [resume]="resumeService.resume()"
        ></app-minimal-template>
        } @case ('creative') {
        <app-creative-template
          [resume]="resumeService.resume()"
        ></app-creative-template>
        } @case ('executive') {
        <app-executive-template
          [resume]="resumeService.resume()"
        ></app-executive-template>
        } }
      </div>
    </div>
  `,
})
export class ResumePreviewComponent {
  @ViewChild("previewContainer") previewContainer!: ElementRef;
  isGenerating = false;

  constructor(public resumeService: ResumeService) {}

  async downloadPDF() {
    this.isGenerating = true;

    try {
      const element =
        this.previewContainer.nativeElement.querySelector("#resume-content");
      const fullName =
        this.resumeService.resume().personalInfo.fullName || "Resume";
      const filename = `${fullName.replace(/\s+/g, "_")}_Resume.pdf`;

      const options = {
        margin: 0.5,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "portrait",
        },
      };

      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    } finally {
      this.isGenerating = false;
    }
  }
}
