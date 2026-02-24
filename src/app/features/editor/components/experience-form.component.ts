import { Component, signal, effect } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ResumeService } from "../services/resume.service";
import { ExperienceForm } from "../interfaces/resume-forms.interface";
import { Experience } from "../interfaces/resume.interface";

@Component({
  selector: "app-experience-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Work Experience</h2>
        <button
          (click)="toggleAddForm()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {{
            showForm()
              ? "Cancel"
              : editingId()
                ? "Cancel Edit"
                : "Add Experience"
          }}
        </button>
      </div>

      <!-- Add/Edit Experience Form -->
      @if (showForm()) {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <h3 class="text-md font-medium text-gray-700 mb-2">
            {{ editingId() ? "Edit Experience" : "New Experience" }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Job Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Job Title *</label
              >
              <input
                type="text"
                formControlName="jobTitle"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Software Engineer"
              />
              <div
                *ngIf="
                  form.controls.jobTitle.touched &&
                  form.controls.jobTitle.invalid
                "
                class="text-red-500 text-xs mt-1"
              >
                Job Title is required
              </div>
            </div>

            <!-- Company -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Company *</label
              >
              <input
                type="text"
                formControlName="company"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tech Corp"
              />
              <div
                *ngIf="
                  form.controls.company.touched && form.controls.company.invalid
                "
                class="text-red-500 text-xs mt-1"
              >
                Company is required
              </div>
            </div>

            <!-- Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Location</label
              >
              <input
                type="text"
                formControlName="location"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="San Francisco, CA"
              />
            </div>

            <!-- Start Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Start Date *</label
              >
              <input
                type="month"
                formControlName="startDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div
                *ngIf="
                  form.controls.startDate.touched &&
                  form.controls.startDate.invalid
                "
                class="text-red-500 text-xs mt-1"
              >
                Start Date is required
              </div>
            </div>

            <!-- End Date / Current -->
            <div>
              @if (!form.controls.current.value) {
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >End Date</label
                >
                <input
                  type="month"
                  formControlName="endDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              }
              <div class="flex items-center mt-2">
                <input
                  type="checkbox"
                  formControlName="current"
                  id="current"
                  class="mr-2"
                />
                <label for="current" class="text-sm text-gray-700"
                  >Currently working here</label
                >
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Description</label
            >
            <textarea
              formControlName="description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Key responsibilities and achievements..."
            ></textarea>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              (click)="cancelEdit()"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="form.invalid"
            >
              {{ editingId() ? "Update Experience" : "Add Experience" }}
            </button>
          </div>
        </form>
      }

      <!-- Experience List -->
      <div class="space-y-4">
        @for (exp of resumeService.resume().experience; track exp.id) {
          <div
            class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200 group"
          >
            <div class="flex justify-between items-start mb-2">
              <div
                class="cursor-pointer flex-grow"
                (click)="editExperience(exp)"
              >
                <h3
                  class="font-semibold text-gray-800 group-hover:text-blue-600"
                >
                  {{ exp.jobTitle }}
                </h3>
                <p class="text-gray-600">
                  {{ exp.company }}
                  {{ exp.location ? " - " + exp.location : "" }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(exp.startDate) }} -
                  {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                </p>
              </div>
              <div class="flex space-x-2">
                <button
                  (click)="editExperience(exp)"
                  class="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Edit
                </button>
                <button
                  (click)="removeExperience(exp.id)"
                  class="text-red-600 hover:text-red-800 transition-colors duration-200 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
            @if (exp.description) {
              <p
                class="text-gray-700 text-sm mt-2 whitespace-pre-wrap"
                (click)="editExperience(exp)"
              >
                {{ exp.description }}
              </p>
            }
          </div>
        }
        @if (resumeService.resume().experience.length === 0) {
          <p class="text-gray-500 text-center py-8">
            No work experience added yet.
          </p>
        }
      </div>
    </div>
  `,
})
export class ExperienceFormComponent {
  showForm = signal(false);
  editingId = signal<string | null>(null);

  form: FormGroup<ExperienceForm>;

  constructor(public resumeService: ResumeService) {
    this.form = new FormGroup<ExperienceForm>({
      id: new FormControl("", { nonNullable: true }),
      jobTitle: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      company: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      location: new FormControl("", { nonNullable: true }),
      startDate: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      endDate: new FormControl("", { nonNullable: true }),
      current: new FormControl(false, { nonNullable: true }),
      description: new FormControl("", { nonNullable: true }),
    });

    // Handle current checkbox logic via signal effect or subscription
    // Since we want to clear/disable endDate when current is true
    this.form.controls.current.valueChanges.subscribe((isCurrent) => {
      if (isCurrent) {
        this.form.controls.endDate.setValue("");
        this.form.controls.endDate.disable();
      } else {
        this.form.controls.endDate.enable();
      }
    });
  }

  toggleAddForm() {
    if (this.showForm()) {
      this.cancelEdit();
    } else {
      this.startNew();
    }
  }

  startNew() {
    this.editingId.set(null);
    this.form.reset({
      id: this.resumeService.generateId(),
      current: false,
    });
    this.showForm.set(true);
  }

  editExperience(exp: Experience) {
    this.editingId.set(exp.id);
    this.form.patchValue({
      id: exp.id,
      jobTitle: exp.jobTitle,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
    });
    this.showForm.set(true);
  }

  cancelEdit() {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset();
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const experience: Experience = {
        ...formValue,
        id: this.editingId() || formValue.id || this.resumeService.generateId(),
      };

      if (this.editingId()) {
        this.resumeService.updateExperience(this.editingId()!, experience);
      } else {
        this.resumeService.addExperience(experience);
      }
      this.cancelEdit();
    } else {
      this.form.markAllAsTouched();
    }
  }

  removeExperience(id: string) {
    if (confirm("Are you sure you want to delete this experience?")) {
      this.resumeService.removeExperience(id);
      if (this.editingId() === id) {
        this.cancelEdit();
      }
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Be robust against invalid dates in manual entry
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }
}
