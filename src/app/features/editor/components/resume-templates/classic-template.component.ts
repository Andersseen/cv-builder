import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Cv } from "../../../../domain/models/cv.model";

@Component({
  selector: "app-classic-template",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto bg-white shadow-lg" id="resume-content">
      <div class="p-8">
        <!-- Header -->
        <div class="text-center mb-8 border-b-2 border-gray-300 pb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            {{ cv.sections.personal.fullName || "Your Name" }}
          </h1>
          <div
            class="flex flex-wrap justify-center gap-4 text-sm text-gray-600"
          >
            @if (cv.sections.personal.email) {
              <span>{{ cv.sections.personal.email }}</span>
            }
            @if (cv.sections.personal.phone) {
              <span>{{ cv.sections.personal.phone }}</span>
            }
            @if (cv.sections.personal.location) {
              <span>{{ cv.sections.personal.location }}</span>
            }
            @if (cv.sections.personal.website) {
              <span>{{ cv.sections.personal.website }}</span>
            }
            @if (cv.sections.personal.linkedin) {
              <span>{{ cv.sections.personal.linkedin }}</span>
            }
          </div>
        </div>

        <!-- Summary -->
        @if (cv.sections.personal.summary) {
          <section class="mb-8">
            <h2
              class="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide"
            >
              Summary
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ cv.sections.personal.summary }}
            </p>
          </section>
        }

        <!-- Experience -->
        @if (cv.sections.experience.length > 0) {
          <section class="mb-8">
            <h2
              class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide"
            >
              Professional Experience
            </h2>
            @for (exp of cv.sections.experience; track exp.id) {
              <div class="mb-6">
                <div class="flex justify-between items-baseline mb-1">
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ exp.jobTitle }}
                  </h3>
                  <span class="text-sm text-gray-600">
                    {{ formatDate(exp.startDate) }} -
                    {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                  </span>
                </div>
                <p class="text-gray-700 font-medium mb-1">
                  {{ exp.company }}
                  @if (exp.location) {
                    - {{ exp.location }}
                  }
                </p>
                @if (exp.description) {
                  <p class="text-gray-600 leading-relaxed">
                    {{ exp.description }}
                  </p>
                }
              </div>
            }
          </section>
        }

        <!-- Education -->
        @if (cv.sections.education.length > 0) {
          <section class="mb-8">
            <h2
              class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide"
            >
              Education
            </h2>
            @for (edu of cv.sections.education; track edu.id) {
              <div class="mb-4">
                <div class="flex justify-between items-baseline mb-1">
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ edu.degree }}
                  </h3>
                  <span class="text-sm text-gray-600">{{
                    formatDate(edu.graduationDate)
                  }}</span>
                </div>
                <p class="text-gray-700">
                  {{ edu.institution }}
                  @if (edu.location) {
                    - {{ edu.location }}
                  }
                </p>
                @if (edu.gpa) {
                  <p class="text-sm text-gray-600">GPA: {{ edu.gpa }}</p>
                }
              </div>
            }
          </section>
        }

        <!-- Skills -->
        @if (cv.sections.skills.length > 0) {
          <section>
            <h2
              class="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide"
            >
              Skills
            </h2>
            <div class="flex flex-wrap gap-2">
              @for (skill of cv.sections.skills; track skill.id) {
                <span
                  class="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                >
                  {{ skill.name }} ({{ skill.level }})
                </span>
              }
            </div>
          </section>
        }
      </div>
    </div>
  `,
})
export class ClassicTemplateComponent {
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
