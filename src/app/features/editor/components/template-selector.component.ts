import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TEMPLATES } from "../../../domain/models/template-registry.model";
import { TemplateInfo } from "../../../domain/models/cv.model";

@Component({
  selector: "app-template-selector",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <h2 class="text-lg font-semibold text-foreground">Choose Template</h2>
      <p class="text-sm text-muted-foreground -mt-3">
        Select a layout that best represents your style
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        @for (template of templates; track template.id) {
          <button
            class="relative border-2 rounded-xl p-3 cursor-pointer transition-all duration-300 group text-left"
            [class]="
              selectedTemplateId() === template.id
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary/30'
                : 'border-border bg-surface hover:border-primary/40 hover:bg-surface-alt'
            "
            (click)="selectTemplate(template.id)"
          >
            <!-- Selected badge -->
            @if (selectedTemplateId() === template.id) {
              <div
                class="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg"
              >
                <svg
                  class="w-3 h-3 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            }

            <!-- Mini layout preview SVG -->
            <div
              class="w-full aspect-[3/4] mb-3 rounded-lg overflow-hidden border border-border/50 bg-white"
            >
              <svg
                viewBox="0 0 120 160"
                class="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                @switch (template.previewLayout) {
                  @case ("header-accent") {
                    <!-- Header accent: colored top bar -->
                    <rect
                      width="120"
                      height="35"
                      [attr.fill]="template.accentColor"
                    />
                    <rect
                      x="12"
                      y="10"
                      width="50"
                      height="6"
                      rx="2"
                      fill="white"
                      opacity="0.9"
                    />
                    <rect
                      x="12"
                      y="20"
                      width="70"
                      height="3"
                      rx="1"
                      fill="white"
                      opacity="0.5"
                    />
                    <!-- Content -->
                    <rect
                      x="12"
                      y="45"
                      width="40"
                      height="4"
                      rx="1"
                      [attr.fill]="template.accentColor"
                      opacity="0.8"
                    />
                    <rect
                      x="12"
                      y="54"
                      width="96"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="12"
                      y="60"
                      width="85"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="12"
                      y="66"
                      width="90"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="12"
                      y="80"
                      width="35"
                      height="4"
                      rx="1"
                      [attr.fill]="template.accentColor"
                      opacity="0.8"
                    />
                    <rect
                      x="12"
                      y="89"
                      width="96"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="12"
                      y="95"
                      width="78"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="12"
                      y="109"
                      width="30"
                      height="4"
                      rx="1"
                      [attr.fill]="template.accentColor"
                      opacity="0.8"
                    />
                    <rect
                      x="12"
                      y="118"
                      width="28"
                      height="10"
                      rx="3"
                      fill="#e5e5e5"
                    />
                    <rect
                      x="44"
                      y="118"
                      width="28"
                      height="10"
                      rx="3"
                      fill="#e5e5e5"
                    />
                    <rect
                      x="76"
                      y="118"
                      width="28"
                      height="10"
                      rx="3"
                      fill="#e5e5e5"
                    />
                  }
                  @case ("single-column") {
                    <!-- Single column: centered header, dividers -->
                    <rect
                      x="25"
                      y="12"
                      width="70"
                      height="6"
                      rx="2"
                      [attr.fill]="template.accentColor"
                    />
                    <rect
                      x="20"
                      y="24"
                      width="80"
                      height="3"
                      rx="1"
                      fill="#a3a3a3"
                    />
                    <line
                      x1="12"
                      y1="35"
                      x2="108"
                      y2="35"
                      [attr.stroke]="template.accentColor"
                      stroke-width="1"
                      opacity="0.3"
                    />
                    <!-- Body -->
                    <rect
                      x="12"
                      y="42"
                      width="45"
                      height="4"
                      rx="1"
                      fill="#525252"
                      opacity="0.6"
                    />
                    <rect
                      x="12"
                      y="51"
                      width="96"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="12"
                      y="57"
                      width="88"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="12"
                      y="63"
                      width="92"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <line
                      x1="12"
                      y1="75"
                      x2="108"
                      y2="75"
                      [attr.stroke]="template.accentColor"
                      stroke-width="1"
                      opacity="0.3"
                    />
                    <rect
                      x="12"
                      y="82"
                      width="40"
                      height="4"
                      rx="1"
                      fill="#525252"
                      opacity="0.6"
                    />
                    <rect
                      x="12"
                      y="91"
                      width="96"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="12"
                      y="97"
                      width="80"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <line
                      x1="12"
                      y1="109"
                      x2="108"
                      y2="109"
                      [attr.stroke]="template.accentColor"
                      stroke-width="1"
                      opacity="0.3"
                    />
                    <rect
                      x="12"
                      y="116"
                      width="35"
                      height="4"
                      rx="1"
                      fill="#525252"
                      opacity="0.6"
                    />
                    <rect
                      x="12"
                      y="125"
                      width="96"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                  }
                  @case ("sidebar-left") {
                    <!-- Sidebar: dark left panel -->
                    <rect width="40" height="160" fill="#1f2937" />
                    <!-- Sidebar content -->
                    <rect
                      x="8"
                      y="12"
                      width="24"
                      height="5"
                      rx="1"
                      fill="white"
                      opacity="0.9"
                    />
                    <rect
                      x="8"
                      y="22"
                      width="28"
                      height="3"
                      rx="1"
                      fill="white"
                      opacity="0.4"
                    />
                    <rect
                      x="8"
                      y="28"
                      width="25"
                      height="3"
                      rx="1"
                      fill="white"
                      opacity="0.4"
                    />
                    <rect
                      x="8"
                      y="42"
                      width="18"
                      height="4"
                      rx="1"
                      [attr.fill]="template.accentColor"
                    />
                    <rect
                      x="8"
                      y="51"
                      width="26"
                      height="3"
                      rx="1"
                      fill="white"
                      opacity="0.3"
                    />
                    <rect
                      x="8"
                      y="57"
                      width="28"
                      height="4"
                      rx="2"
                      [attr.fill]="template.accentColor"
                      opacity="0.6"
                    />
                    <rect
                      x="8"
                      y="65"
                      width="26"
                      height="3"
                      rx="1"
                      fill="white"
                      opacity="0.3"
                    />
                    <rect
                      x="8"
                      y="71"
                      width="22"
                      height="4"
                      rx="2"
                      [attr.fill]="template.accentColor"
                      opacity="0.4"
                    />
                    <!-- Main content -->
                    <rect
                      x="48"
                      y="12"
                      width="30"
                      height="4"
                      rx="1"
                      fill="#525252"
                      opacity="0.7"
                    />
                    <rect
                      x="48"
                      y="21"
                      width="60"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="48"
                      y="27"
                      width="55"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="48"
                      y="42"
                      width="25"
                      height="4"
                      rx="1"
                      fill="#525252"
                      opacity="0.7"
                    />
                    <!-- Timeline dots -->
                    <circle
                      cx="50"
                      cy="54"
                      r="2"
                      [attr.fill]="template.accentColor"
                    />
                    <rect
                      x="56"
                      y="51"
                      width="50"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="56"
                      y="57"
                      width="45"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <circle
                      cx="50"
                      cy="70"
                      r="2"
                      [attr.fill]="template.accentColor"
                    />
                    <rect
                      x="56"
                      y="67"
                      width="50"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                    <rect
                      x="56"
                      y="73"
                      width="40"
                      height="3"
                      rx="1"
                      fill="#d4d4d4"
                    />
                  }
                }
              </svg>
            </div>

            <h3
              class="font-semibold text-sm mb-0.5 transition-colors"
              [class]="
                selectedTemplateId() === template.id
                  ? 'text-primary'
                  : 'text-foreground'
              "
            >
              {{ template.name }}
            </h3>
            <p class="text-xs text-muted-foreground leading-tight">
              {{ template.description }}
            </p>
          </button>
        }
      </div>
    </div>
  `,
})
export class TemplateSelectorComponent {
  selectedTemplateId = input.required<string>();
  templateSelected = output<string>();

  readonly templates = TEMPLATES;

  selectTemplate(id: string) {
    this.templateSelected.emit(id);
  }
}
