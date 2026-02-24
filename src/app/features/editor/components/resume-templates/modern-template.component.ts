import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Cv } from "../../../../domain/models/cv.model";

@Component({
  selector: "app-modern-template",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto bg-white" id="resume-content">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 class="text-4xl font-bold mb-2">
          {{ cv.sections.personal.fullName || "Your Name" }}
        </h1>
        <div class="flex flex-wrap gap-4 text-sm">
          @if (cv.sections.personal.email) {
            <span>✉ {{ cv.sections.personal.email }}</span>
          }
          @if (cv.sections.personal.phone) {
            <span>📞 {{ cv.sections.personal.phone }}</span>
          }
          @if (cv.sections.personal.location) {
            <span>📍 {{ cv.sections.personal.location }}</span>
          }
          @if (cv.sections.personal.website) {
            <span>🌐 {{ cv.sections.personal.website }}</span>
          }
          @if (cv.sections.personal.linkedin) {
            <span>💼 {{ cv.sections.personal.linkedin }}</span>
          }
        </div>
      </div>

      <div class="p-8">
        <!-- Summary -->
        @if (cv.sections.personal.summary) {
          <section class="mb-8">
            <h2
              class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2"
            >
              Professional Summary
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
              class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2"
            >
              Experience
            </h2>
            @for (exp of cv.sections.experience; track exp.id) {
              <div class="mb-6">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800">
                      {{ exp.jobTitle }}
                    </h3>
                    <p class="text-blue-600 font-medium">{{ exp.company }}</p>
                  </div>
                  <div class="text-right text-sm text-gray-600">
                    <p>
                      {{ formatDate(exp.startDate) }} -
                      {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                    </p>
                    @if (exp.location) {
                      <p>{{ exp.location }}</p>
                    }
                  </div>
                </div>
                @if (exp.description) {
                  <p class="text-gray-700 leading-relaxed">
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
              class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2"
            >
              Education
            </h2>
            @for (edu of cv.sections.education; track edu.id) {
              <div class="mb-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">
                      {{ edu.degree }}
                    </h3>
                    <p class="text-blue-600">{{ edu.institution }}</p>
                    @if (edu.gpa) {
                      <p class="text-sm text-gray-600">GPA: {{ edu.gpa }}</p>
                    }
                  </div>
                  <div class="text-right text-sm text-gray-600">
                    <p>{{ formatDate(edu.graduationDate) }}</p>
                    @if (edu.location) {
                      <p>{{ edu.location }}</p>
                    }
                  </div>
                </div>
              </div>
            }
          </section>
        }

        <!-- Skills -->
        @if (cv.sections.skills.length > 0) {
          <section>
            <h2
              class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2"
            >
              Skills
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              @for (skill of cv.sections.skills; track skill.id) {
                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="font-medium text-gray-800">{{ skill.name }}</p>
                  <p class="text-sm text-blue-600">{{ skill.level }}</p>
                </div>
              }
            </div>
          </section>
        }
      </div>
    </div>
  `,
})
export class ModernTemplateComponent {
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
