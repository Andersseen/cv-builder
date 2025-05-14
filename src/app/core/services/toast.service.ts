import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  
  public toasts = this.toastsSignal.asReadonly();
  
  show(
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info', 
    duration: number = 3000
  ): void {
    const id = Math.random().toString(36).substring(2, 9);
    
    this.toastsSignal.update(toasts => [
      ...toasts,
      { id, message, type, duration }
    ]);
    
    setTimeout(() => this.remove(id), duration);
  }
  
  remove(id: string): void {
    this.toastsSignal.update(toasts => toasts.filter(toast => toast.id !== id));
  }
}