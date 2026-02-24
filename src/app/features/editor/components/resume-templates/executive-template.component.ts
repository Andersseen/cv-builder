import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Cv } from "../../../../domain/models/cv.model";

@Component({
  selector: "app-executive-template",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto bg-white shadow-lg" id="resume-content">
      <!-- Header -->
      <div class="bg-gray-900 text-white p-8">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold mb-2">
              {{ cv.sections.personal.fullName || "Your Name" }}
            </h1>
            @if (cv.sections.personal.summary) {
              <p class="text-gray-300 text-lg italic">
                {{ cv.sections.personal.summary }}
              </p>
            }
          </div>
          <div class="text-right text-sm space-y-1">
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
      </div>

      <div class="p-8">
        <!-- Experience -->
        @if (cv.sections.experience.length > 0) {
          <section class="mb-8">
            <h2
              class="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-gray-900"
            >
              Professional Experience
            </h2>
            @for (exp of cv.sections.experience; track exp.id) {
              <div class="mb-8">
                <div class="bg-gray-50 p-4 rounded-lg mb-3">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h3 class="text-xl font-bold text-gray-900">
                        {{ exp.jobTitle }}
                      </h3>
                      <p class="text-lg text-gray-700 font-semibold">
                        {{ exp.company }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900">
                        {{ formatDate(exp.startDate) }} -
                        {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                      </p>
                      @if (exp.location) {
                        <p class="text-gray-600">{{ exp.location }}</p>
                      }
                    </div>
                  </div>
                </div>
                @if (exp.description) {
                  <p class="text-gray-700 leading-relaxed ml-4">
                    {{ exp.description }}
                  </p>
                }
              </div>
            }
          </section>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Education -->
          @if (cv.sections.education.length > 0) {
            <section>
              <h2
                class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-900"
              >
                Education
              </h2>
              @for (edu of cv.sections.education; track edu.id) {
                <div class="mb-4 bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-bold text-gray-900">{{ edu.degree }}</h3>
                  <p class="text-gray-700 font-semibold">
                    {{ edu.institution }}
                  </p>
                  <div class="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{{ formatDate(edu.graduationDate) }}</span>
                    @if (edu.gpa) {
                      <span>GPA: {{ edu.gpa }}</span>
                    }
                  </div>
                  @if (edu.location) {
                    <p class="text-sm text-gray-600">{{ edu.location }}</p>
                  }
                </div>
              }
            </section>
          }

          <!-- Skills -->
          @if (cv.sections.skills.length > 0) {
            <section>
              <h2
                class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-900"
              >
                Core Competencies
              </h2>
              <div class="space-y-2">
                @for (skill of cv.sections.skills; track skill.id) {
                  <div
                    class="bg-gray-900 text-white px-4 py-2 rounded-lg flex justify-between items-center"
                  >
                    <span class="font-semibold">{{ skill.name }}</span>
                    <span
                      class="text-xs bg-white text-gray-900 px-2 py-1 rounded"
                      >{{ skill.level }}</span
                    >
                  </div>
                }
              </div>
            </section>
          }
        </div>
      </div>
    </div>
  `,
})
export class ExecutiveTemplateComponent {
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
