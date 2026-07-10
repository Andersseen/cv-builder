import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { VoltButton, buttonVariants } from "@voltui/components";
import { LmnSunIcon } from "lumen-icons/sun";
import { LmnMoonIcon } from "lumen-icons/moon";
import { LmnMenuIcon } from "lumen-icons/menu";
import { Theme } from "../../../core/services/theme";

@Component({
  selector: "app-header",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    VoltButton,
    LmnSunIcon,
    LmnMoonIcon,
    LmnMenuIcon,
  ],
  template: `
    <header
      class="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50 transition-colors duration-300"
    >
      <div
        class="container mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <!-- Logo -->
        <a
          routerLink="/"
          class="text-xl font-display font-bold text-primary tracking-tight hover:opacity-80 transition-opacity"
        >
          CV Builder
        </a>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-1">
          <a
            routerLink="/"
            routerLinkActive="text-primary bg-primary/10 font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            class="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
          >
            Home
          </a>
          <a
            routerLink="/dashboard"
            routerLinkActive="text-primary bg-primary/10 font-semibold"
            class="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
          >
            My Resumes
          </a>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Theme toggle -->
          <volt-button
            variant="ghost"
            size="icon"
            (click)="theme.toggleDarkMode()"
          >
            @if (theme.darkMode()) {
              <lmn-sun [size]="20" ariaLabel="Switch to light mode" />
            } @else {
              <lmn-moon [size]="20" ariaLabel="Switch to dark mode" />
            }
          </volt-button>

          <!-- CTA -->
          <a routerLink="/dashboard" [class]="ctaClasses"> Create Resume </a>

          <!-- Mobile hamburger -->
          <div class="md:hidden">
            <volt-button
              variant="ghost"
              size="icon"
              (click)="toggleMobileMenu()"
            >
              <lmn-menu [size]="20" ariaLabel="Open menu" />
            </volt-button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden border-t border-border bg-card animate-slide-up">
          <nav class="px-6 py-3 space-y-1">
            <a
              routerLink="/"
              routerLinkActive="text-primary bg-primary/10 font-semibold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="block px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-all duration-300"
              (click)="mobileMenuOpen.set(false)"
            >
              Home
            </a>
            <a
              routerLink="/dashboard"
              routerLinkActive="text-primary bg-primary/10 font-semibold"
              class="block px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-all duration-300"
              (click)="mobileMenuOpen.set(false)"
            >
              My Resumes
            </a>
          </nav>
        </div>
      }
    </header>
  `,
})
export class Header {
  readonly theme = inject(Theme);
  readonly mobileMenuOpen = signal(false);

  // Style the routed CTA anchor with volt's button recipe (shadcn "asChild"
  // pattern) so it matches volt-button while keeping router-link semantics.
  protected readonly ctaClasses =
    buttonVariants({ variant: "solid", size: "md" }) + " hidden sm:inline-flex";

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }
}
