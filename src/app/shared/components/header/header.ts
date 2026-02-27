import { Component,
  inject,
  signal,
  ChangeDetectionStrategy,
 } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Theme } from "../../../core/services/theme";

@Component({
  selector: "app-header",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
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
            routerLinkActive="text-foreground bg-card-alt"
            [routerLinkActiveOptions]="{ exact: true }"
            class="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground-foreground hover:text-foreground hover:bg-card-alt transition-all duration-200"
          >
            Home
          </a>
          <a
            routerLink="/dashboard"
            routerLinkActive="text-foreground bg-card-alt"
            class="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground-foreground hover:text-foreground hover:bg-card-alt transition-all duration-200"
          >
            My Resumes
          </a>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Theme toggle -->
          <button
            (click)="theme.toggleDarkMode()"
            class="relative p-2.5 rounded-xl text-muted-foreground-foreground hover:text-foreground hover:bg-card-alt transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            @if (theme.darkMode()) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clip-rule="evenodd"
                />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                />
              </svg>
            }
          </button>

          <!-- CTA -->
          <a
            routerLink="/dashboard"
            class="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold
                   shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 hover:brightness-110
                   transition-all duration-200"
          >
            Create Resume
          </a>

          <!-- Mobile hamburger -->
          <button
            class="md:hidden p-2 rounded-lg text-muted-foreground-foreground hover:text-foreground hover:bg-card-alt transition-all duration-200"
            (click)="toggleMobileMenu()"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileMenuOpen()) {
        <div
          class="md:hidden border-t border-border bg-card animate-slide-up"
        >
          <nav class="px-6 py-3 space-y-1">
            <a
              routerLink="/"
              routerLinkActive="text-primary bg-primary/5"
              [routerLinkActiveOptions]="{ exact: true }"
              class="block px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground-foreground hover:bg-card-alt transition-all"
              (click)="mobileMenuOpen.set(false)"
            >
              Home
            </a>
            <a
              routerLink="/dashboard"
              routerLinkActive="text-primary bg-primary/5"
              class="block px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground-foreground hover:bg-card-alt transition-all"
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

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }
}
