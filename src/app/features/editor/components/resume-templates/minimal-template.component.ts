import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Cv } from "../../../../domain/models/cv.model";

@Component({
  selector: "app-minimal-template",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto bg-white shadow-lg" id="resume-content">
      <div class="p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-light text-gray-900 mb-4">
            {{ cv.sections.personal.fullName || "Your Name" }}
          </h1>
          <div class="space-y-1 text-sm text-gray-600">
            @if (cv.sections.personal.email) {
              <p>{{ cv.sections.personal.email }}</p>
            }
            @if (cv.sections.personal.phone) {
              <p>{{ cv.sections.personal.phone }}</p>
            }
            @if (cv.sections.personal.location) {
              <p>{{ cv.sections.personal.location }}</p>
            }
            @if (cv.sections.personal.website) {
              <p>{{ cv.sections.personal.website }}</p>
            }
            @if (cv.sections.personal.linkedin) {
              <p>{{ cv.sections.personal.linkedin }}</p>
            }
          </div>
        </div>

        @if (cv.sections.personal.summary) {
          <section class="mb-8">
            <p class="text-gray-700 leading-relaxed">
              {{ cv.sections.personal.summary }}
            </p>
          </section>
        }

        @if (cv.sections.experience.length > 0) {
          <section class="mb-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Experience</h2>
            @for (exp of cv.sections.experience; track exp.id) {
              <div class="mb-6">
                <div class="flex justify-between items-baseline mb-1">
                  <h3 class="font-medium text-gray-900">{{ exp.jobTitle }}</h3>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(exp.startDate) }} –
                    {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                  </span>
                </div>
                <p class="text-gray-600 mb-2">
                  {{ exp.company }}
                  @if (exp.location) {
                    • {{ exp.location }}
                  }
                </p>
                @if (exp.description) {
                  <p class="text-gray-700 text-sm leading-relaxed">
                    {{ exp.description }}
                  </p>
                }
              </div>
            }
          </section>
        }

        @if (cv.sections.education.length > 0) {
          <section class="mb-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Education</h2>
            @for (edu of cv.sections.education; track edu.id) {
              <div class="mb-4">
                <div class="flex justify-between items-baseline mb-1">
                  <h3 class="font-medium text-gray-900">{{ edu.degree }}</h3>
                  <span class="text-sm text-gray-500">{{
                    formatDate(edu.graduationDate)
                  }}</span>
                </div>
                <p class="text-gray-600">
                  {{ edu.institution }}
                  @if (edu.location) {
                    • {{ edu.location }}
                  }
                </p>
                @if (edu.gpa) {
                  <p class="text-sm text-gray-500">{{ edu.gpa }}</p>
                }
              </div>
            }
          </section>
        }

        @if (cv.sections.skills.length > 0) {
          <section>
            <h2 class="text-lg font-medium text-gray-900 mb-4">Skills</h2>
            <div class="space-y-2">
              @for (skill of cv.sections.skills; track skill.id) {
                <div class="flex justify-between">
                  <span class="text-gray-700">{{ skill.name }}</span>
                  <span class="text-gray-500 text-sm">{{ skill.level }}</span>
                </div>
              }
            </div>
          </section>
        }
      </div>
    </div>
  `,
})
export class MinimalTemplateComponent {
  @Input() cv!: Cv;

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
