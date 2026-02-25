import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { Cv } from "../../../../domain/models/cv.model";

@Component({
  selector: "app-creative-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="max-w-4xl mx-auto"
      id="resume-content"
      [style.background-color]="backgroundColor"
      [style.font-family]="'Inter, system-ui, sans-serif'"
    >
      <div class="flex min-h-[600px]">
        <!-- Sidebar — dark with accent color accents -->
        <div class="w-[38%] bg-gray-900 text-white p-6 space-y-6">
          @if (cv.sections.personal.avatarUrl) {
            <div class="flex justify-center mb-2">
              <img
                [src]="cv.sections.personal.avatarUrl"
                alt="Profile photo"
                class="w-20 h-20 rounded-full object-cover shadow-lg"
                [style.border]="'2px solid ' + accentColor"
              />
            </div>
          }
          <div>
            <h1 class="text-xl font-bold leading-tight mb-3">
              {{ cv.sections.personal.fullName || "Your Name" }}
            </h1>
            <div class="space-y-1.5 text-xs text-gray-300">
              @if (cv.sections.personal.email) {
                <p class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                    [style.background-color]="accentColor + '33'"
                    [style.color]="accentColor"
                    >&#64;</span
                  >
                  {{ cv.sections.personal.email }}
                </p>
              }
              @if (cv.sections.personal.phone) {
                <p class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                    [style.background-color]="accentColor + '33'"
                    [style.color]="accentColor"
                    >#</span
                  >
                  {{ cv.sections.personal.phone }}
                </p>
              }
              @if (cv.sections.personal.location) {
                <p class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                    [style.background-color]="accentColor + '33'"
                    [style.color]="accentColor"
                    >⌂</span
                  >
                  {{ cv.sections.personal.location }}
                </p>
              }
              @if (cv.sections.personal.website) {
                <p class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                    [style.background-color]="accentColor + '33'"
                    [style.color]="accentColor"
                    >◉</span
                  >
                  {{ cv.sections.personal.website }}
                </p>
              }
              @if (cv.sections.personal.linkedin) {
                <p class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                    [style.background-color]="accentColor + '33'"
                    [style.color]="accentColor"
                    >in</span
                  >
                  {{ cv.sections.personal.linkedin }}
                </p>
              }
            </div>
          </div>

          @if (cv.sections.skills.length > 0) {
            <div>
              <h2
                class="text-xs font-bold uppercase tracking-wider mb-3"
                [style.color]="accentColor"
              >
                Skills
              </h2>
              @for (skill of cv.sections.skills; track skill.id) {
                <div class="mb-2.5">
                  <div class="flex justify-between mb-1">
                    <span class="text-xs text-gray-200">{{ skill.name }}</span>
                    <span class="text-[10px] text-gray-400">{{
                      skill.level
                    }}</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full transition-all"
                      [style.width]="getSkillWidth(skill.level)"
                      [style.background-color]="accentColor"
                    ></div>
                  </div>
                </div>
              }
            </div>
          }

          @if (cv.sections.education.length > 0) {
            <div>
              <h2
                class="text-xs font-bold uppercase tracking-wider mb-3"
                [style.color]="accentColor"
              >
                Education
              </h2>
              @for (edu of cv.sections.education; track edu.id) {
                <div class="mb-3">
                  <h3 class="font-semibold text-xs text-white">
                    {{ edu.degree }}
                  </h3>
                  <p class="text-gray-400 text-[11px]">{{ edu.institution }}</p>
                  <p class="text-gray-500 text-[10px]">
                    {{ formatDate(edu.graduationDate) }}
                  </p>
                  @if (edu.gpa) {
                    <p class="text-[10px]" [style.color]="accentColor + 'b3'">
                      GPA: {{ edu.gpa }}
                    </p>
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Main Content -->
        <div class="w-[62%] p-6 space-y-6">
          @if (cv.sections.personal.summary) {
            <section>
              <h2 class="text-sm font-bold text-gray-800 mb-2 relative pl-4">
                <span
                  class="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                  [style.background-color]="accentColor"
                ></span>
                About Me
              </h2>
              <p class="text-gray-600 leading-relaxed text-xs">
                {{ cv.sections.personal.summary }}
              </p>
            </section>
          }

          @if (cv.sections.experience.length > 0) {
            <section>
              <h2 class="text-sm font-bold text-gray-800 mb-4 relative pl-4">
                <span
                  class="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                  [style.background-color]="accentColor"
                ></span>
                Experience
              </h2>
              @for (
                exp of cv.sections.experience;
                track exp.id;
                let last = $last
              ) {
                <div class="mb-4 relative pl-5" [class.pb-4]="!last">
                  <!-- Timeline -->
                  <div
                    class="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                    [style.background-color]="accentColor"
                  ></div>
                  @if (!last) {
                    <div
                      class="absolute left-[4px] top-4 w-0.5 h-full bg-gray-200"
                    ></div>
                  }

                  <div class="flex justify-between items-start mb-1">
                    <div>
                      <h3 class="text-sm font-semibold text-gray-800">
                        {{ exp.jobTitle }}
                      </h3>
                      <p class="text-xs text-gray-500 font-medium">
                        {{ exp.company }}
                      </p>
                    </div>
                    <div
                      class="text-right text-[10px] text-gray-400 shrink-0 ml-3"
                    >
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
                    <p class="text-gray-500 text-xs leading-relaxed mt-1">
                      {{ exp.description }}
                    </p>
                  }
                </div>
              }
            </section>
          }
        </div>
      </div>
    </div>
  `,
})
export class CreativeTemplateComponent {
  @Input() cv!: Cv;
  @Input() accentColor = "#f59e0b";
  @Input() backgroundColor = "#ffffff";
  @Input() primaryColor = "#111827";

  formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }

  getSkillWidth(level: string): string {
    const widths: Record<string, string> = {
      Beginner: "25%",
      Intermediate: "50%",
      Advanced: "75%",
      Expert: "100%",
    };
    return widths[level] || "50%";
  }
}
