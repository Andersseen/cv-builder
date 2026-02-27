import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { Cv } from "../../../../domain/models/cv-model";

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
          <div class="flex flex-wrap gap-x-4 mt-2 text-xs text-gray-400">
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
                  <span class="text-xs text-gray-400 shrink-0 ml-4">
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
                  <p class="text-gray-500 text-xs leading-relaxed">
                    {{ exp.description }}
                  </p>
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
                  <span class="text-xs text-gray-400 shrink-0 ml-4">{{
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
                  <p class="text-xs text-gray-400 mt-0.5">{{ edu.gpa }}</p>
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
                  <span class="text-xs text-gray-700">{{ skill.name }}</span>
                  <span class="text-xs text-gray-300 ml-1">{{
                    skill.level
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
