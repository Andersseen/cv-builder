import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ResumeService } from "../services/resume.service";

@Component({
  selector: "app-template-selector",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Choose Template</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        @for (template of resumeService.templates; track template.id) {
        <div
          class="border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"
          [class]="
            resumeService.currentTemplate() === template.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          "
          (click)="selectTemplate(template.id)"
        >
          <div class="text-center">
            <div
              class="w-full h-20 bg-gray-100 rounded mb-3 flex items-center justify-center"
            >
              <div class="text-xs text-gray-500 font-mono">
                {{ template.name }}
              </div>
            </div>
            <h3 class="font-semibold text-sm text-gray-800 mb-1">
              {{ template.name }}
            </h3>
            <p class="text-xs text-gray-600">{{ template.description }}</p>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class TemplateSelectorComponent {
  constructor(public resumeService: ResumeService) {}

  selectTemplate(templateId: string) {
    this.resumeService.selectTemplate(templateId);
  }
}
