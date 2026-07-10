import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { VoltButton } from "@voltui/components";
import { LmnPlusIcon } from "lumen-icons/plus";
import { MoveEnterDirective } from "angular-movement";

@Component({
  selector: "app-dashboard-header",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoltButton, LmnPlusIcon, MoveEnterDirective],
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
      <volt-button size="lg" (click)="create.emit()">
        <lmn-plus slot="leading" [size]="20" />
        New Resume
      </volt-button>
    </div>
  `,
})
export class DashboardHeader {
  readonly create = output<void>();
}
