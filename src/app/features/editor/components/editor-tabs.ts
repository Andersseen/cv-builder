import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from "@angular/core";

export type EditorTab =
  | "personal"
  | "experience"
  | "education"
  | "skills"
  | "template";

export interface TabConfig {
  id: EditorTab;
  label: string;
  icon: string;
}

@Component({
  selector: "app-editor-tabs",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Mobile Tabs -->
    <div
      class="md:hidden flex overflow-x-auto bg-white border-b border-neutral-200 hide-scrollbar"
    >
      @for (tab of tabs(); track tab.id) {
        <button
          class="flex-none px-4 py-3 text-sm font-medium transition-colors border-b-2"
          [class.text-primary-600]="activeTab() === tab.id"
          [class.border-primary-600]="activeTab() === tab.id"
          [class.text-neutral-500]="activeTab() !== tab.id"
          [class.border-transparent]="activeTab() !== tab.id"
          [class.hover:text-neutral-700]="activeTab() !== tab.id"
          (click)="tabSelected.emit(tab.id)"
        >
          <span class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      }
    </div>

    <!-- Desktop Sidebar -->
    <div
      class="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200"
    >
      <div class="flex-1 overflow-y-auto pt-4">
        <nav class="space-y-1 px-3">
          @for (tab of tabs(); track tab.id) {
            <button
              class="w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors"
              [class.bg-primary-50]="activeTab() === tab.id"
              [class.text-primary-700]="activeTab() === tab.id"
              [class.text-neutral-700]="activeTab() !== tab.id"
              [class.hover:bg-neutral-50]="activeTab() !== tab.id"
              (click)="tabSelected.emit(tab.id)"
            >
              <span class="mr-3 text-lg">{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          }
        </nav>
      </div>
    </div>
  `,
})
export class EditorTabs {
  readonly activeTab = input.required<EditorTab>();
  readonly tabs = input.required<TabConfig[]>();
  readonly tabSelected = output<EditorTab>();
}
