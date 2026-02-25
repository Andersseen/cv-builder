import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { ThemeService } from "./core/services/theme.service";
import { ToastComponent } from "./shared/components/toast/toast.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent],
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

  constructor() {
    this.themeService.initialize();
  }
}
