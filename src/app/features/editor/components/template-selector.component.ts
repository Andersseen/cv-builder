import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TEMPLATES } from "../../../domain/models/template-registry.model";

@Component({
  selector: "app-template-selector",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <h2 class="text-lg font-semibold text-white">Choose Template</h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        @for (template of templates; track template.id) {
          <div
            class="border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 group"
            [class]="
              selectedTemplateId() === template.id
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                : 'border-slate-600/50 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
            "
            (click)="selectTemplate(template.id)"
          >
            <div class="text-center">
              <div
                class="w-full h-16 bg-slate-600/30 rounded-lg mb-3 flex items-center justify-center
                          group-hover:bg-slate-600/50 transition-colors"
              >
                <span
                  class="text-xs text-slate-400 font-mono uppercase tracking-wider"
                >
                  {{ template.id }}
                </span>
              </div>
              <h3
                class="font-semibold text-sm mb-1 transition-colors"
                [class]="
                  selectedTemplateId() === template.id
                    ? 'text-blue-400'
                    : 'text-white'
                "
              >
                {{ template.name }}
              </h3>
              <p class="text-xs text-slate-500">{{ template.description }}</p>
            </div>
          </div>
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
