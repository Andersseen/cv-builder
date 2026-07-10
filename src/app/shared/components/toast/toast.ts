import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LmnCheckCircleIcon } from "lumen-icons/check-circle";
import { LmnXCircleIcon } from "lumen-icons/x-circle";
import { LmnInformationCircleIcon } from "lumen-icons/information-circle";
import { LmnExclamationTriangleIcon } from "lumen-icons/exclamation-triangle";
import { LmnXMarkIcon } from "lumen-icons/x-mark";
import { MoveEnterDirective } from "angular-movement";
import { ToastService } from "../../../core/services/toast";

@Component({
  selector: "app-toast",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LmnCheckCircleIcon,
    LmnXCircleIcon,
    LmnInformationCircleIcon,
    LmnExclamationTriangleIcon,
    LmnXMarkIcon,
    MoveEnterDirective,
  ],
  template: `
    <div
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md"
      role="status"
      aria-live="polite"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          moveEnter="fade-left"
          class="rounded-md shadow-md p-4 flex items-center gap-3"
          [class]="toastClasses(toast.type)"
        >
          @switch (toast.type) {
            @case ("success") {
              <lmn-check-circle [size]="20" ariaLabel="Success" />
            }
            @case ("error") {
              <lmn-x-circle [size]="20" ariaLabel="Error" />
            }
            @case ("warning") {
              <lmn-exclamation-triangle [size]="20" ariaLabel="Warning" />
            }
            @default {
              <lmn-information-circle [size]="20" ariaLabel="Info" />
            }
          }
          <p class="text-sm font-medium">{{ toast.message }}</p>
          <button
            class="ml-auto opacity-70 hover:opacity-100 transition-opacity"
            (click)="toastService.remove(toast.id)"
          >
            <lmn-x-mark [size]="16" ariaLabel="Dismiss notification" />
          </button>
        </div>
      }
    </div>
  `,
})
export class Toast {
  readonly toastService = inject(ToastService);

  toastClasses(type: string): string {
    switch (type) {
      case "success":
        return "bg-success text-success-foreground";
      case "error":
        return "bg-error text-error-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "info":
        return "bg-info text-info-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  }
}
