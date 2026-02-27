import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from "@angular/core";

import { TEMPLATES } from "../../../domain/models/template-registry.model";
import { ColorPickerComponent, ColorPreset } from "./color-picker.component";

@Component({
  selector: "app-template-selector",
  imports: [ColorPickerComponent],
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
            @if (selectedTemplateId() === template.id) {
              <div
                class="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5 text-primary-foreground"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            }

            <!-- Template preview SVG -->
            <div
              class="bg-white border border-border/50 rounded-lg overflow-hidden mb-3 aspect-[3/4] flex items-stretch"
            >
              <svg
                viewBox="0 0 120 160"
                class="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                @switch (template.previewLayout) {
                  @case ("single-column") {
                    <rect width="120" height="30" fill="#3b82f6" />
                    <rect
                      x="10"
                      y="8"
                      width="60"
                      height="5"
                      rx="2"
                      fill="white"
                      opacity="0.9"
                    />
                    <rect
                      x="10"
                      y="16"
                      width="40"
                      height="3"
                      rx="1"
                      fill="white"
                      opacity="0.5"
                    />
                    <rect
                      x="10"
                      y="38"
                      width="30"
                      height="3"
                      rx="1"
                      fill="#3b82f6"
                      opacity="0.6"
                    />
                    <rect
                      x="10"
                      y="45"
                      width="100"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="50"
                      width="95"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="55"
                      width="80"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="65"
                      width="30"
                      height="3"
                      rx="1"
                      fill="#3b82f6"
                      opacity="0.6"
                    />
                    <rect
                      x="10"
                      y="72"
                      width="100"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="77"
                      width="90"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="82"
                      width="95"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="92"
                      width="30"
                      height="3"
                      rx="1"
                      fill="#3b82f6"
                      opacity="0.6"
                    />
                    <rect
                      x="10"
                      y="99"
                      width="100"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="104"
                      width="85"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                  }
                  @case ("sidebar-left") {
                    <rect width="40" height="160" fill="#1f2937" />
                    <circle cx="20" cy="20" r="10" fill="#374151" />
                    <rect
                      x="8"
                      y="35"
                      width="24"
                      height="3"
                      rx="1"
                      fill="white"
                      opacity="0.8"
                    />
                    <rect
                      x="8"
                      y="42"
                      width="20"
                      height="2"
                      rx="1"
                      fill="white"
                      opacity="0.4"
                    />
                    <rect
                      x="8"
                      y="55"
                      width="15"
                      height="2"
                      rx="1"
                      fill="#f59e0b"
                      opacity="0.8"
                    />
                    <rect
                      x="8"
                      y="61"
                      width="24"
                      height="2"
                      rx="1"
                      fill="white"
                      opacity="0.3"
                    />
                    <rect
                      x="8"
                      y="66"
                      width="20"
                      height="2"
                      rx="1"
                      fill="white"
                      opacity="0.3"
                    />
                    <rect
                      x="48"
                      y="12"
                      width="25"
                      height="3"
                      rx="1"
                      fill="#374151"
                      opacity="0.6"
                    />
                    <rect
                      x="48"
                      y="19"
                      width="62"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="48"
                      y="24"
                      width="58"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="48"
                      y="34"
                      width="25"
                      height="3"
                      rx="1"
                      fill="#374151"
                      opacity="0.6"
                    />
                    <rect
                      x="48"
                      y="41"
                      width="62"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="48"
                      y="46"
                      width="55"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                  }
                  @case ("sidebar-right") {
                    <rect x="80" y="0" width="40" height="160" fill="#f3f4f6" />
                    <rect
                      x="10"
                      y="12"
                      width="50"
                      height="5"
                      rx="2"
                      fill="#111827"
                      opacity="0.8"
                    />
                    <rect
                      x="10"
                      y="22"
                      width="60"
                      height="2"
                      rx="1"
                      fill="#6b7280"
                      opacity="0.5"
                    />
                    <rect
                      x="10"
                      y="32"
                      width="25"
                      height="3"
                      rx="1"
                      fill="#10b981"
                      opacity="0.6"
                    />
                    <rect
                      x="10"
                      y="39"
                      width="62"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="44"
                      width="58"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="88"
                      y="12"
                      width="24"
                      height="3"
                      rx="1"
                      fill="#374151"
                      opacity="0.6"
                    />
                    <rect
                      x="88"
                      y="19"
                      width="24"
                      height="2"
                      rx="1"
                      fill="#9ca3af"
                      opacity="0.5"
                    />
                    <rect
                      x="88"
                      y="24"
                      width="20"
                      height="2"
                      rx="1"
                      fill="#9ca3af"
                      opacity="0.5"
                    />
                    <rect
                      x="88"
                      y="34"
                      width="24"
                      height="3"
                      rx="1"
                      fill="#374151"
                      opacity="0.6"
                    />
                    <rect
                      x="88"
                      y="41"
                      width="24"
                      height="2"
                      rx="1"
                      fill="#9ca3af"
                      opacity="0.5"
                    />
                  }
                  @case ("two-column") {
                    <rect width="120" height="25" fill="#111827" />
                    <rect
                      x="10"
                      y="8"
                      width="50"
                      height="4"
                      rx="2"
                      fill="white"
                      opacity="0.9"
                    />
                    <rect
                      x="10"
                      y="15"
                      width="35"
                      height="2"
                      rx="1"
                      fill="white"
                      opacity="0.4"
                    />
                    <rect
                      x="10"
                      y="33"
                      width="25"
                      height="3"
                      rx="1"
                      fill="#8b5cf6"
                      opacity="0.6"
                    />
                    <rect
                      x="10"
                      y="40"
                      width="48"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="45"
                      width="45"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="66"
                      y="33"
                      width="25"
                      height="3"
                      rx="1"
                      fill="#8b5cf6"
                      opacity="0.6"
                    />
                    <rect
                      x="66"
                      y="40"
                      width="44"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="66"
                      y="45"
                      width="40"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                  }
                  @case ("header-accent") {
                    <rect width="120" height="6" fill="#4f46e5" />
                    <rect
                      x="10"
                      y="14"
                      width="50"
                      height="5"
                      rx="2"
                      fill="#111827"
                      opacity="0.8"
                    />
                    <rect
                      x="10"
                      y="24"
                      width="80"
                      height="2"
                      rx="1"
                      fill="#6b7280"
                      opacity="0.4"
                    />
                    <line
                      x1="10"
                      y1="32"
                      x2="110"
                      y2="32"
                      stroke="#e5e7eb"
                      stroke-width="0.5"
                    />
                    <rect
                      x="10"
                      y="38"
                      width="25"
                      height="3"
                      rx="1"
                      fill="#4f46e5"
                      opacity="0.6"
                    />
                    <rect
                      x="10"
                      y="45"
                      width="100"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="50"
                      width="95"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="60"
                      width="25"
                      height="3"
                      rx="1"
                      fill="#4f46e5"
                      opacity="0.6"
                    />
                    <rect
                      x="10"
                      y="67"
                      width="100"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
                    />
                    <rect
                      x="10"
                      y="72"
                      width="90"
                      height="2"
                      rx="1"
                      fill="#e5e7eb"
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

      <!-- Color Pickers -->
      <div
        class="mt-6 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        <app-color-picker
          label="Accent Color"
          description="Highlights, borders, badges"
          [currentColor]="accentColor()"
          [presets]="accentPresets"
          (colorChanged)="colorChanged.emit($event)"
        />
        <app-color-picker
          label="Background"
          description="Resume background"
          [currentColor]="backgroundColor()"
          [presets]="bgPresets"
          (colorChanged)="backgroundColorChanged.emit($event)"
        />
        <app-color-picker
          label="Text Color"
          description="Headings and body text"
          [currentColor]="primaryColor()"
          [presets]="textPresets"
          (colorChanged)="primaryColorChanged.emit($event)"
        />
      </div>
    </div>
  `,
})
export class TemplateSelectorComponent {
  readonly selectedTemplateId = input.required<string>();
  readonly accentColor = input.required<string>();
  readonly backgroundColor = input("#ffffff");
  readonly primaryColor = input("#111827");

  readonly templateSelected = output<string>();
  readonly colorChanged = output<string>();
  readonly backgroundColorChanged = output<string>();
  readonly primaryColorChanged = output<string>();

  readonly templates = TEMPLATES;

  readonly accentPresets: ColorPreset[] = [
    { name: "Indigo", value: "#4f46e5" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Emerald", value: "#10b981" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Slate", value: "#475569" },
  ];

  readonly bgPresets: ColorPreset[] = [
    { name: "White", value: "#ffffff" },
    { name: "Snow", value: "#fafafa" },
    { name: "Warm", value: "#fffbeb" },
    { name: "Cool", value: "#f0f9ff" },
    { name: "Mint", value: "#f0fdf4" },
    { name: "Lavender", value: "#faf5ff" },
    { name: "Slate", value: "#f8fafc" },
    { name: "Dark", value: "#1e293b" },
  ];

  readonly textPresets: ColorPreset[] = [
    { name: "Charcoal", value: "#111827" },
    { name: "Slate", value: "#334155" },
    { name: "Gray", value: "#4b5563" },
    { name: "Navy", value: "#1e3a5f" },
    { name: "Dark Brown", value: "#3c1f0e" },
    { name: "White", value: "#ffffff" },
    { name: "Light", value: "#f1f5f9" },
    { name: "Muted", value: "#94a3b8" },
  ];

  selectTemplate(id: string) {
    this.templateSelected.emit(id);
  }
}
