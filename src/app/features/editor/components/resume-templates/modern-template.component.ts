import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Cv } from "../../../../domain/models/cv.model";

@Component({
  selector: "app-modern-template",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="max-w-4xl mx-auto bg-white"
      id="resume-content"
      style="font-family: 'Inter', system-ui, sans-serif;"
    >
      <!-- Header — bold gradient -->
      <div
        class="p-8"
        [style.background]="
          'linear-gradient(135deg, ' +
          accentColor +
          ' 0%, ' +
          accentColorDark +
          ' 100%)'
        "
      >
        <div class="flex items-center gap-5">
          @if (cv.sections.personal.avatarUrl) {
            <img
              [src]="cv.sections.personal.avatarUrl"
              alt="Profile photo"
              class="w-20 h-20 rounded-full object-cover border-3 border-white/30 shadow-lg shrink-0"
            />
          }
          <div>
            <h1 class="text-4xl font-bold text-white mb-2 tracking-tight">
              {{ cv.sections.personal.fullName || "Your Name" }}
            </h1>
          </div>
        </div>
        <div class="flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/70 mt-3">
          @if (cv.sections.personal.email) {
            <span class="flex items-center gap-1.5">
              <span class="w-1 h-1 rounded-full bg-white/40"></span>
              {{ cv.sections.personal.email }}
            </span>
          }
          @if (cv.sections.personal.phone) {
            <span class="flex items-center gap-1.5">
              <span class="w-1 h-1 rounded-full bg-white/40"></span>
              {{ cv.sections.personal.phone }}
            </span>
          }
          @if (cv.sections.personal.location) {
            <span class="flex items-center gap-1.5">
              <span class="w-1 h-1 rounded-full bg-white/40"></span>
              {{ cv.sections.personal.location }}
            </span>
          }
          @if (cv.sections.personal.website) {
            <span class="flex items-center gap-1.5">
              <span class="w-1 h-1 rounded-full bg-white/40"></span>
              {{ cv.sections.personal.website }}
            </span>
          }
          @if (cv.sections.personal.linkedin) {
            <span class="flex items-center gap-1.5">
              <span class="w-1 h-1 rounded-full bg-white/40"></span>
              {{ cv.sections.personal.linkedin }}
            </span>
          }
        </div>
      </div>

      <div class="p-8 space-y-8">
        <!-- Summary -->
        @if (cv.sections.personal.summary) {
          <section>
            <h2
              class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"
            >
              <span
                class="w-8 h-0.5 rounded-full"
                [style.background-color]="accentColor"
              ></span>
              Professional Summary
            </h2>
            <p class="text-gray-600 leading-relaxed text-sm">
              {{ cv.sections.personal.summary }}
            </p>
          </section>
        }

        <!-- Experience -->
        @if (cv.sections.experience.length > 0) {
          <section>
            <h2
              class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
            >
              <span
                class="w-8 h-0.5 rounded-full"
                [style.background-color]="accentColor"
              ></span>
              Experience
            </h2>
            @for (exp of cv.sections.experience; track exp.id) {
              <div
                class="mb-5 pl-4 border-l-2"
                [style.border-left-color]="accentColor + '33'"
              >
                <div class="flex justify-between items-start mb-1">
                  <div>
                    <h3 class="text-base font-semibold text-gray-900">
                      {{ exp.jobTitle }}
                    </h3>
                    <p class="font-medium text-sm" [style.color]="accentColor">
                      {{ exp.company }}
                    </p>
                  </div>
                  <div class="text-right text-xs text-gray-500 shrink-0 ml-4">
                    <p>
                      {{ formatDate(exp.startDate) }} –
                      {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                    </p>
                    @if (exp.location) {
                      <p>{{ exp.location }}</p>
                    }
                  </div>
                </div>
                @if (exp.description) {
                  <p class="text-gray-600 text-sm leading-relaxed mt-2">
                    {{ exp.description }}
                  </p>
                }
              </div>
            }
          </section>
        }

        <!-- Education -->
        @if (cv.sections.education.length > 0) {
          <section>
            <h2
              class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
            >
              <span
                class="w-8 h-0.5 rounded-full"
                [style.background-color]="accentColor"
              ></span>
              Education
            </h2>
            @for (edu of cv.sections.education; track edu.id) {
              <div class="mb-3 p-3 bg-gray-50 rounded-lg">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-gray-900 text-sm">
                      {{ edu.degree }}
                    </h3>
                    <p class="text-sm" [style.color]="accentColor">
                      {{ edu.institution }}
                    </p>
                    @if (edu.gpa) {
                      <p class="text-xs text-gray-500 mt-0.5">
                        GPA: {{ edu.gpa }}
                      </p>
                    }
                  </div>
                  <div class="text-right text-xs text-gray-500 shrink-0 ml-4">
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
              class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"
            >
              <span
                class="w-8 h-0.5 rounded-full"
                [style.background-color]="accentColor"
              ></span>
              Skills
            </h2>
            <div class="flex flex-wrap gap-2">
              @for (skill of cv.sections.skills; track skill.id) {
                <span
                  class="px-3 py-1.5 rounded-full text-xs font-medium border"
                  [style.background-color]="accentColor + '10'"
                  [style.color]="accentColor"
                  [style.border-color]="accentColor + '25'"
                >
                  {{ skill.name }}
                  <span [style.color]="accentColor + '80'" class="ml-1"
                    >· {{ skill.level }}</span
                  >
                </span>
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
  @Input() accentColor: string = "#4f46e5";

  get accentColorDark(): string {
    return this.adjustBrightness(this.accentColor, -30);
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

  private adjustBrightness(hex: string, amount: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  }
}
