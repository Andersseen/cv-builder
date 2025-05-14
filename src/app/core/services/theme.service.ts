import { Injectable, signal, effect } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

const THEME_KEY = 'cv-builder-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSignal = signal<boolean>(false);
  
  public darkMode = this.darkModeSignal.asReadonly();
  
  constructor(private localStorageService: LocalStorageService) {
    effect(() => {
      this.updateTheme(this.darkModeSignal());
      this.localStorageService.setItem(THEME_KEY, this.darkModeSignal());
    });
  }
  
  initialize(): void {
    // First check if theme is saved in localStorage
    const savedTheme = this.localStorageService.getItem<boolean>(THEME_KEY);
    
    if (savedTheme !== null) {
      this.darkModeSignal.set(savedTheme);
    } else {
      // If not in localStorage, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkModeSignal.set(prefersDark);
    }
  }
  
  toggleDarkMode(): void {
    this.darkModeSignal.update(current => !current);
  }
  
  setDarkMode(isDark: boolean): void {
    this.darkModeSignal.set(isDark);
  }
  
  private updateTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}