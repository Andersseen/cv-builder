import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from "@angular/core";

@Component({
  selector: "app-editor-toolbar",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-30"
    >
      <div
        class="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between gap-4"
      >
        <!-- Left: back + title -->
        <div class="flex items-center gap-3 min-w-0">
          <button
            (click)="back.emit()"
            class="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title="Back to dashboard"
          >
            &larr; Back
          </button>
          @if (cvName()) {
            <span class="text-foreground font-semibold truncate">{{
              cvName()
            }}</span>
          }
        </div>

        <!-- Right: autosave indicator + export -->
        <div class="flex items-center gap-4 shrink-0">
          @if (saving()) {
            <span
              class="text-xs text-muted-foreground flex items-center gap-1.5"
            >
              <span
                class="w-2 h-2 rounded-full bg-warning animate-pulse"
              ></span>
              Saving...
            </span>
          } @else if (lastSavedAt()) {
            <span class="text-xs text-muted-foreground"> Saved &check; </span>
          }
          <button
            (click)="exportPdf.emit()"
            [disabled]="isExporting()"
            class="px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-50
                   text-accent-foreground text-sm font-medium rounded-lg transition-all duration-200
                   shadow-lg shadow-accent/20"
          >
            {{ isExporting() ? "Exporting..." : "Download PDF" }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class EditorToolbarComponent {
  cvName = input<string>();
  saving = input(false);
  lastSavedAt = input<Date | null>(null);
  isExporting = input(false);

  back = output<void>();
  exportPdf = output<void>();
}
