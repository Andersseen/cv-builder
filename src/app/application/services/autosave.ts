import { Component, Injectable, signal, inject  } from "@angular/core";
import { CvStore } from "../state/cv";
import { Cv } from "../../domain/models/cv-model";

/**
 * Watches the active CV and persists changes to IndexedDB
 * after a debounce period (800ms of inactivity).
 *
 * Tracks the last-saved timestamp for UI display.
 */
@Injectable({ providedIn: "root" })
export class Autosave {
  private readonly DEBOUNCE_MS = 800;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private lastSnapshot: string | null = null;

  private readonly _lastSavedAt = signal<Date | null>(null);
  readonly lastSavedAt = this._lastSavedAt.asReadonly();

  private readonly _saving = signal(false);
  readonly saving = this._saving.asReadonly();

  private readonly cvStore = inject(CvStore);

  scheduleAutosave(cv: Cv): void {
    const snapshot = JSON.stringify(cv);

    // Skip if nothing changed
    if (snapshot === this.lastSnapshot) return;

    // Clear previous timer
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
    }

    this.timerId = setTimeout(async () => {
      this._saving.set(true);
      try {
        await this.cvStore.persist(cv);
        this.lastSnapshot = snapshot;
        this._lastSavedAt.set(new Date());
      } finally {
        this._saving.set(false);
      }
    }, this.DEBOUNCE_MS);
  }

  /** Clean up any pending timer. */
  destroy(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
