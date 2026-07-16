import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
@Component({
  selector: "app-editor-toolbar",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div
      class="bg-card/75 backdrop-blur-xl border-b border-border sticky top-0 z-30 shadow-glass transition-colors duration-300"
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
            <span class="hidden sm:inline">&larr; Back</span>
            <span class="sm:hidden">&larr;</span>
          </button>
          @if (cvName()) {
            <span
              class="text-foreground font-semibold truncate max-w-[120px] sm:max-w-md"
              >{{ cvName() }}</span
            >
          }
        </div>

        <!-- Right: autosave indicator + export -->
        <div class="flex items-center gap-3 shrink-0">
          @if (saving()) {
            <span
              class="hidden sm:flex text-xs text-muted-foreground items-center gap-1.5"
            >
              <span
                class="w-2 h-2 rounded-full bg-warning animate-pulse"
              ></span>
              Saving...
            </span>
          } @else if (lastSavedAt()) {
            <span class="hidden sm:inline text-xs text-muted-foreground">
              Saved &check;
            </span>
          }

          <!-- Undo / Redo -->
          <div class="flex items-center gap-1">
            <button
              (click)="undo.emit()"
              [disabled]="!canUndo()"
              aria-label="Undo"
              title="Undo"
              class="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </button>
            <button
              (click)="redo.emit()"
              [disabled]="!canRedo()"
              aria-label="Redo"
              title="Redo"
              class="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
                />
              </svg>
            </button>
          </div>

          <!-- Export dropdown -->
          <div class="relative">
            <div class="flex items-center">
              <!-- Primary action: Download PDF (print/text) -->
              <button
                data-testid="export-print-pdf"
                (click)="printPdf.emit()"
                [disabled]="isExporting()"
                aria-label="Download PDF"
                title="Best for job applications — selectable text, ATS-friendly"
                class="px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-50
                       text-accent-foreground text-sm font-medium rounded-l-lg transition-all duration-300
                       shadow-md hover:shadow-glass hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                <span class="hidden sm:inline">{{ isExporting() ? "Exporting..." : "Download PDF" }}</span>
                <span class="sm:hidden">PDF</span>
              </button>

              <!-- Dropdown toggle -->
              <button
                data-testid="export-dropdown-toggle"
                (click)="dropdownOpen.set(!dropdownOpen())"
                [disabled]="isExporting()"
                aria-label="More export options"
                title="More export options"
                class="px-2 py-2 bg-accent hover:bg-accent/80 disabled:opacity-50
                       text-accent-foreground rounded-r-lg transition-all duration-200
                       shadow-lg shadow-accent/20 border-l border-accent-foreground/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <!-- Dropdown menu -->
            @if (dropdownOpen()) {
              <div
                class="absolute right-0 top-full mt-1.5 w-56 bg-card border border-border rounded-xl shadow-xl shadow-foreground/10 overflow-hidden z-50"
              >
                <button
                  (click)="onPrintPdf()"
                  class="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-accent transition-colors flex items-start gap-3"
                >
                  <span class="text-lg leading-none mt-0.5">🖨️</span>
                  <div>
                    <div class="font-medium">Print PDF (text)</div>
                    <div class="text-xs text-muted-foreground mt-0.5">
                      Selectable text · ATS-friendly · Small file
                    </div>
                  </div>
                </button>
                <div class="border-t border-border"></div>
                <button
                  data-testid="export-image-pdf"
                  (click)="onExportImage()"
                  class="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-accent transition-colors flex items-start gap-3"
                >
                  <span class="text-lg leading-none mt-0.5">📸</span>
                  <div>
                    <div class="font-medium">High-fidelity PDF (image snapshot)</div>
                    <div class="text-xs text-muted-foreground mt-0.5">
                      Pixel-perfect · Text is not selectable · Not readable by ATS
                    </div>
                  </div>
                </button>
                <div class="border-t border-border"></div>
                <button
                  (click)="onExportJson()"
                  class="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-accent transition-colors flex items-start gap-3"
                >
                  <span class="text-lg leading-none mt-0.5">📤</span>
                  <div>
                    <div class="font-medium">Export JSON</div>
                    <div class="text-xs text-muted-foreground mt-0.5">
                      Portable backup of this resume
                    </div>
                  </div>
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop to close dropdown -->
    @if (dropdownOpen()) {
      <div class="fixed inset-0 z-20" (click)="dropdownOpen.set(false)"></div>
    }
  `,
})
export class EditorToolbar {
  readonly cvName = input<string>();
  readonly saving = input(false);
  readonly lastSavedAt = input<Date | null>(null);
  readonly isExporting = input(false);
  readonly canUndo = input(false);
  readonly canRedo = input(false);

  readonly back = output<void>();
  readonly undo = output<void>();
  readonly redo = output<void>();
  readonly exportPdf = output<void>();
  readonly printPdf = output<void>();
  readonly exportJson = output<void>();

  dropdownOpen = signal(false);

  onPrintPdf() {
    this.dropdownOpen.set(false);
    this.printPdf.emit();
  }

  onExportImage() {
    this.dropdownOpen.set(false);
    this.exportPdf.emit();
  }

  onExportJson() {
    this.dropdownOpen.set(false);
    this.exportJson.emit();
  }
}
