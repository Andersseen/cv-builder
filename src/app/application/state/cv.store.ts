import { Injectable, signal, computed, inject } from "@angular/core";
import { Cv, DeepPartial } from "../../domain/models/cv.model";
import { createDefaultCv } from "../../domain/models/cv.defaults";
import { CvRepository } from "../../infrastructure/persistence/cv.repository";
import { ToastService } from "../../core/services/toast.service";

/**
 * Central application state for CVs.
 * Uses Angular Signals for reactivity.
 *
 * Responsibilities:
 *   - Holds in-memory list of CVs + active CV id
 *   - Provides computed selectors (activeCv, loading)
 *   - Orchestrates CRUD via CvRepository
 *   - Does NOT handle autosave (see AutosaveService)
 */
@Injectable({ providedIn: "root" })
export class CvStore {
  private readonly repo = inject(CvRepository);
  private readonly toastService = inject(ToastService);

  // ─── Private state ────────────────────────────────────────
  private readonly _cvs = signal<Cv[]>([]);
  private readonly _activeCvId = signal<string | null>(null);
  private readonly _loading = signal(false);

  // ─── Public selectors ─────────────────────────────────────
  readonly cvs = this._cvs.asReadonly();
  readonly activeCvId = this._activeCvId.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly activeCv = computed<Cv | null>(() => {
    const id = this._activeCvId();
    if (!id) return null;
    return this._cvs().find((cv) => cv.id === id) ?? null;
  });

  // ─── Initialization ───────────────────────────────────────

  /** Load all CVs from IndexedDB into memory. Call once on app/page init. */
  async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const cvs = await this.repo.getAll();
      // Backfill settings added after initial schema
      const migrated = cvs.map((cv) => ({
        ...cv,
        settings: {
          ...cv.settings,
          backgroundColor: cv.settings.backgroundColor ?? "#ffffff",
          primaryColor: cv.settings.primaryColor ?? "#111827",
        },
      }));
      this._cvs.set(migrated);
    } finally {
      this._loading.set(false);
    }
  }

  // ─── Commands ─────────────────────────────────────────────

  /** Create a new CV and persist it. */
  async create(name?: string): Promise<Cv> {
    const cv = createDefaultCv(name ? { name } : undefined);
    await this.repo.save(cv);
    this._cvs.update((cvs) => [cv, ...cvs]);
    this._activeCvId.set(cv.id);
    this.toastService.show("Resume created", "success");
    return cv;
  }

  /** Duplicate an existing CV. */
  async duplicate(id: string): Promise<Cv | null> {
    const source = this._cvs().find((cv) => cv.id === id);
    if (!source) return null;

    const now = new Date().toISOString();
    const copy: Cv = {
      ...structuredClone(source),
      id: crypto.randomUUID(),
      name: `${source.name} (copy)`,
      createdAt: now,
      updatedAt: now,
    };
    await this.repo.save(copy);
    this._cvs.update((cvs) => [copy, ...cvs]);
    this.toastService.show("Resume duplicated", "success");
    return copy;
  }

  /** Set the active CV by ID. */
  setActive(id: string): void {
    this._activeCvId.set(id);
  }

  /** Rename a CV. */
  async rename(id: string, name: string): Promise<void> {
    this._cvs.update((cvs) =>
      cvs.map((cv) =>
        cv.id === id
          ? { ...cv, name, updatedAt: new Date().toISOString() }
          : cv,
      ),
    );
    const updated = this._cvs().find((cv) => cv.id === id);
    if (updated) await this.repo.save(updated);
  }

  /**
   * Update the currently active CV with a partial patch.
   * This is the main method used by the editor forms.
   * Does NOT persist — AutosaveService handles that.
   */
  updateActiveCv(patch: DeepPartial<Cv>): void {
    const id = this._activeCvId();
    if (!id) return;

    this._cvs.update((cvs) =>
      cvs.map((cv) => {
        if (cv.id !== id) return cv;
        return deepMerge(cv, {
          ...patch,
          updatedAt: new Date().toISOString(),
        } as DeepPartial<Cv>);
      }),
    );
  }

  /** Persist a specific CV to IndexedDB. Called by AutosaveService. */
  async persist(cv: Cv): Promise<void> {
    await this.repo.save(cv);
  }

  /** Delete a CV by ID. */
  async deleteById(id: string): Promise<void> {
    await this.repo.delete(id);
    this._cvs.update((cvs) => cvs.filter((cv) => cv.id !== id));

    // If we deleted the active CV, switch to the first remaining
    if (this._activeCvId() === id) {
      const remaining = this._cvs();
      this._activeCvId.set(remaining.length > 0 ? remaining[0].id : null);
    }

    this.toastService.show("Resume deleted", "success");
  }
}

// ─── Deep merge utility ──────────────────────────────────────

type DeepPartialObj<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartialObj<T[P]> : T[P];
};

function deepMerge<T extends object>(target: T, source: DeepPartialObj<T>): T {
  const result = { ...target };

  for (const key of Object.keys(source) as (keyof T)[]) {
    const sourceVal = source[key];
    const targetVal = target[key];

    if (
      sourceVal &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === "object" &&
      !Array.isArray(targetVal)
    ) {
      (result as Record<string, unknown>)[key as string] = deepMerge(
        targetVal as object,
        sourceVal as DeepPartialObj<object>,
      );
    } else {
      (result as Record<string, unknown>)[key as string] = sourceVal;
    }
  }

  return result;
}
