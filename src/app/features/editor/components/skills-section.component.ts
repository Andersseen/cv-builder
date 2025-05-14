import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Section, SkillItem } from "../../../core/models/resume.model";

@Component({
  selector: "app-skills-section",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <h2 class="text-lg font-semibold">{{ section.title }}</h2>
          <button
            type="button"
            class="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            (click)="toggleEdit()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
          </button>
        </div>

        <div class="flex items-center">
          <button
            type="button"
            class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mr-2"
            (click)="toggleCollapsed()"
          >
            @if (collapsed) {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            } @else {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
            }
          </button>

          <button
            type="button"
            class="text-error-600 hover:text-error-700"
            (click)="deleteSection()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      @if (editingTitle) {
      <div class="mb-4 flex">
        <input type="text" [(ngModel)]="editedTitle" class="input mr-2" />
        <button
          type="button"
          class="btn btn-primary py-2 px-3"
          (click)="saveTitleEdit()"
        >
          Save
        </button>
      </div>
      } @if (!collapsed) { @if (section.items.length === 0) {
      <p class="text-gray-500 dark:text-gray-400 mb-4">No skills added yet.</p>
      } @else {
      <div class="mb-4">
        <div class="flex flex-wrap gap-2">
          @for (item of section.items; track item.id) {
          <div
            class="inline-flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1"
          >
            <button
              type="button"
              class="ml-1 text-error-600 hover:text-error-700"
              (click)="deleteItem(item.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          }
        </div>
      </div>
      } @if (showItemForm) {
      <form
        [formGroup]="itemForm"
        (ngSubmit)="submitItemForm()"
        class="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md"
      >
        <h3 class="text-lg font-medium mb-3">
          {{ editingItemId ? "Edit Skill" : "Add Skill" }}
        </h3>

        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Skill Name *
          </label>
          <input type="text" formControlName="name" class="input" />
          @if (submitted && itemForm.controls['name'].errors) {
          <p class="mt-1 text-sm text-error-500">Skill name is required</p>
          }
        </div>

        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Category
          </label>
          <input
            type="text"
            formControlName="category"
            class="input"
            placeholder="e.g., Programming, Design, etc."
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Proficiency Level
          </label>
          <div class="flex items-center space-x-1">
            @for (level of [1, 2, 3, 4, 5]; track level) {
            <button
              type="button"
              class="w-8 h-8 rounded-full flex items-center justify-center focus:outline-none"
              [ngClass]="{
                'bg-primary-500 text-white':
                  itemForm.controls['level'].value >= level,
                'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300':
                  itemForm.controls['level'].value < level
              }"
              (click)="setSkillLevel(level)"
            >
              {{ level }}
            </button>
            }
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">
              {{ getLevelText(itemForm.controls["level"].value) }}
            </span>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="btn btn-secondary px-4 py-2"
            (click)="cancelItemForm()"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary px-4 py-2">
            {{ editingItemId ? "Update" : "Add" }}
          </button>
        </div>
      </form>
      } @else {
      <button
        type="button"
        class="btn btn-secondary px-4 py-2"
        (click)="addItem()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Add Skill
      </button>
      } }
    </div>
  `,
})
export class SkillsSectionComponent {
  @Input() section!: Section;

  @Output() sectionUpdated = new EventEmitter<{
    id: string;
    updates: Partial<Section>;
  }>();
  @Output() sectionDeleted = new EventEmitter<string>();
  @Output() itemAdded = new EventEmitter<Partial<SkillItem>>();
  @Output() itemUpdated = new EventEmitter<{
    id: string;
    updates: Partial<SkillItem>;
  }>();
  @Output() itemDeleted = new EventEmitter<string>();
  @Output() itemsReordered = new EventEmitter<string[]>();

  collapsed = false;
  editingTitle = false;
  editedTitle = "";

  showItemForm = false;
  editingItemId: string | null = null;
  itemForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.itemForm = this.createItemForm();
  }

  private createItemForm(): FormGroup {
    return this.fb.group({
      name: ["", Validators.required],
      level: [3], // Default to intermediate
      category: [""],
    });
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  toggleEdit(): void {
    this.editingTitle = !this.editingTitle;
    this.editedTitle = this.section.title;
  }

  saveTitleEdit(): void {
    if (this.editedTitle.trim()) {
      this.sectionUpdated.emit({
        id: this.section.id,
        updates: { title: this.editedTitle.trim() },
      });
      this.editingTitle = false;
    }
  }

  deleteSection(): void {
    if (confirm("Are you sure you want to delete this section?")) {
      this.sectionDeleted.emit(this.section.id);
    }
  }

  addItem(): void {
    this.editingItemId = null;
    this.itemForm = this.createItemForm();
    this.showItemForm = true;
    this.submitted = false;
  }

  editItem(item: SkillItem): void {
    this.editingItemId = item.id;
    this.showItemForm = true;
    this.submitted = false;

    this.itemForm.patchValue({
      name: item.name,
      level: item.level || 3,
      category: item.category || "",
    });
  }

  cancelItemForm(): void {
    this.showItemForm = false;
    this.editingItemId = null;
  }

  submitItemForm(): void {
    this.submitted = true;

    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;

      const itemData: Partial<SkillItem> = {
        name: formValue.name,
        level: formValue.level,
        category: formValue.category,
      };

      if (this.editingItemId) {
        this.itemUpdated.emit({
          id: this.editingItemId,
          updates: itemData,
        });
      } else {
        this.itemAdded.emit(itemData);
      }

      this.showItemForm = false;
      this.editingItemId = null;
    }
  }

  deleteItem(itemId: string): void {
    if (confirm("Are you sure you want to delete this skill?")) {
      this.itemDeleted.emit(itemId);
    }
  }

  setSkillLevel(level: number): void {
    this.itemForm.patchValue({ level });
  }

  getLevelText(level: number): string {
    switch (level) {
      case 1:
        return "Beginner";
      case 2:
        return "Basic";
      case 3:
        return "Intermediate";
      case 4:
        return "Advanced";
      case 5:
        return "Expert";
      default:
        return "Not specified";
    }
  }
}
