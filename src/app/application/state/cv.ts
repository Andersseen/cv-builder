import { Injectable, signal, computed, inject } from "@angular/core";
import { Cv, DeepPartial } from "../../domain/models/cv-model";
import { createDefaultCv } from "../../domain/models/cv-defaults";
import { migrateCv } from "../../domain/models/cv-migration";
import { LocalCvRepository } from "../../infrastructure/persistence/cv-repository";
import { CvPortability } from "../../infrastructure/portability/cv-portability";
import { ToastService } from "../../core/services/toast";
import { deepMerge } from "./deep-merge";
import { History } from "../services/history";

/**
 * Central application state for CVs.
 * Uses Angular Signals for reactivity.
 *
 * Responsibilities:
 *   - Holds in-memory list of CVs + active CV id
 *   - Provides computed selectors (activeCv, loading)
 *   - Orchestrates CRUD via Cv
 *   - Imports/exports portable JSON backups
 *   - Does NOT handle autosave (see Autosave)
 */
@Injectable({ providedIn: "root" })
export class CvStore {
  private readonly repo = inject(LocalCvRepository);
  private readonly toast = inject(ToastService);
  private readonly portability = inject(CvPortability);
  private readonly history = inject(History);

  private _applyingHistory = false;

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

  readonly canUndo = this.history.canUndo;
  readonly canRedo = this.history.canRedo;

  // ─── Initialization ───────────────────────────────────────

  /** Load all CVs from IndexedDB into memory. Call once on app/page init. */
  async loadAll(): Promise<void> {
    this._loading.set(true);
    const cvs = await this.withIndexedDbError(
      () => this.repo.getAll(),
      "Could not load your resumes. Browser storage may be unavailable.",
    );
    if (cvs !== null) {
      // Backfill fields added after the initial schema so CVs stored before
      // the change still load with a complete shape.
      const migrated = cvs
        .map((cv) => migrateCv(cv))
        .filter((cv): cv is Cv => cv !== null);
      this._cvs.set(migrated);
    }
    this._loading.set(false);
  }

  // ─── Commands ─────────────────────────────────────────────

  /** Create a new CV and persist it. */
  async create(name?: string): Promise<Cv | null> {
    const cv = createDefaultCv(name ? { name } : undefined);
    const saved = await this.withIndexedDbError(
      () => this.repo.save(cv),
      "Could not save the new resume. Storage may be full or disabled.",
    );
    if (saved === null) return null;

    this._cvs.update((cvs) => [cv, ...cvs]);
    this._activeCvId.set(cv.id);
    this.history.reset(cv);
    this.toast.show("Resume created", "success");
    this.requestStoragePersistence();
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
    const saved = await this.withIndexedDbError(
      () => this.repo.save(copy),
      "Could not duplicate the resume. Storage may be full or disabled.",
    );
    if (saved === null) return null;

    this._cvs.update((cvs) => [copy, ...cvs]);
    this.toast.show("Resume duplicated", "success");
    return copy;
  }

  /** Set the active CV by ID. */
  setActive(id: string): void {
    this._activeCvId.set(id);
    this.history.reset(this.activeCv() ?? undefined);
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
    if (!updated) return;

    await this.withIndexedDbError(
      () => this.repo.save(updated),
      "Could not save the new name. Storage may be full or disabled.",
    );
  }

  /**
   * Update the currently active CV with a partial patch.
   * This is the main method used by the editor forms.
   * Does NOT persist — Autosave handles that.
   */
  updateActiveCv(patch: DeepPartial<Cv>): void {
    const id = this._activeCvId();
    if (!id) return;

    const current = this.activeCv();
    if (current && !this._applyingHistory) {
      this.history.push(current);
    }

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

  /** Restore the previous snapshot from the in-memory history. */
  undo(): void {
    const snapshot = this.history.undo();
    if (snapshot) this.applySnapshot(snapshot);
  }

  /** Restore the next snapshot from the in-memory history. */
  redo(): void {
    const snapshot = this.history.redo();
    if (snapshot) this.applySnapshot(snapshot);
  }

  private applySnapshot(cv: Cv): void {
    this._applyingHistory = true;
    this._cvs.update((cvs) =>
      cvs.map((c) => (c.id === cv.id ? structuredClone(cv) : c)),
    );
    this._applyingHistory = false;
  }

  /** Persist a specific CV to IndexedDB. Called by Autosave. */
  async persist(cv: Cv): Promise<void> {
    await this.withIndexedDbError(
      () => this.repo.save(cv),
      "Could not autosave. Your latest changes may not persist after closing.",
    );
  }

  /** Delete a CV by ID. */
  async deleteById(id: string): Promise<void> {
    const deleted = await this.withIndexedDbError(
      () => this.repo.delete(id),
      "Could not delete the resume. Please try again.",
    );
    if (deleted === null) return;

    this._cvs.update((cvs) => cvs.filter((cv) => cv.id !== id));

    // If we deleted the active CV, switch to the first remaining
    if (this._activeCvId() === id) {
      const remaining = this._cvs();
      this._activeCvId.set(remaining.length > 0 ? remaining[0].id : null);
    }

    this.toast.show("Resume deleted", "success");
  }

  // ─── Portability ──────────────────────────────────────────

  /** Export a single CV as a downloadable `.cv.json` file. */
  exportCv(cv: Cv): void {
    this.portability.exportCv(cv);
    this.toast.show("CV exported", "success");
  }

  /** Export all CVs as a single downloadable backup file. */
  exportAll(): void {
    this.portability.exportAll(this._cvs());
    this.toast.show("Backup downloaded", "success");
  }

  /** Import a single CV from a `.cv.json` file. */
  async importCv(file: File): Promise<Cv | null> {
    const existingIds = new Set(this._cvs().map((cv) => cv.id));
    const result = await this.portability.importCv(file, existingIds);
    if (!result.success) {
      this.toast.show(result.error, "error");
      return null;
    }

    const saved = await this.withIndexedDbError(
      () => this.repo.save(result.cv),
      "Could not save the imported resume. Storage may be full or disabled.",
    );
    if (saved === null) return null;

    this._cvs.update((cvs) => [result.cv, ...cvs]);
    this.toast.show("CV imported", "success");
    return result.cv;
  }

  /** Import a full backup file and add all CVs to the store. */
  async importAll(file: File): Promise<number> {
    const existingIds = new Set(this._cvs().map((cv) => cv.id));
    const result = await this.portability.importAll(file, existingIds);
    if (!result.success) {
      this.toast.show(result.error, "error");
      return 0;
    }

    for (const cv of result.cvs) {
      const saved = await this.withIndexedDbError(
        () => this.repo.save(cv),
        `Could not save imported resume "${cv.name}".`,
      );
      if (saved === null) return 0;
    }

    this._cvs.update((cvs) => [...result.cvs, ...cvs]);
    this.toast.show(
      `${result.cvs.length} resume${result.cvs.length === 1 ? "" : "s"} restored from backup`,
      "success",
    );
    return result.cvs.length;
  }

  // ─── Private helpers ───────────────────────────────────────

  /**
   * Ask the browser to persist storage so IndexedDB is not cleared
   * automatically under storage pressure.
   */
  private requestStoragePersistence(): void {
    if (typeof navigator !== "undefined" && navigator.storage?.persist) {
      navigator.storage.persist().catch(() => {
        // Failure is non-fatal; the user can still use the app normally.
      });
    }
  }

  /**
   * Wrap an IndexedDB operation with a clear toast on failure.
   * Returns the operation result, or `null` if it failed.
   */
  private async withIndexedDbError<T>(
    operation: () => Promise<T>,
    errorMessage: string,
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (err) {
      console.error("IndexedDB error:", err);
      this.toast.show(errorMessage, "error");
      return null;
    }
  }
}
