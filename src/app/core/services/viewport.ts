import { Injectable, signal, effect, inject, DestroyRef } from "@angular/core";

/**
 * Viewport breakpoints used by the app.
 * Matches Tailwind v4 defaults.
 */
const BREAKPOINTS = {
  lg: 1024,
} as const;

/**
 * Reactive viewport dimensions.
 *
 * Provides signals for `isMobile` (<lg) and raw `width`/`height` so the UI
 * can adapt without media-query-only CSS when JavaScript logic needs to know
 * the breakpoint (e.g. opening a mobile overlay vs a desktop panel).
 */
@Injectable({ providedIn: "root" })
export class Viewport {
  private readonly destroyRef = inject(DestroyRef);

  readonly width = signal(0);
  readonly height = signal(0);
  readonly isMobile = signal(false);

  constructor() {
    this.updateDimensions();

    const listener = () => this.updateDimensions();
    window.addEventListener("resize", listener);
    this.destroyRef.onDestroy(() =>
      window.removeEventListener("resize", listener),
    );

    // Keep isMobile in sync with width.
    effect(() => {
      this.isMobile.set(this.width() < BREAKPOINTS.lg);
    });
  }

  private updateDimensions(): void {
    this.width.set(window.innerWidth);
    this.height.set(window.innerHeight);
  }
}
