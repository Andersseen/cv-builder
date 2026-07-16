import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

/**
 * Small modal dialog for destructive or important confirmations.
 *
 * Uses only semantic Tailwind tokens so it respects light/dark theme and
 * matches the rest of the app chrome.
 */
@Component({
  selector: "app-confirm-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      (click)="cancelled.emit()"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6"
        (click)="$event.stopPropagation()"
      >
        <h2 class="text-lg font-semibold text-foreground mb-2">
          {{ title() }}
        </h2>
        <p class="text-sm text-muted-foreground mb-6">
          {{ message() }}
        </p>

        <div class="flex justify-end gap-3">
          <button
            (click)="cancelled.emit()"
            class="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-accent rounded-lg transition-colors"
          >
            {{ cancelLabel() }}
          </button>
          <button
            (click)="confirm.emit()"
            [class]="
              destructive()
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            "
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          >
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input<string>("Confirm");
  readonly cancelLabel = input<string>("Cancel");
  readonly destructive = input(false);

  readonly confirm = output<void>();
  readonly cancelled = output<void>();
}
