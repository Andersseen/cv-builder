import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { Cv } from "../../../../domain/models/cv-model";

@Component({
  selector: "app-classic-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="max-w-4xl mx-auto"
      id="resume-content"
      [style.background-color]="backgroundColor()"
      [style.font-family]="'Georgia, Times New Roman, serif'"
    >
      <div class="p-8">
        <!-- Header — centered, traditional -->
        <div class="text-center mb-6 pb-5 border-b border-gray-300">
          <h1
            class="text-3xl font-bold text-gray-800 mb-2 tracking-wide uppercase"
          >
            {{ cv().sections.personal.fullName || "Your Name" }}
          </h1>
          <div
            class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600"
          >
            @if (cv().sections.personal.email) {
              <span>{{ cv().sections.personal.email }}</span>
            }
            @if (cv().sections.personal.phone) {
              <span
                class="before:content-['|'] before:mr-4 before:text-gray-300"
                >{{ cv().sections.personal.phone }}</span
              >
            }
            @if (cv().sections.personal.location) {
              <span
                class="before:content-['|'] before:mr-4 before:text-gray-300"
                >{{ cv().sections.personal.location }}</span
              >
            }
          </div>
          <div
            class="flex flex-wrap justify-center gap-x-4 text-sm text-gray-500 mt-1"
          >
            @if (cv().sections.personal.website) {
              <span>{{ cv().sections.personal.website }}</span>
            }
            @if (cv().sections.personal.linkedin) {
              <span>{{ cv().sections.personal.linkedin }}</span>
            }
          </div>
        </div>

        <!-- Summary -->
        @if (cv().sections.personal.summary) {
          <section class="mb-6">
            <h2
              class="text-sm font-bold text-gray-700 mb-2 uppercase tracking-[0.2em] pb-1"
              [style.border-bottom]="'1px solid ' + accentColor() + '40'"
            >
              Summary
            </h2>
            <p class="text-gray-600 leading-relaxed text-sm italic">
              {{ cv().sections.personal.summary }}
            </p>
          </section>
        }

        <!-- Experience -->
        @if (cv().sections.experience.length > 0) {
          <section class="mb-6">
            <h2
              class="text-sm font-bold text-gray-700 mb-3 uppercase tracking-[0.2em] pb-1"
              [style.border-bottom]="'1px solid ' + accentColor() + '40'"
            >
              Professional Experience
            </h2>
            @for (exp of cv().sections.experience; track exp.id) {
              <div class="mb-5">
                <div class="flex justify-between items-baseline mb-0.5">
                  <h3 class="text-base font-bold text-gray-800">
                    {{ exp.jobTitle }}
                  </h3>
                  <span class="text-xs text-gray-500 italic shrink-0 ml-4">
                    {{ formatDate(exp.startDate) }} –
                    {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                  </span>
                </div>
                <p class="text-gray-600 text-sm font-semibold mb-1">
                  {{ exp.company }}
                  @if (exp.location) {
                    , {{ exp.location }}
                  }
                </p>
                @if (exp.description) {
                  <p class="text-gray-600 text-sm leading-relaxed">
                    {{ exp.description }}
                  </p>
                }
              </div>
            }
          </section>
        }

        <!-- Education -->
        @if (cv().sections.education.length > 0) {
          <section class="mb-6">
            <h2
              class="text-sm font-bold text-gray-700 mb-3 uppercase tracking-[0.2em] pb-1"
              [style.border-bottom]="'1px solid ' + accentColor() + '40'"
            >
              Education
            </h2>
            @for (edu of cv().sections.education; track edu.id) {
              <div class="mb-3">
                <div class="flex justify-between items-baseline mb-0.5">
                  <h3 class="text-sm font-bold text-gray-800">
                    {{ edu.degree }}
                  </h3>
                  <span class="text-xs text-gray-500 italic shrink-0 ml-4">{{
                    formatDate(edu.graduationDate)
                  }}</span>
                </div>
                <p class="text-gray-600 text-sm">
                  {{ edu.institution }}
                  @if (edu.location) {
                    , {{ edu.location }}
                  }
                </p>
                @if (edu.gpa) {
                  <p class="text-xs text-gray-500">GPA: {{ edu.gpa }}</p>
                }
              </div>
            }
          </section>
        }

        <!-- Skills -->
        @if (cv().sections.skills.length > 0) {
          <section>
            <h2
              class="text-sm font-bold text-gray-700 mb-2 uppercase tracking-[0.2em] pb-1"
              [style.border-bottom]="'1px solid ' + accentColor() + '40'"
            >
              Skills
            </h2>
            <div class="flex flex-wrap gap-x-1 text-sm text-gray-600">
              @for (
                skill of cv().sections.skills;
                track skill.id;
                let last = $last
              ) {
                <span
                  >{{ skill.name }} ({{ skill.level }}){{
                    last ? "" : " · "
                  }}</span
                >
              }
            </div>
          </section>
        }
      </div>
    </div>
  `,
})
export class ClassicTemplate {
  readonly cv = input.required<Cv>();
  readonly accentColor = input("#475569");
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
