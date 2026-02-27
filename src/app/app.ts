import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Header } from "./shared/components/header/header";
import { Footer } from "./shared/components/footer/footer";
import { Theme } from "./core/services/theme";
import { Toast } from "./shared/components/toast/toast";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Header, Footer, Toast],
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
export class App {
  private theme = inject(Theme);

  constructor() {
    this.theme.initialize();
  }
}
