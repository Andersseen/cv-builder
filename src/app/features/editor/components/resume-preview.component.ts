import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Cv } from "../../../domain/models/cv.model";
import { ModernTemplateComponent } from "./resume-templates/modern-template.component";
import { ClassicTemplateComponent } from "./resume-templates/classic-template.component";
import { MinimalTemplateComponent } from "./resume-templates/minimal-template.component";
import { CreativeTemplateComponent } from "./resume-templates/creative-template.component";
import { ExecutiveTemplateComponent } from "./resume-templates/executive-template.component";

@Component({
  selector: "app-resume-preview",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ModernTemplateComponent,
    ClassicTemplateComponent,
    MinimalTemplateComponent,
    CreativeTemplateComponent,
    ExecutiveTemplateComponent,
  ],
  template: `
    <div class="bg-surface rounded-xl border border-border p-4">
      <h2
        class="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider"
      >
        Preview
      </h2>

      <div
        class="bg-white rounded-lg overflow-hidden shadow-2xl shadow-foreground/10"
        style="transform-origin: top center;"
      >
        @switch (cv().templateId) {
          @case ("modern") {
            <app-modern-template [cv]="cv()" />
          }
          @case ("classic") {
            <app-classic-template [cv]="cv()" />
          }
          @case ("minimal") {
            <app-minimal-template [cv]="cv()" />
          }
          @case ("creative") {
            <app-creative-template [cv]="cv()" />
          }
          @case ("executive") {
            <app-executive-template [cv]="cv()" />
          }
        }
      </div>
    </div>
  `,
})
export class ResumePreviewComponent {
  cv = input.required<Cv>();
}
