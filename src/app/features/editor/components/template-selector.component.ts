import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RESUME_TEMPLATES } from '../../../core/models/resume.model';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Template
      </label>
      <div class="grid grid-cols-2 gap-2">
        @for (template of templates; track template.id) {
          <div 
            class="relative rounded-md overflow-hidden border-2 cursor-pointer transition-all"
            [ngClass]="{'border-primary-500': currentTemplate === template.id, 'border-transparent hover:border-gray-300 dark:hover:border-gray-600': currentTemplate !== template.id}"
            (click)="selectTemplate(template.id)"
          >
            <img 
              [src]="getTemplateThumbnail(template.id)"
              [alt]="template.name"
              class="w-full h-auto"
            />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span class="text-white text-sm font-medium">{{ template.name }}</span>
            </div>
            @if (currentTemplate === template.id) {
              <div class="absolute top-2 right-2 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class TemplateSelectorComponent {
  @Input() currentTemplate: string = 'modern';
  @Output() templateSelected = new EventEmitter<string>();
  
  templates = RESUME_TEMPLATES;
  
  getTemplateThumbnail(templateId: string): string {
    // Placeholder images from Pexels
    const thumbnails: Record<string, string> = {
      'modern': 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'classic': 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'minimal': 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'creative': 'https://images.pexels.com/photos/6177645/pexels-photo-6177645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    };
    
    return thumbnails[templateId] || 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  }
  
  selectTemplate(templateId: string): void {
    if (this.currentTemplate !== templateId) {
      this.templateSelected.emit(templateId);
    }
  }
}