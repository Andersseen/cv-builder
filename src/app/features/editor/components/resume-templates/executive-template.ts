import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { Cv } from "../../../../domain/models/cv-model";

@Component({
  selector: "app-executive-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="max-w-4xl mx-auto"
      id="resume-content"
      [style.background-color]="backgroundColor()"
      [style.font-family]="'Inter, system-ui, sans-serif'"
    >
      <!-- Header — bold dark block -->
      <div class="text-primary-foreground p-8" [style.background-color]="headerBg">
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
                  class="text-primary-foreground/60 text-sm italic max-w-md leading-relaxed mt-2"
                >
                  {{ cv().sections.personal.summary }}
                </p>
              }
            </div>
          </div>
          <div class="text-right text-xs space-y-1 text-primary-foreground/60 shrink-0 ml-6">
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
              class="text-base font-extrabold text-card-foreground mb-5 pb-2 uppercase tracking-wide"
              [style.border-bottom]="'3px solid ' + accentColor()"
            >
              Professional Experience
            </h2>
            @for (exp of cv().sections.experience; track exp.id) {
              <div class="mb-6">
                <div class="bg-card p-4 rounded-md mb-2">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-sm font-bold text-card-foreground uppercase">
                        {{ exp.jobTitle }}
                      </h3>
                      <p class="text-sm text-muted-foreground-foreground font-semibold">
                        {{ exp.company }}
                      </p>
                    </div>
                    <div class="text-right shrink-0 ml-4">
                      <p class="text-xs font-bold text-card-foreground">
                        {{ formatDate(exp.startDate) }} –
                        {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                      </p>
                      @if (exp.location) {
                        <p class="text-xs text-muted-foreground-foreground">{{ exp.location }}</p>
                      }
                    </div>
                  </div>
                </div>
                @if (exp.description) {
                  <p class="text-muted-foreground-foreground text-sm leading-relaxed pl-4">
                    {{ exp.description }}
                  </p>
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
                class="text-sm font-extrabold text-card-foreground mb-4 pb-2 uppercase tracking-wide"
                [style.border-bottom]="'2px solid ' + accentColor()"
              >
                Education
              </h2>
              @for (edu of cv().sections.education; track edu.id) {
                <div class="mb-3 bg-card p-3 rounded-md">
                  <h3 class="font-bold text-card-foreground text-xs uppercase">
                    {{ edu.degree }}
                  </h3>
                  <p class="text-muted-foreground-foreground text-xs font-semibold">
                    {{ edu.institution }}
                  </p>
                  <div
                    class="flex justify-between text-[10px] text-muted-foreground-foreground mt-1"
                  >
                    <span>{{ formatDate(edu.graduationDate) }}</span>
                    @if (edu.gpa) {
                      <span>GPA: {{ edu.gpa }}</span>
                    }
                  </div>
                  @if (edu.location) {
                    <p class="text-[10px] text-muted-foreground-foreground">{{ edu.location }}</p>
                  }
                </div>
              }
            </section>
          }

          <!-- Skills -->
          @if (cv().sections.skills.length > 0) {
            <section>
              <h2
                class="text-sm font-extrabold text-card-foreground mb-4 pb-2 uppercase tracking-wide"
                [style.border-bottom]="'2px solid ' + accentColor()"
              >
                Core Competencies
              </h2>
              <div class="space-y-2">
                @for (skill of cv().sections.skills; track skill.id) {
                  <div
                    class="text-primary-foreground px-3 py-2 rounded-md flex justify-between items-center"
                    [style.background-color]="accentColor()"
                  >
                    <span class="font-semibold text-xs">{{ skill.name }}</span>
                    <span
                      class="text-[10px] bg-card px-2 py-0.5 rounded-full font-bold"
                      [style.color]="accentColor()"
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
export class ExecutiveTemplate {
  readonly cv = input.required<Cv>();
  readonly accentColor = input("#111827");
  readonly backgroundColor = input("#ffffff");
  readonly primaryColor = input("#111827");

  protected get headerBg(): string {
    return this.accentColor();
  }

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
