import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { Cv, CustomSection } from "../../../../domain/models/cv-model";
import { getOrderedSections } from "../../../../domain/models/section-helpers";
import { renderRichText } from "../../../../shared/utils/markdown";

@Component({
  selector: "app-creative-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="max-w-4xl mx-auto"
      class="resume-content"
      [style.background-color]="backgroundColor()"
      [style.font-family]="fontFamily()"
    >
      <div class="flex min-h-[600px]">
        <!-- Sidebar — dark with accent color accents -->
        <div class="w-[38%] bg-gray-900 text-white p-6 space-y-6">
          @if (cv().sections.personal.avatarUrl) {
            <div class="flex justify-center mb-2">
              <img
                [src]="cv().sections.personal.avatarUrl"
                alt="Profile photo"
                class="w-20 h-20 rounded-full object-cover shadow-lg"
                [style.border]="'2px solid ' + accentColor()"
              />
            </div>
          }
          <div>
            <h1 class="text-xl font-bold leading-tight mb-3">
              {{ cv().sections.personal.fullName || "Your Name" }}
            </h1>
            <div class="space-y-1.5 text-xs text-gray-300">
              @if (cv().sections.personal.email) {
                <p class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                    [style.background-color]="accentColor() + '33'"
                    [style.color]="accentColor()"
                    >&#64;</span
                  >
                  {{ cv().sections.personal.email }}
                </p>
              }
              @if (cv().sections.personal.phone) {
                <p class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                    [style.background-color]="accentColor() + '33'"
                    [style.color]="accentColor()"
                    >#</span
                  >
                  {{ cv().sections.personal.phone }}
                </p>
              }
              @if (cv().sections.personal.location) {
                <p class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                    [style.background-color]="accentColor() + '33'"
                    [style.color]="accentColor()"
                    >⌂</span
                  >
                  {{ cv().sections.personal.location }}
                </p>
              }
              @if (cv().sections.personal.website) {
                <p class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                    [style.background-color]="accentColor() + '33'"
                    [style.color]="accentColor()"
                    >◉</span
                  >
                  {{ cv().sections.personal.website }}
                </p>
              }
              @if (cv().sections.personal.linkedin) {
                <p class="flex items-center gap-2">
                  <span
                    class="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                    [style.background-color]="accentColor() + '33'"
                    [style.color]="accentColor()"
                    >in</span
                  >
                  {{ cv().sections.personal.linkedin }}
                </p>
              }
            </div>
          </div>

          @for (sectionId of sidebarSections(); track sectionId) {
            @switch (sectionId) {
              @case ("skills") {
                @if (cv().sections.skills.length > 0) {
                  <div>
                    <h2
                      class="text-xs font-bold uppercase tracking-wider mb-3"
                      [style.color]="accentColor()"
                    >
                      Skills
                    </h2>
                    @for (skill of cv().sections.skills; track skill.id) {
                      <div class="mb-2.5">
                        <div class="flex justify-between mb-1">
                          <span class="text-xs text-gray-200">{{ skill.name }}</span>
                          <span class="text-[10px] text-gray-500">{{
                            skill.level
                          }}</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            class="h-1.5 rounded-full transition-all"
                            [style.width]="getSkillWidth(skill.level)"
                            [style.background-color]="accentColor()"
                          ></div>
                        </div>
                      </div>
                    }
                  </div>
                }
              }
              @case ("education") {
                @if (cv().sections.education.length > 0) {
                  <div>
                    <h2
                      class="text-xs font-bold uppercase tracking-wider mb-3"
                      [style.color]="accentColor()"
                    >
                      Education
                    </h2>
                    @for (edu of cv().sections.education; track edu.id) {
                      <div class="mb-3">
                        <h3 class="font-semibold text-xs text-white">
                          {{ edu.degree }}
                        </h3>
                        <p class="text-gray-500 text-[11px]">{{ edu.institution }}</p>
                        <p class="text-gray-500 text-[10px]">
                          {{ formatDate(edu.graduationDate) }}
                        </p>
                        @if (edu.gpa) {
                          <p class="text-[10px]" [style.color]="accentColor() + 'b3'">
                            GPA: {{ edu.gpa }}
                          </p>
                        }
                      </div>
                    }
                  </div>
                }
              }
              @case ("languages") {
                @if (cv().sections.languages.length > 0) {
                  <div>
                    <h2
                      class="text-xs font-bold uppercase tracking-wider mb-3"
                      [style.color]="accentColor()"
                    >
                      Languages
                    </h2>
                    @for (lang of cv().sections.languages; track lang.id) {
                      <div class="mb-2 flex justify-between items-baseline">
                        <span class="text-xs text-gray-200">{{ lang.name }}</span>
                        <span class="text-[10px] text-gray-500">{{
                          lang.proficiency
                        }}</span>
                      </div>
                    }
                  </div>
                }
              }
            }
          }
        </div>

        <!-- Main Content -->
        <div class="w-[62%] p-6 space-y-6">
          @if (cv().sections.personal.summary) {
            <section>
              <h2 class="text-sm font-bold text-gray-900 mb-2 relative pl-4">
                <span
                  class="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                  [style.background-color]="accentColor()"
                ></span>
                About Me
              </h2>
              <p class="text-gray-500 leading-relaxed text-xs">
                {{ cv().sections.personal.summary }}
              </p>
            </section>
          }

          @for (sectionId of mainSections(); track sectionId) {
            @switch (sectionId) {
              @case ("experience") {
                @if (cv().sections.experience.length > 0) {
                  <section>
                    <h2 class="text-sm font-bold text-gray-900 mb-4 relative pl-4">
                      <span
                        class="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                        [style.background-color]="accentColor()"
                      ></span>
                      Experience
                    </h2>
                    @for (
                      exp of cv().sections.experience;
                      track exp.id;
                      let last = $last
                    ) {
                      <div class="mb-4 relative pl-5" [class.pb-4]="!last">
                        <!-- Timeline -->
                        <div
                          class="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                          [style.background-color]="accentColor()"
                        ></div>
                        @if (!last) {
                          <div
                            class="absolute left-[4px] top-4 w-0.5 h-full bg-gray-200"
                          ></div>
                        }

                        <div class="flex justify-between items-start mb-1">
                          <div>
                            <h3 class="text-sm font-semibold text-gray-900">
                              {{ exp.jobTitle }}
                            </h3>
                            <p class="text-xs text-gray-500 font-medium">
                              {{ exp.company }}
                            </p>
                          </div>
                          <div
                            class="text-right text-[10px] text-gray-500 shrink-0 ml-3"
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
                          <div
                            class="text-gray-500 text-xs leading-relaxed mt-1"
                            [innerHTML]="renderRichText(exp.description)"
                          ></div>
                        }
                      </div>
                    }
                  </section>
                }
              }
              @case ("projects") {
                @if (cv().sections.projects.length > 0) {
                  <section>
                    <h2 class="text-sm font-bold text-gray-900 mb-4 relative pl-4">
                      <span
                        class="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                        [style.background-color]="accentColor()"
                      ></span>
                      Projects
                    </h2>
                    @for (proj of cv().sections.projects; track proj.id) {
                      <div class="mb-4 pl-5">
                        <div class="flex justify-between items-start">
                          <h3 class="text-sm font-semibold text-gray-900">
                            {{ proj.name }}
                          </h3>
                          @if (proj.url) {
                            <span class="text-[10px] text-gray-500 shrink-0 ml-3">{{
                              proj.url
                            }}</span>
                          }
                        </div>
                        @if (proj.technologies) {
                          <p
                            class="text-[11px] font-medium"
                            [style.color]="accentColor()"
                          >
                            {{ proj.technologies }}
                          </p>
                        }
                        @if (proj.description) {
                          <div
                            class="text-gray-500 text-xs leading-relaxed mt-1"
                            [innerHTML]="renderRichText(proj.description)"
                          ></div>
                        }
                      </div>
                    }
                  </section>
                }
              }
              @case ("certifications") {
                @if (cv().sections.certifications.length > 0) {
                  <section>
                    <h2 class="text-sm font-bold text-gray-900 mb-4 relative pl-4">
                      <span
                        class="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                        [style.background-color]="accentColor()"
                      ></span>
                      Certifications
                    </h2>
                    @for (cert of cv().sections.certifications; track cert.id) {
                      <div class="mb-2 pl-5 flex justify-between items-baseline">
                        <div>
                          <h3 class="text-xs font-semibold text-gray-900">
                            {{ cert.name }}
                          </h3>
                          @if (cert.issuer) {
                            <p class="text-[11px] text-gray-500">{{ cert.issuer }}</p>
                          }
                        </div>
                        @if (cert.date) {
                          <span class="text-[10px] text-gray-500 shrink-0 ml-3">{{
                            formatDate(cert.date)
                          }}</span>
                        }
                      </div>
                    }
                  </section>
                }
              }
              @default {
                @if (getCustomSection(sectionId); as custom) {
                  <section>
                    <h2 class="text-sm font-bold text-gray-900 mb-4 relative pl-4">
                      <span
                        class="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                        [style.background-color]="accentColor()"
                      ></span>
                      {{ custom.title }}
                    </h2>
                    @for (item of custom.items; track item.id) {
                      <div class="mb-4 pl-5">
                        <div class="flex justify-between items-start">
                          <h3 class="text-sm font-semibold text-gray-900">
                            {{ item.title }}
                          </h3>
                        </div>
                        @if (item.subtitle) {
                          <p
                            class="text-[11px] font-medium"
                            [style.color]="accentColor()"
                          >
                            {{ item.subtitle }}
                          </p>
                        }
                        @if (item.description) {
                          <div
                            class="text-gray-500 text-xs leading-relaxed mt-1"
                            [innerHTML]="renderRichText(item.description)"
                          ></div>
                        }
                      </div>
                    }
                  </section>
                }
              }
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class CreativeTemplate {
  readonly cv = input.required<Cv>();
  readonly accentColor = input("#f59e0b");
  readonly backgroundColor = input("#ffffff");
  readonly primaryColor = input("#111827");
  readonly fontFamily = input("Inter, system-ui, sans-serif");

  protected readonly orderedSections = computed(() => getOrderedSections(this.cv()));
  protected readonly sidebarSections = computed(() =>
    this.orderedSections().filter((id) => ["skills", "education", "languages"].includes(id)),
  );
  protected readonly mainSections = computed(() =>
    this.orderedSections().filter((id) => !["skills", "education", "languages"].includes(id)),
  );
  protected getCustomSection(id: string): CustomSection | undefined {
    return this.cv().sections.customSections.find((s) => s.id === id);
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

  protected getSkillWidth(level: string): string {
    const widths: Record<string, string> = {
      Beginner: "25%",
      Intermediate: "50%",
      Advanced: "75%",
      Expert: "100%",
    };
    return widths[level] || "50%";
  }
}
