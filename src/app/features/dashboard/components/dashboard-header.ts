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
        <p class="text-muted-foreground-foreground text-sm">
          Create, manage, and export your resumes
        </p>
      </div>
      <button
        (click)="create.emit()"
        class="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold
               transition-all duration-300 shadow-md hover:shadow-glass
               flex items-center gap-2 transform hover:-translate-y-0.5"
      >
        <span class="text-lg">+</span> New Resume
      </button>
    </div>
  `,
})
export class DashboardHeader {
  readonly create = output<void>();
}
