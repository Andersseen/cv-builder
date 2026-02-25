import { Component, output, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-dashboard-header",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
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
      <button
        (click)="create.emit()"
        class="px-6 py-3 bg-primary hover:bg-primary-700 text-primary-foreground rounded-xl font-semibold
               transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40
               flex items-center gap-2"
      >
        <span class="text-lg">+</span> New Resume
      </button>
    </div>
  `,
})
export class DashboardHeaderComponent {
  create = output<void>();
}
