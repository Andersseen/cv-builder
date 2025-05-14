import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Section, SectionType } from '../../../core/models/resume.model';

@Component({
  selector: 'app-section-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2 class="text-lg font-semibold mb-4">Sections</h2>
      
      <div class="mb-4">
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Add, remove, or reorder sections of your resume
        </p>
        
        <div class="relative">
          <button 
            type="button"
            class="btn btn-secondary w-full text-left flex justify-between items-center"
            (click)="toggleAddMenu()"
          >
            <span>Add Section</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </button>
          
          @if (addMenuOpen) {
            <div class="absolute z-10 left-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
              <div class="py-1">
                <button 
                  *ngFor="let option of sectionOptions"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  (click)="addNewSection(option.type)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          }
        </div>
      </div>
      
      <div>
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Sections:</h3>
        
        @if (sections && sections.length > 0) {
          <div 
            class="space-y-2"
            cdkDropList
            (cdkDropListDropped)="onDrop($event)"
          >
            @for (section of sortedSections; track section.id) {
              <div 
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 cursor-move"
                cdkDrag
              >
                <span>{{ section.title }}</span>
                <div class="flex items-center">
                  <button 
                    type="button"
                    class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    (click)="toggleSectionVisibility(section)"
                  >
                    @if (section.visible) {
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                      </svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    }
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="text-gray-500 dark:text-gray-400 text-sm italic">No sections added yet</p>
        }
      </div>
    </div>
  `
})
export class SectionControlsComponent {
  @Input() sections: Section[] = [];
  @Output() addSection = new EventEmitter<SectionType>();
  @Output() reorderSections = new EventEmitter<string[]>();
  
  addMenuOpen = false;
  
  sectionOptions = [
    { label: 'Experience', type: SectionType.EXPERIENCE },
    { label: 'Education', type: SectionType.EDUCATION },
    { label: 'Skills', type: SectionType.SKILLS },
    { label: 'Projects', type: SectionType.PROJECTS },
    { label: 'Certificates', type: SectionType.CERTIFICATES },
    { label: 'Languages', type: SectionType.LANGUAGES },
    { label: 'Custom Section', type: SectionType.CUSTOM }
  ];
  
  get sortedSections(): Section[] {
    return [...this.sections].sort((a, b) => a.order - b.order);
  }
  
  toggleAddMenu(): void {
    this.addMenuOpen = !this.addMenuOpen;
  }
  
  addNewSection(type: SectionType): void {
    this.addSection.emit(type);
    this.addMenuOpen = false;
  }
  
  toggleSectionVisibility(section: Section): void {
    // This would be implemented with cdkDrag in a real application
    // For this example, we'll just show the drag UI
  }
  
  onDrop(event: any): void {
    // This would be implemented with cdkDragDrop in a real application
    // We'd extract the section IDs in the new order and emit them
    const sectionIds = this.sections.map(section => section.id);
    this.reorderSections.emit(sectionIds);
  }
}