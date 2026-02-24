import { Component, signal } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ResumeService } from "../services/resume.service";
import { EducationForm } from "../interfaces/resume-forms.interface";
import { Education } from "../interfaces/resume.interface";

@Component({
  selector: "app-education-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Education</h2>
        <button
          (click)="toggleAddForm()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {{
            showForm()
              ? "Cancel"
              : editingId()
                ? "Cancel Edit"
                : "Add Education"
          }}
        </button>
      </div>

      <!-- Add/Edit Education Form -->
      @if (showForm()) {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <h3 class="text-md font-medium text-gray-700 mb-2">
            {{ editingId() ? "Edit Education" : "New Education" }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Degree -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Degree *</label
              >
              <input
                type="text"
                formControlName="degree"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bachelor of Science in Computer Science"
              />
              <div
                *ngIf="
                  form.controls.degree.touched && form.controls.degree.invalid
                "
                class="text-red-500 text-xs mt-1"
              >
                Degree is required
              </div>
            </div>

            <!-- Institution -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Institution *</label
              >
              <input
                type="text"
                formControlName="institution"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="University of Technology"
              />
              <div
                *ngIf="
                  form.controls.institution.touched &&
                  form.controls.institution.invalid
                "
                class="text-red-500 text-xs mt-1"
              >
                Institution is required
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
                placeholder="Boston, MA"
              />
            </div>

            <!-- Graduation Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Graduation Date *</label
              >
              <input
                type="month"
                formControlName="graduationDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div
                *ngIf="
                  form.controls.graduationDate.touched &&
                  form.controls.graduationDate.invalid
                "
                class="text-red-500 text-xs mt-1"
              >
                Graduation Date is required
              </div>
            </div>

            <!-- GPA -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >GPA (Optional)</label
              >
              <input
                type="text"
                formControlName="gpa"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="3.8/4.0"
              />
            </div>
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
              {{ editingId() ? "Update Education" : "Add Education" }}
            </button>
          </div>
        </form>
      }

      <!-- Education List -->
      <div class="space-y-4">
        @for (edu of resumeService.resume().education; track edu.id) {
          <div
            class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200 group"
          >
            <div class="flex justify-between items-start mb-2">
              <div
                class="cursor-pointer flex-grow"
                (click)="editEducation(edu)"
              >
                <h3
                  class="font-semibold text-gray-800 group-hover:text-blue-600"
                >
                  {{ edu.degree }}
                </h3>
                <p class="text-gray-600">
                  {{ edu.institution }} - {{ edu.location }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatDate(edu.graduationDate) }}
                </p>
                @if (edu.gpa) {
                  <p class="text-sm text-gray-500">GPA: {{ edu.gpa }}</p>
                }
              </div>
              <div class="flex space-x-2">
                <button
                  (click)="editEducation(edu)"
                  class="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Edit
                </button>
                <button
                  (click)="removeEducation(edu.id)"
                  class="text-red-600 hover:text-red-800 transition-colors duration-200 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        }
        @if (resumeService.resume().education.length === 0) {
          <p class="text-gray-500 text-center py-8">No education added yet.</p>
        }
      </div>
    </div>
  `,
})
export class EducationFormComponent {
  showForm = signal(false);
  editingId = signal<string | null>(null);

  form: FormGroup<EducationForm>;

  constructor(public resumeService: ResumeService) {
    this.form = new FormGroup<EducationForm>({
      id: new FormControl("", { nonNullable: true }),
      degree: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      institution: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      location: new FormControl("", { nonNullable: true }),
      graduationDate: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      gpa: new FormControl("", { nonNullable: true }),
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
    });
    this.showForm.set(true);
  }

  editEducation(edu: Education) {
    this.editingId.set(edu.id);
    this.form.patchValue(edu);
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
      const education: Education = {
        ...formValue,
        id: this.editingId() || formValue.id || this.resumeService.generateId(),
      };

      if (this.editingId()) {
        this.resumeService.updateEducation(this.editingId()!, education);
      } else {
        this.resumeService.addEducation(education);
      }
      this.cancelEdit();
    } else {
      this.form.markAllAsTouched();
    }
  }

  removeEducation(id: string) {
    if (confirm("Are you sure you want to delete this education entry?")) {
      this.resumeService.removeEducation(id);
      if (this.editingId() === id) {
        this.cancelEdit();
      }
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }
}
