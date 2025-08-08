import { Component, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ResumeService } from "../services/resume.service";
import { PersonalInfo } from "../interfaces/resume.interface";

@Component({
  selector: "app-personal-info-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">
        Personal Information
      </h2>

      <form (ngSubmit)="updatePersonalInfo()" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Full Name *</label
            >
            <input
              type="text"
              [(ngModel)]="personalInfo().fullName"
              name="fullName"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Email *</label
            >
            <input
              type="email"
              [(ngModel)]="personalInfo().email"
              name="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Phone *</label
            >
            <input
              type="tel"
              [(ngModel)]="personalInfo().phone"
              name="phone"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Location *</label
            >
            <input
              type="text"
              [(ngModel)]="personalInfo().location"
              name="location"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="New York, NY"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Website</label
            >
            <input
              type="url"
              [(ngModel)]="personalInfo().website"
              name="website"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://johndoe.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >LinkedIn</label
            >
            <input
              type="url"
              [(ngModel)]="personalInfo().linkedin"
              name="linkedin"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Professional Summary</label
          >
          <textarea
            [(ngModel)]="personalInfo().summary"
            name="summary"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief overview of your professional background and key achievements..."
          ></textarea>
        </div>

        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Update Information
        </button>
      </form>
    </div>
  `,
})
export class PersonalInfoFormComponent implements OnInit {
  personalInfo = signal<PersonalInfo>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  });

  constructor(private resumeService: ResumeService) {}

  ngOnInit() {
    // Initialize with current resume data
    this.personalInfo.set(this.resumeService.resume().personalInfo);
  }

  updatePersonalInfo() {
    this.resumeService.updatePersonalInfo(this.personalInfo());
  }
}
