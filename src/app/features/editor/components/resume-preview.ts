import { Component, input, ChangeDetectionStrategy } from "@angular/core";

import { Cv } from "../../../domain/models/cv-model";
import { ModernTemplate } from "./resume-templates/modern-template";
import { ClassicTemplate } from "./resume-templates/classic-template";
import { MinimalTemplate } from "./resume-templates/minimal-template";
import { CreativeTemplate } from "./resume-templates/creative-template";
import { ExecutiveTemplate } from "./resume-templates/executive-template";

@Component({
  selector: "app-resume-preview",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ModernTemplate,
    ClassicTemplate,
    MinimalTemplate,
    CreativeTemplate,
    ExecutiveTemplate,
  ],
  template: `
    <div class="bg-card rounded-xl border border-border p-4">
      <h2
        class="text-sm font-medium text-muted-foreground-foreground mb-3 uppercase tracking-wider"
      >
        Preview
      </h2>

      <div
        class="bg-card rounded-lg overflow-hidden shadow-2xl shadow-foreground/10"
        style="transform-origin: top center;"
      >
        @switch (cv().templateId) {
          @case ("modern") {
            <app-modern-template
              [cv]="cv()"
              [accentColor]="cv().settings.accentColor"
              [backgroundColor]="cv().settings.backgroundColor"
              [primaryColor]="cv().settings.primaryColor"
            />
          }
          @case ("classic") {
            <app-classic-template
              [cv]="cv()"
              [accentColor]="cv().settings.accentColor"
              [backgroundColor]="cv().settings.backgroundColor"
              [primaryColor]="cv().settings.primaryColor"
            />
          }
          @case ("minimal") {
            <app-minimal-template
              [cv]="cv()"
              [accentColor]="cv().settings.accentColor"
              [backgroundColor]="cv().settings.backgroundColor"
              [primaryColor]="cv().settings.primaryColor"
            />
          }
          @case ("creative") {
            <app-creative-template
              [cv]="cv()"
              [accentColor]="cv().settings.accentColor"
              [backgroundColor]="cv().settings.backgroundColor"
              [primaryColor]="cv().settings.primaryColor"
            />
          }
          @case ("executive") {
            <app-executive-template
              [cv]="cv()"
              [accentColor]="cv().settings.accentColor"
              [backgroundColor]="cv().settings.backgroundColor"
              [primaryColor]="cv().settings.primaryColor"
            />
          }
        }
      </div>
    </div>
  `,
})
export class ResumePreview {
  readonly cv = input.required<Cv>();
}
