import {
  Component,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";

@Component({
  selector: "app-editor-toolbar",
  changeDetection: ChangeDetectionStrategy.OnPush,
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
            class="text-muted-foreground-foreground hover:text-foreground transition-colors shrink-0"
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
        <div class="flex items-center gap-3 shrink-0">
          @if (saving()) {
            <span
              class="text-xs text-muted-foreground-foreground flex items-center gap-1.5"
            >
              <span
                class="w-2 h-2 rounded-full bg-warning animate-pulse"
              ></span>
              Saving...
            </span>
          } @else if (lastSavedAt()) {
            <span class="text-xs text-muted-foreground-foreground">
              Saved &check;
            </span>
          }

          <!-- Export dropdown -->
          <div class="relative">
            <div class="flex items-center">
              <!-- Primary action: Print PDF -->
              <button
                (click)="printPdf.emit()"
                [disabled]="isExporting()"
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
                {{ isExporting() ? "Exporting..." : "Print PDF" }}
              </button>

              <!-- Dropdown toggle -->
              <button
                (click)="dropdownOpen.set(!dropdownOpen())"
                [disabled]="isExporting()"
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
                  class="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-card-hover transition-colors flex items-start gap-3"
                >
                  <span class="text-lg leading-none mt-0.5">🖨️</span>
                  <div>
                    <div class="font-medium">Print PDF</div>
                    <div
                      class="text-xs text-muted-foreground-foreground mt-0.5"
                    >
                      Selectable text · ATS-friendly · Small file
                    </div>
                  </div>
                </button>
                <div class="border-t border-border"></div>
                <button
                  (click)="onExportImage()"
                  class="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-card-hover transition-colors flex items-start gap-3"
                >
                  <span class="text-lg leading-none mt-0.5">📸</span>
                  <div>
                    <div class="font-medium">Image PDF</div>
                    <div
                      class="text-xs text-muted-foreground-foreground mt-0.5"
                    >
                      Pixel-perfect snapshot · Larger file
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

  readonly back = output<void>();
  readonly exportPdf = output<void>();
  readonly printPdf = output<void>();

  dropdownOpen = signal(false);

  onPrintPdf() {
    this.dropdownOpen.set(false);
    this.printPdf.emit();
  }

  onExportImage() {
    this.dropdownOpen.set(false);
    this.exportPdf.emit();
  }
}
