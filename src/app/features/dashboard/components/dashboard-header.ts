import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { VoltButton } from "@voltui/components";
import { LmnPlusIcon } from "lumen-icons/plus";
import { LmnArrowUpTrayIcon } from "lumen-icons/arrow-up-tray";
import { LmnArrowDownTrayIcon } from "lumen-icons/arrow-down-tray";
import { LmnSparklesIcon } from "lumen-icons/sparkles";
import { MoveEnterDirective } from "angular-movement";

@Component({
  selector: "app-dashboard-header",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    VoltButton,
    LmnPlusIcon,
    LmnArrowUpTrayIcon,
    LmnArrowDownTrayIcon,
    LmnSparklesIcon,
    MoveEnterDirective,
  ],
  template: `
    <div
      moveEnter="fade-down"
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
    >
      <div>
        <h1 class="text-3xl font-display font-bold text-foreground mb-1">
          My Resumes
        </h1>
        <p class="text-muted-foreground text-sm">
          Create, manage, and export your resumes
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <label
          class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-border bg-card text-foreground hover:bg-accent cursor-pointer transition-colors"
        >
          <lmn-arrow-up-tray [size]="16" ariaLabel="Import backup" />
          Import Backup
          <input
            type="file"
            accept=".json,application/json"
            class="hidden"
            (change)="onImportSelected($event)"
          />
        </label>
        <volt-button variant="outline" size="sm" (click)="startExample.emit()">
          <lmn-sparkles slot="leading" [size]="16" />
          Example
        </volt-button>
        <volt-button variant="outline" size="sm" (click)="exportBackup.emit()">
          <lmn-arrow-down-tray slot="leading" [size]="16" />
          Backup
        </volt-button>
        <volt-button size="lg" (click)="create.emit()">
          <lmn-plus slot="leading" [size]="20" />
          New Resume
        </volt-button>
      </div>
    </div>
  `,
})
export class DashboardHeader {
  readonly create = output<void>();
  readonly startExample = output<void>();
  readonly exportBackup = output<void>();
  readonly importBackup = output<File>();

  onImportSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.importBackup.emit(file);
    }
    // Reset so the same file can be selected again
    input.value = "";
  }
}
