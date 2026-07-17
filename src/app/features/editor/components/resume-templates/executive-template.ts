import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Cv } from "../../../../domain/models/cv-model";
import { renderRichText } from "../../../../shared/utils/markdown";

@Component({
  selector: "app-executive-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="max-w-4xl mx-auto"
      class="resume-content"
      [style.background-color]="backgroundColor()"
      [style.font-family]="fontFamily()"
    >
      <!-- Header — bold dark block -->
      <div class="text-white p-8" [style.background-color]="headerBg">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-5">
            @if (cv().sections.personal.avatarUrl) {
              <img
                [src]="cv().sections.personal.avatarUrl"
                alt="Profile photo"
                class="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-lg shrink-0"
              />
            }
            <div>
              <h1 class="text-3xl font-extrabold tracking-tight mb-1">
                {{ cv().sections.personal.fullName || "Your Name" }}
              </h1>
              @if (cv().sections.personal.summary) {
                <p
                  class="text-white/60 text-sm italic max-w-md leading-relaxed mt-2"
                >
                  {{ cv().sections.personal.summary }}
                </p>
              }
            </div>
          </div>
          <div class="text-right text-xs space-y-1 text-white/60 shrink-0 ml-6">
            @if (cv().sections.personal.email) {
              <p>{{ cv().sections.personal.email }}</p>
            }
            @if (cv().sections.personal.phone) {
              <p>{{ cv().sections.personal.phone }}</p>
            }
            @if (cv().sections.personal.location) {
              <p>{{ cv().sections.personal.location }}</p>
            }
            @if (cv().sections.personal.website) {
              <p>{{ cv().sections.personal.website }}</p>
            }
            @if (cv().sections.personal.linkedin) {
              <p>{{ cv().sections.personal.linkedin }}</p>
            }
          </div>
        </div>
      </div>

      <div class="p-8 space-y-8">
        <!-- Experience -->
        @if (cv().sections.experience.length > 0) {
          <section>
            <h2
              class="text-base font-extrabold text-gray-900 mb-5 pb-2 uppercase tracking-wide"
              [style.border-bottom]="'3px solid ' + accentColor()"
            >
              Professional Experience
            </h2>
            @for (exp of cv().sections.experience; track exp.id) {
              <div class="mb-6">
                <div class="bg-white p-4 rounded-md mb-2">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-sm font-bold text-gray-900 uppercase">
                        {{ exp.jobTitle }}
                      </h3>
                      <p class="text-sm text-gray-500 font-semibold">
                        {{ exp.company }}
                      </p>
                    </div>
                    <div class="text-right shrink-0 ml-4">
                      <p class="text-xs font-bold text-gray-900">
                        {{ formatDate(exp.startDate) }} –
                        {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                      </p>
                      @if (exp.location) {
                        <p class="text-xs text-gray-500">{{ exp.location }}</p>
                      }
                    </div>
                  </div>
                </div>
                @if (exp.description) {
                  <div
                    class="text-gray-500 text-sm leading-relaxed pl-4"
                    [innerHTML]="renderRichText(exp.description)"
                  ></div>
                }
              </div>
            }
          </section>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Education -->
          @if (cv().sections.education.length > 0) {
            <section>
              <h2
                class="text-sm font-extrabold text-gray-900 mb-4 pb-2 uppercase tracking-wide"
                [style.border-bottom]="'2px solid ' + accentColor()"
              >
                Education
              </h2>
              @for (edu of cv().sections.education; track edu.id) {
                <div class="mb-3 bg-white p-3 rounded-md">
                  <h3 class="font-bold text-gray-900 text-xs uppercase">
                    {{ edu.degree }}
                  </h3>
                  <p class="text-gray-500 text-xs font-semibold">
                    {{ edu.institution }}
                  </p>
                  <div
                    class="flex justify-between text-[10px] text-gray-500 mt-1"
                  >
                    <span>{{ formatDate(edu.graduationDate) }}</span>
                    @if (edu.gpa) {
                      <span>GPA: {{ edu.gpa }}</span>
                    }
                  </div>
                  @if (edu.location) {
                    <p class="text-[10px] text-gray-500">{{ edu.location }}</p>
                  }
                </div>
              }
            </section>
          }

          <!-- Skills -->
          @if (cv().sections.skills.length > 0) {
            <section>
              <h2
                class="text-sm font-extrabold text-gray-900 mb-4 pb-2 uppercase tracking-wide"
                [style.border-bottom]="'2px solid ' + accentColor()"
              >
                Core Competencies
              </h2>
              <div class="space-y-2">
                @for (skill of cv().sections.skills; track skill.id) {
                  <div
                    class="text-white px-3 py-2 rounded-md flex justify-between items-center"
                    [style.background-color]="accentColor()"
                  >
                    <span class="font-semibold text-xs">{{ skill.name }}</span>
                    <span
                      class="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold"
                      [style.color]="accentColor()"
                      >{{ skill.level }}</span
                    >
                  </div>
                }
              </div>
            </section>
          }
        </div>

        <!-- Projects -->
        @if (cv().sections.projects.length > 0) {
          <section>
            <h2
              class="text-base font-extrabold text-gray-900 mb-5 pb-2 uppercase tracking-wide"
              [style.border-bottom]="'3px solid ' + accentColor()"
            >
              Key Projects
            </h2>
            @for (proj of cv().sections.projects; track proj.id) {
              <div class="mb-4">
                <div class="bg-white p-4 rounded-md">
                  <div class="flex justify-between items-start">
                    <h3 class="text-sm font-bold text-gray-900 uppercase">
                      {{ proj.name }}
                    </h3>
                    @if (proj.url) {
                      <span class="text-xs text-gray-500 shrink-0 ml-4">{{
                        proj.url
                      }}</span>
                    }
                  </div>
                  @if (proj.technologies) {
                    <p class="text-xs text-gray-500 font-semibold mt-0.5">
                      {{ proj.technologies }}
                    </p>
                  }
                  @if (proj.description) {
                    <div
                      class="text-gray-500 text-sm leading-relaxed mt-1"
                      [innerHTML]="renderRichText(proj.description)"
                    ></div>
                  }
                </div>
              </div>
            }
          </section>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Certifications -->
          @if (cv().sections.certifications.length > 0) {
            <section>
              <h2
                class="text-sm font-extrabold text-gray-900 mb-4 pb-2 uppercase tracking-wide"
                [style.border-bottom]="'2px solid ' + accentColor()"
              >
                Certifications
              </h2>
              @for (cert of cv().sections.certifications; track cert.id) {
                <div class="mb-3 bg-white p-3 rounded-md">
                  <h3 class="font-bold text-gray-900 text-xs uppercase">
                    {{ cert.name }}
                  </h3>
                  @if (cert.issuer) {
                    <p class="text-gray-500 text-xs font-semibold">
                      {{ cert.issuer }}
                    </p>
                  }
                  @if (cert.date) {
                    <p class="text-[10px] text-gray-500 mt-1">
                      {{ formatDate(cert.date) }}
                    </p>
                  }
                </div>
              }
            </section>
          }

          <!-- Languages -->
          @if (cv().sections.languages.length > 0) {
            <section>
              <h2
                class="text-sm font-extrabold text-gray-900 mb-4 pb-2 uppercase tracking-wide"
                [style.border-bottom]="'2px solid ' + accentColor()"
              >
                Languages
              </h2>
              <div class="space-y-2">
                @for (lang of cv().sections.languages; track lang.id) {
                  <div
                    class="text-white px-3 py-2 rounded-md flex justify-between items-center"
                    [style.background-color]="accentColor()"
                  >
                    <span class="font-semibold text-xs">{{ lang.name }}</span>
                    <span
                      class="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold"
                      [style.color]="accentColor()"
                      >{{ lang.proficiency }}</span
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
export class ExecutiveTemplate {
  readonly cv = input.required<Cv>();
  readonly accentColor = input("#111827");
  readonly backgroundColor = input("#ffffff");
  readonly primaryColor = input("#111827");
  readonly fontFamily = input("Inter, system-ui, sans-serif");

  protected get headerBg(): string {
    return this.accentColor();
  }

  protected renderRichText = renderRichText;

  protected formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }
}
