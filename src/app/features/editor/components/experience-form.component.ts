import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Experience } from "../interfaces/resume.interface";
import { ResumeService } from "../services/resume.service";

@Component({
  selector: "app-experience-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Work Experience</h2>
        <button
          (click)="toggleAddForm()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {{ showAddForm() ? "Cancel" : "Add Experience" }}
        </button>
      </div>

      <!-- Add Experience Form -->
      @if (showAddForm()) {
      <form
        (ngSubmit)="addExperience()"
        class="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Job Title *</label
            >
            <input
              type="text"
              [(ngModel)]="newExperience().jobTitle"
              name="jobTitle"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Software Engineer"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Company *</label
            >
            <input
              type="text"
              [(ngModel)]="newExperience().company"
              name="company"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tech Corp"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Location</label
            >
            <input
              type="text"
              [(ngModel)]="newExperience().location"
              name="location"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="San Francisco, CA"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Start Date *</label
            >
            <input
              type="month"
              [(ngModel)]="newExperience().startDate"
              name="startDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          @if (!newExperience().current) {
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >End Date</label
            >
            <input
              type="month"
              [(ngModel)]="newExperience().endDate"
              name="endDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          }

          <div class="flex items-center">
            <input
              type="checkbox"
              [(ngModel)]="newExperience().current"
              name="current"
              id="current"
              class="mr-2"
              (change)="onCurrentJobChange()"
            />
            <label for="current" class="text-sm text-gray-700"
              >Currently working here</label
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Description</label
          >
          <textarea
            [(ngModel)]="newExperience().description"
            name="description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Key responsibilities and achievements..."
          ></textarea>
        </div>

        <button
          type="submit"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          Add Experience
        </button>
      </form>
      }

      <!-- Experience List -->
      <div class="space-y-4">
        @for (exp of resumeService.resume().experience; track exp.id) {
        <div class="p-4 border border-gray-200 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-semibold text-gray-800">{{ exp.jobTitle }}</h3>
              <p class="text-gray-600">
                {{ exp.company }} - {{ exp.location }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatDate(exp.startDate) }} -
                {{ exp.current ? "Present" : formatDate(exp.endDate) }}
              </p>
            </div>
            <button
              (click)="removeExperience(exp.id)"
              class="text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              Remove
            </button>
          </div>
          @if (exp.description) {
          <p class="text-gray-700 text-sm">{{ exp.description }}</p>
          }
        </div>
        } @if (resumeService.resume().experience.length === 0) {
        <p class="text-gray-500 text-center py-8">
          No work experience added yet.
        </p>
        }
      </div>
    </div>
  `,
})
export class ExperienceFormComponent {
  showAddForm = signal(false);
  newExperience = signal<Experience>({
    id: "",
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  constructor(public resumeService: ResumeService) {}

  toggleAddForm() {
    this.showAddForm.update((show) => !show);
    if (!this.showAddForm()) {
      this.resetForm();
    }
  }

  addExperience() {
    const experience = {
      ...this.newExperience(),
      id: this.resumeService.generateId(),
    };
    this.resumeService.addExperience(experience);
    this.resetForm();
    this.showAddForm.set(false);
  }

  removeExperience(id: string) {
    this.resumeService.removeExperience(id);
  }

  onCurrentJobChange() {
    if (this.newExperience().current) {
      this.newExperience.update((exp) => ({ ...exp, endDate: "" }));
    }
  }

  resetForm() {
    this.newExperience.set({
      id: "",
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
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
