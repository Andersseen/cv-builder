import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ExperienceItem, Section } from "../../../core/models/resume.model";

@Component({
  selector: "app-experience-section",
  imports: [FormsModule, ReactiveFormsModule],
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
      } @if (!collapsed) { @if (showItemForm) {
      <form
        [formGroup]="itemForm"
        (ngSubmit)="submitItemForm()"
        class="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md"
      >
        <h3 class="text-lg font-medium mb-3">
          {{ editingItemId ? "Edit Experience" : "Add Experience" }}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Company *
            </label>
            <input type="text" formControlName="company" class="input" />
            @if (submitted && itemForm.controls['company'].errors) {
            <p class="mt-1 text-sm text-error-500">Company is required</p>
            }
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Position *
            </label>
            <input type="text" formControlName="position" class="input" />
            @if (submitted && itemForm.controls['position'].errors) {
            <p class="mt-1 text-sm text-error-500">Position is required</p>
            }
          </div>
        </div>

        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Location
          </label>
          <input type="text" formControlName="location" class="input" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Start Date *
            </label>
            <input
              type="text"
              formControlName="startDate"
              class="input"
              placeholder="MM/YYYY"
            />
            @if (submitted && itemForm.controls['startDate'].errors) {
            <p class="mt-1 text-sm text-error-500">Start date is required</p>
            }
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              End Date
            </label>
            <input
              type="text"
              formControlName="endDate"
              class="input"
              placeholder="MM/YYYY"
              [disabled]="itemForm.controls['current'].value"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="flex items-center">
            <input type="checkbox" formControlName="current" class="mr-2" />
            <span class="text-sm text-gray-700 dark:text-gray-300"
              >I currently work here</span
            >
          </label>
        </div>

        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </label>
          <textarea
            rows="3"
            formControlName="description"
            class="input"
          ></textarea>
        </div>

        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Achievements
          </label>

          <div formArrayName="achievements" class="space-y-2">
            @for (achievement of achievements.controls; track $index) {
            <div class="flex items-center">
              <input
                type="text"
                [formControlName]="$index"
                class="input flex-grow"
              />
              <button
                type="button"
                class="ml-2 text-error-600 hover:text-error-700 p-1"
                (click)="removeAchievement($index)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
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

          <button
            type="button"
            class="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center"
            (click)="addAchievement()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Add Achievement
          </button>
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
        Add Experience
      </button>
      } }
    </div>
  `,
})
export class ExperienceSectionComponent {
  @Input() section!: Section;

  @Output() sectionUpdated = new EventEmitter<{
    id: string;
    updates: Partial<Section>;
  }>();
  @Output() sectionDeleted = new EventEmitter<string>();
  @Output() itemAdded = new EventEmitter<Partial<ExperienceItem>>();
  @Output() itemUpdated = new EventEmitter<{
    id: string;
    updates: Partial<ExperienceItem>;
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

  get achievements() {
    return this.itemForm.get("achievements") as FormArray;
  }

  private createItemForm(): FormGroup {
    return this.fb.group({
      company: ["", Validators.required],
      position: ["", Validators.required],
      location: [""],
      startDate: ["", Validators.required],
      endDate: [""],
      current: [false],
      description: [""],
      achievements: this.fb.array([]),
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
    this.addAchievement(); // Add one empty achievement field by default
  }

  editItem(item: ExperienceItem): void {
    this.editingItemId = item.id;
    this.showItemForm = true;
    this.submitted = false;

    // Reset achievements array
    while (this.achievements.length) {
      this.achievements.removeAt(0);
    }

    // Add achievements from item
    if (item.achievements && item.achievements.length) {
      item.achievements.forEach((achievement) => {
        this.achievements.push(this.fb.control(achievement));
      });
    } else {
      this.addAchievement(); // Add one empty achievement field
    }

    this.itemForm.patchValue({
      company: item.company,
      position: item.position,
      location: item.location || "",
      startDate: item.startDate,
      endDate: item.endDate || "",
      current: item.current || false,
      description: item.description || "",
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

      // Filter out empty achievements
      const achievements = formValue.achievements.filter(
        (a: string) => a.trim() !== ""
      );

      const itemData: Partial<ExperienceItem> = {
        company: formValue.company,
        position: formValue.position,
        location: formValue.location,
        startDate: formValue.startDate,
        endDate: formValue.current ? "" : formValue.endDate,
        current: formValue.current,
        description: formValue.description,
        achievements,
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
    if (confirm("Are you sure you want to delete this experience entry?")) {
      this.itemDeleted.emit(itemId);
    }
  }

  addAchievement(): void {
    this.achievements.push(this.fb.control(""));
  }

  removeAchievement(index: number): void {
    this.achievements.removeAt(index);
  }
}
