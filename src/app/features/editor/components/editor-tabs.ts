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
      class="md:hidden flex overflow-x-auto bg-card border-b border-border hide-scrollbar"
    >
      @for (tab of tabs(); track tab.id) {
        <button
          class="flex-none px-4 py-3 text-sm font-medium transition-all duration-300 border-b-2 active:bg-muted/50"
          [class]="
            activeTab() === tab.id
              ? 'text-primary border-primary'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          "
          (click)="tabSelected.emit(tab.id)"
        >
          <span class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      }
    </div>

    <!-- Desktop Sidebar -->
    <div class="hidden md:flex flex-col w-64 bg-card border-r border-border">
      <div class="flex-1 overflow-y-auto pt-4">
        <nav class="space-y-2 px-4">
          @for (tab of tabs(); track tab.id) {
            <button
              class="w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 active:scale-95"
              [class]="
                activeTab() === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              "
              (click)="tabSelected.emit(tab.id)"
            >
              <span
                class="mr-3 text-lg"
                [class.opacity-80]="activeTab() !== tab.id"
                >{{ tab.icon }}</span
              >
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
