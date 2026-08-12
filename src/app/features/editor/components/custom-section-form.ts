import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  output,
} from "@angular/core";
import { FormField, form, required } from "@angular/forms/signals";
import { VoltButton, VoltInput } from "@voltui/components";

import { CustomItem, CustomSection } from "../../../domain/models/cv-model";
import { createDefaultCustomItem } from "../../../domain/models/cv-defaults";
import { moveItem } from "../../../core/utils/array";

/**
 * Custom-section editor: a section title plus a nested, reorderable list of
 * items.
 *
 * Like personal info this synchronises continuously rather than buffering a
 * draft, so `section` is a two-way `model()` and `form()` writes straight
 * through it. The whole `CustomSection` — title *and* items — is one typed
 * model: the nested item fields bind with `[formField]` exactly like top-level
 * ones, replacing the previous mix of a `FormGroup` for the title and a
 * hand-maintained `signal<CustomItem[]>` with manual `[value]`/`(input)`
 * plumbing.
 *
 * Structural edits (add / remove / reorder) are not field bindings, so they
 * still go through the array field's own value signal.
 */
@Component({
  selector: "app-custom-section-form",
  imports: [FormField, VoltButton, VoltInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-foreground">
          Edit Custom Section
        </h3>
        <button
          type="button"
          (click)="removed.emit()"
          class="text-sm text-destructive hover:text-destructive/80 transition-colors"
        >
          Delete section
        </button>
      </div>

      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-foreground/80 mb-1.5"
            >Section Title *</label
          >
          <volt-input
            type="text"
            [formField]="sectionForm.title"
            class="input-field"
            placeholder="Volunteering, Awards, Publications..."
          />
        </div>
      </form>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-medium text-foreground/80">Items</h4>
          <volt-button
            type="button"
            size="sm"
            (click)="addItem()"
            class="px-3 py-1.5 text-sm"
          >
            + Add Item
          </volt-button>
        </div>

        @for (item of items(); track item.id; let i = $index) {
          <div class="p-4 bg-muted border border-border rounded-xl space-y-3">
            <div class="flex items-start justify-between gap-2">
              <span class="text-xs font-medium text-muted-foreground"
                >#{{ i + 1 }}</span
              >
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  (click)="moveItem(i, 'up')"
                  [disabled]="i === 0"
                  class="p-1.5 text-xs text-muted-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-30"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  (click)="moveItem(i, 'down')"
                  [disabled]="i === items().length - 1"
                  class="p-1.5 text-xs text-muted-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  (click)="removeItem(i)"
                  class="p-1.5 text-xs text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  title="Delete item"
                >
                  ×
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-foreground/70 mb-1"
                  >Title</label
                >
                <input
                  type="text"
                  [formField]="sectionForm.items[i].title"
                  class="input-field"
                  placeholder="Award name / Project title"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-foreground/70 mb-1"
                  >Subtitle</label
                >
                <input
                  type="text"
                  [formField]="sectionForm.items[i].subtitle"
                  class="input-field"
                  placeholder="Issuer / Year / Organization"
                />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-foreground/70 mb-1"
                >Description</label
              >
              <textarea
                [formField]="sectionForm.items[i].description"
                rows="3"
                class="input-field-resize-none"
                placeholder="Supports **bold**, *italic*, and - bullet lines."
              ></textarea>
            </div>
          </div>
        }

        @if (items().length === 0) {
          <p class="text-sm text-muted-foreground text-center py-6">
            No items yet. Add one to get started.
          </p>
        }
      </div>
    </div>
  `,
})
export class CustomSectionForm {
  /**
   * Two-way bound custom section. The parent passes the store's value in and
   * receives every edit back through `sectionChange`.
   */
  readonly section = model.required<CustomSection>();
  readonly removed = output<void>();

  protected readonly sectionForm = form(this.section, (s) => {
    required(s.title);
  });

  /**
   * The item list as plain data, for `@for`.
   *
   * The template deliberately iterates this rather than the `sectionForm.items`
   * field tree. Tracking a `FieldTree` pulled out of an array field throws
   * NG01904 ("orphan field") as soon as an item is removed — the tracking
   * expression still evaluates against the field for the index that just
   * vanished. Tracking plain data by `id` and indexing back into
   * `sectionForm.items[i]` keeps DOM identity stable across add/remove/reorder.
   */
  protected readonly items = computed(() => this.sectionForm.items().value());

  protected addItem(): void {
    this.updateItems((items) => [...items, createDefaultCustomItem()]);
  }

  protected removeItem(index: number): void {
    this.updateItems((items) => items.filter((_, i) => i !== index));
  }

  protected moveItem(index: number, direction: "up" | "down"): void {
    this.updateItems((items) => moveItem(items, index, direction));
  }

  private updateItems(fn: (items: CustomItem[]) => CustomItem[]): void {
    this.sectionForm.items().value.update(fn);
  }
}
