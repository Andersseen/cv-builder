import { Component, inject, effect, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { ThemeService } from "./core/services/theme.service";
import { ToastComponent } from "./shared/components/toast/toast.component";
import { ToastService } from "./core/services/toast.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ToastComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
      <app-toast />
    </div>
  `,
})
export class AppComponent {
  private themeService = inject(ThemeService);
  private toastService = inject(ToastService);

  constructor() {
    // Initialize theme from localStorage
    this.themeService.initialize();
  }
}
