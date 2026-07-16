import { Injectable, signal } from "@angular/core";

export interface ToastAction {
  label: string;
  handler: () => void;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration: number;
  action?: ToastAction;
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);

  public toasts = this.toastsSignal.asReadonly();

  show(
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
    duration: number = 3000,
    action?: ToastAction,
  ): void {
    const id = Math.random().toString(36).substring(2, 9);

    this.toastsSignal.update((toasts) => [
      ...toasts,
      { id, message, type, duration, action },
    ]);

    setTimeout(() => this.remove(id), duration);
  }

  remove(id: string): void {
    this.toastsSignal.update((toasts) =>
      toasts.filter((toast) => toast.id !== id),
    );
  }
}
