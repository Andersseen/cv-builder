import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Cv } from "../../../../domain/models/cv-model";
import { renderRichText } from "../../../../shared/utils/markdown";

@Component({
  selector: "app-minimal-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="max-w-4xl mx-auto"
      id="resume-content"
      [style.background-color]="backgroundColor()"
      [style.font-family]="'Inter, system-ui, sans-serif'"
    >
      <div class="p-10">
        <!-- Header — ultra-minimal -->
        <div class="mb-10">
          <h1 class="text-2xl font-light text-gray-900 tracking-tight">
            {{ cv().sections.personal.fullName || "Your Name" }}
          </h1>
          <div class="flex flex-wrap gap-x-4 mt-2 text-xs text-gray-500">
            @if (cv().sections.personal.email) {
              <span>{{ cv().sections.personal.email }}</span>
            }
            @if (cv().sections.personal.phone) {
              <span>{{ cv().sections.personal.phone }}</span>
            }
            @if (cv().sections.personal.location) {
              <span>{{ cv().sections.personal.location }}</span>
            }
            @if (cv().sections.personal.website) {
              <span>{{ cv().sections.personal.website }}</span>
            }
            @if (cv().sections.personal.linkedin) {
              <span>{{ cv().sections.personal.linkedin }}</span>
            }
          </div>
        </div>

        @if (cv().sections.personal.summary) {
          <section class="mb-10">
            <p class="text-gray-500 leading-relaxed text-sm max-w-2xl">
              {{ cv().sections.personal.summary }}
            </p>
          </section>
        }

        @if (cv().sections.experience.length > 0) {
          <section class="mb-10">
            <h2
              class="text-xs font-medium uppercase tracking-[0.15em] mb-5"
              [style.color]="accentColor()"
            >
              Experience
            </h2>
            @for (exp of cv().sections.experience; track exp.id) {
              <div class="mb-6">
                <div class="flex justify-between items-baseline mb-0.5">
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ exp.jobTitle }}
                  </h3>
                  <span class="text-xs text-gray-500 shrink-0 ml-4">
                    {{ formatDate(exp.startDate) }} –
                    {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mb-1.5">
                  {{ exp.company }}
                  @if (exp.location) {
                    · {{ exp.location }}
                  }
                </p>
                @if (exp.description) {
                  <div
                    class="text-gray-500 text-xs leading-relaxed"
                    [innerHTML]="renderRichText(exp.description)"
                  ></div>
                }
              </div>
            }
          </section>
        }

        @if (cv().sections.education.length > 0) {
          <section class="mb-10">
            <h2
              class="text-xs font-medium uppercase tracking-[0.15em] mb-5"
              [style.color]="accentColor()"
            >
              Education
            </h2>
            @for (edu of cv().sections.education; track edu.id) {
              <div class="mb-4">
                <div class="flex justify-between items-baseline mb-0.5">
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ edu.degree }}
                  </h3>
                  <span class="text-xs text-gray-500 shrink-0 ml-4">{{
                    formatDate(edu.graduationDate)
                  }}</span>
                </div>
                <p class="text-xs text-gray-500">
                  {{ edu.institution }}
                  @if (edu.location) {
                    · {{ edu.location }}
                  }
                </p>
                @if (edu.gpa) {
                  <p class="text-xs text-gray-500 mt-0.5">{{ edu.gpa }}</p>
                }
              </div>
            }
          </section>
        }

        @if (cv().sections.skills.length > 0) {
          <section>
            <h2
              class="text-xs font-medium uppercase tracking-[0.15em] mb-4"
              [style.color]="accentColor()"
            >
              Skills
            </h2>
            <div class="flex flex-wrap gap-x-6 gap-y-2">
              @for (skill of cv().sections.skills; track skill.id) {
                <div>
                  <span class="text-xs text-gray-900">{{ skill.name }}</span>
                  <span class="text-xs text-gray-300 ml-1">{{
                    skill.level
                  }}</span>
                </div>
              }
            </div>
          </section>
        }

        @if (cv().sections.projects.length > 0) {
          <section class="mt-10">
            <h2
              class="text-xs font-medium uppercase tracking-[0.15em] mb-5"
              [style.color]="accentColor()"
            >
              Projects
            </h2>
            @for (proj of cv().sections.projects; track proj.id) {
              <div class="mb-6">
                <div class="flex justify-between items-baseline mb-0.5">
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ proj.name }}
                  </h3>
                  @if (proj.url) {
                    <span class="text-xs text-gray-500 shrink-0 ml-4">{{
                      proj.url
                    }}</span>
                  }
                </div>
                @if (proj.technologies) {
                  <p class="text-xs text-gray-500 mb-1.5">
                    {{ proj.technologies }}
                  </p>
                }
                @if (proj.description) {
                  <div
                    class="text-gray-500 text-xs leading-relaxed"
                    [innerHTML]="renderRichText(proj.description)"
                  ></div>
                }
              </div>
            }
          </section>
        }

        @if (cv().sections.certifications.length > 0) {
          <section class="mt-10">
            <h2
              class="text-xs font-medium uppercase tracking-[0.15em] mb-5"
              [style.color]="accentColor()"
            >
              Certifications
            </h2>
            @for (cert of cv().sections.certifications; track cert.id) {
              <div class="mb-3">
                <div class="flex justify-between items-baseline mb-0.5">
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ cert.name }}
                  </h3>
                  @if (cert.date) {
                    <span class="text-xs text-gray-500 shrink-0 ml-4">{{
                      formatDate(cert.date)
                    }}</span>
                  }
                </div>
                @if (cert.issuer) {
                  <p class="text-xs text-gray-500">{{ cert.issuer }}</p>
                }
              </div>
            }
          </section>
        }

        @if (cv().sections.languages.length > 0) {
          <section class="mt-10">
            <h2
              class="text-xs font-medium uppercase tracking-[0.15em] mb-4"
              [style.color]="accentColor()"
            >
              Languages
            </h2>
            <div class="flex flex-wrap gap-x-6 gap-y-2">
              @for (lang of cv().sections.languages; track lang.id) {
                <div>
                  <span class="text-xs text-gray-900">{{ lang.name }}</span>
                  <span class="text-xs text-gray-300 ml-1">{{
                    lang.proficiency
                  }}</span>
                </div>
              }
            </div>
          </section>
        }
      </div>
    </div>
  `,
})
export class MinimalTemplate {
  readonly cv = input.required<Cv>();
  readonly accentColor = input("#171717");
  readonly backgroundColor = input("#ffffff");
  readonly primaryColor = input("#111827");

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
