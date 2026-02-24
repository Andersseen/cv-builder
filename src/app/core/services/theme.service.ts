import { Injectable, signal, effect } from "@angular/core";

const THEME_KEY = "cv-builder-theme";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private darkModeSignal = signal<boolean>(false);

  public darkMode = this.darkModeSignal.asReadonly();

  constructor() {
    effect(() => {
      this.updateTheme(this.darkModeSignal());
      try {
        localStorage.setItem(THEME_KEY, JSON.stringify(this.darkModeSignal()));
      } catch {
        /* quota exceeded or private browsing */
      }
    });
  }

  initialize(): void {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved !== null) {
        this.darkModeSignal.set(JSON.parse(saved));
        return;
      }
    } catch {
      /* ignore */
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    this.darkModeSignal.set(prefersDark);
  }

  toggleDarkMode(): void {
    this.darkModeSignal.update((current) => !current);
  }

  setDarkMode(isDark: boolean): void {
    this.darkModeSignal.set(isDark);
  }

  private updateTheme(isDark: boolean): void {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }
}
