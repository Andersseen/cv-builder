import { Injectable, signal, computed } from "@angular/core";
import { Cv } from "../../domain/models/cv-model";

/**
 * In-memory undo/redo history for the active CV.
 *
 * Keeps a stack of deep-cloned CV snapshots. Pushes are coalesced when they
 * happen within `COALESCE_MS` of the previous push, so rapid typing does not
 * create one history entry per keystroke. The stack is capped at `MAX_SIZE`.
 *
 * The history is intentionally ephemeral: it resets when the active CV changes
 * and is not persisted to IndexedDB.
 */
@Injectable({ providedIn: "root" })
export class History {
  private static readonly COALESCE_MS = 1000;
  private static readonly MAX_SIZE = 50;

  private readonly _stack = signal<Cv[]>([]);
  private readonly _pointer = signal(-1);
  private _lastPushTime = 0;

  readonly canUndo = computed(() => this._pointer() > 0);
  readonly canRedo = computed(
    () => this._pointer() < this._stack().length - 1,
  );

  /**
   * Record a snapshot of the current CV state.
   *
   * If the last push happened recently, the previous snapshot is replaced
   * instead of appending a new one.
   */
  push(cv: Cv): void {
    const now = Date.now();
    const snapshot = structuredClone(cv);
    const pointer = this._pointer();
    const stack = this._stack();

    const shouldCoalesce =
      pointer > 0 &&
      now - this._lastPushTime < History.COALESCE_MS &&
      pointer === stack.length - 1 &&
      stack.length > 0;

    if (shouldCoalesce) {
      const next = [...stack];
      next[pointer] = snapshot;
      this._stack.set(next);
    } else {
      const next = stack.slice(0, pointer + 1);
      next.push(snapshot);
      if (next.length > History.MAX_SIZE) {
        next.shift();
      }
      this._stack.set(next);
      this._pointer.set(next.length - 1);
    }

    this._lastPushTime = now;
  }

  /** Move one step back in history and return that snapshot, or null if none. */
  undo(): Cv | null {
    if (!this.canUndo()) return null;
    const nextPointer = this._pointer() - 1;
    this._pointer.set(nextPointer);
    return structuredClone(this._stack()[nextPointer]);
  }

  /** Move one step forward in history and return that snapshot, or null if none. */
  redo(): Cv | null {
    if (!this.canRedo()) return null;
    const nextPointer = this._pointer() + 1;
    this._pointer.set(nextPointer);
    return structuredClone(this._stack()[nextPointer]);
  }

  /**
   * Clear the history and optionally start a new stack with the given CV.
   * Called when the active CV changes.
   */
  reset(cv?: Cv): void {
    if (cv) {
      this._stack.set([structuredClone(cv)]);
      this._pointer.set(0);
    } else {
      this._stack.set([]);
      this._pointer.set(-1);
    }
    this._lastPushTime = 0;
  }
}
