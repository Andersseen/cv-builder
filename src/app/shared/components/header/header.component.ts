import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ThemeService } from "../../../core/services/theme.service";

@Component({
  selector: "app-header",
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div
        class="container mx-auto px-4 py-4 flex items-center justify-between"
      >
        <div class="flex items-center">
          <a
            routerLink="/"
            class="text-2xl font-display font-bold text-primary-600 dark:text-primary-400"
          >
            CV Builder
          </a>
        </div>

        <nav class="hidden md:flex items-center space-x-6">
          <a
            routerLink="/"
            routerLinkActive="text-primary-600 dark:text-primary-400"
            [routerLinkActiveOptions]="{ exact: true }"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Home
          </a>

          <a
            routerLink="/dashboard"
            routerLinkActive="text-primary-600 dark:text-primary-400"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            My Resumes
          </a>
        </nav>

        <div class="flex items-center space-x-3">
          <button
            (click)="themeService.toggleDarkMode()"
            class="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span class="sr-only">Toggle dark mode</span>
            @if (themeService.darkMode()) {
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

          <a
            routerLink="/dashboard"
            class="hidden sm:inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Resume
          </a>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          (click)="toggleMobileMenu()"
        >
          <span class="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      @if (mobileMenuOpen) {
        <div
          class="md:hidden bg-white dark:bg-gray-800 shadow-md pb-2 animate-slide-down"
        >
          <nav class="px-4 pt-2 pb-3 space-y-1">
            <a
              routerLink="/"
              routerLinkActive="text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700"
              [routerLinkActiveOptions]="{ exact: true }"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              (click)="mobileMenuOpen = false"
            >
              Home
            </a>
            <a
              routerLink="/dashboard"
              routerLinkActive="text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-700"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              (click)="mobileMenuOpen = false"
            >
              My Resumes
            </a>
          </nav>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
