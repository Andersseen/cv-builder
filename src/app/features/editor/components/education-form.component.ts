import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Education } from "../interfaces/resume.interface";
import { ResumeService } from "../services/resume.service";

@Component({
  selector: "app-education-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Education</h2>
        <button
          (click)="toggleAddForm()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {{ showAddForm() ? "Cancel" : "Add Education" }}
        </button>
      </div>

      <!-- Add Education Form -->
      @if (showAddForm()) {
      <form
        (ngSubmit)="addEducation()"
        class="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Degree *</label
            >
            <input
              type="text"
              [(ngModel)]="newEducation().degree"
              name="degree"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Bachelor of Science in Computer Science"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Institution *</label
            >
            <input
              type="text"
              [(ngModel)]="newEducation().institution"
              name="institution"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="University of Technology"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Location</label
            >
            <input
              type="text"
              [(ngModel)]="newEducation().location"
              name="location"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Boston, MA"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Graduation Date *</label
            >
            <input
              type="month"
              [(ngModel)]="newEducation().graduationDate"
              name="graduationDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >GPA (Optional)</label
            >
            <input
              type="text"
              [(ngModel)]="newEducation().gpa"
              name="gpa"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3.8/4.0"
            />
          </div>
        </div>

        <button
          type="submit"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          Add Education
        </button>
      </form>
      }

      <!-- Education List -->
      <div class="space-y-4">
        @for (edu of resumeService.resume().education; track edu.id) {
        <div class="p-4 border border-gray-200 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-semibold text-gray-800">{{ edu.degree }}</h3>
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
            <button
              (click)="removeEducation(edu.id)"
              class="text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              Remove
            </button>
          </div>
        </div>
        } @if (resumeService.resume().education.length === 0) {
        <p class="text-gray-500 text-center py-8">No education added yet.</p>
        }
      </div>
    </div>
  `,
})
export class EducationFormComponent {
  showAddForm = signal(false);
  newEducation = signal<Education>({
    id: "",
    degree: "",
    institution: "",
    location: "",
    graduationDate: "",
    gpa: "",
  });

  constructor(public resumeService: ResumeService) {}

  toggleAddForm() {
    this.showAddForm.update((show) => !show);
    if (!this.showAddForm()) {
      this.resetForm();
    }
  }

  addEducation() {
    const education = {
      ...this.newEducation(),
      id: this.resumeService.generateId(),
    };
    this.resumeService.addEducation(education);
    this.resetForm();
    this.showAddForm.set(false);
  }

  removeEducation(id: string) {
    this.resumeService.removeEducation(id);
  }

  resetForm() {
    this.newEducation.set({
      id: "",
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }
}
