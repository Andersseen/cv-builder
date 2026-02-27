import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-footer",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <footer class="bg-card border-t border-border">
      <div class="container mx-auto max-w-7xl px-6 lg:px-8 py-10">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <!-- Brand + copyright -->
          <div class="flex flex-col items-center md:items-start gap-1">
            <a
              routerLink="/"
              class="text-lg font-display font-bold text-primary tracking-tight hover:opacity-80 transition-opacity"
            >
              CV Builder
            </a>
            <p class="text-muted-foreground-foreground text-xs">
              © {{ currentYear }} Modern CV Builder. All rights reserved.
            </p>
          </div>

          <!-- Links -->
          <div class="flex items-center gap-6">
            <a
              href="#"
              class="text-muted-foreground-foreground hover:text-foreground text-sm transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              class="text-muted-foreground-foreground hover:text-foreground text-sm transition-colors duration-200"
            >
              Terms
            </a>
            <a
              href="#"
              class="text-muted-foreground-foreground hover:text-foreground text-sm transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  currentYear = new Date().getFullYear();
}
