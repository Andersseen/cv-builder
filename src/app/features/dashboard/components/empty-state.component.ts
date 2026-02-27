import { Component, output, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-empty-state",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="text-center py-24">
      <div
        class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-surface flex items-center justify-center border border-border"
      >
        <span class="text-3xl">📄</span>
      </div>
      <h2 class="text-xl font-semibold text-foreground mb-2">No resumes yet</h2>
      <p class="text-muted-foreground mb-8 max-w-md mx-auto">
        Create your first resume and start building your professional profile.
      </p>
      <button
        (click)="create.emit()"
        class="px-8 py-3 bg-primary hover:bg-primary-700 text-primary-foreground rounded-xl font-semibold
               transition-all duration-200 shadow-lg shadow-primary/25"
      >
        Create Your First Resume
      </button>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly create = output<void>();
}
