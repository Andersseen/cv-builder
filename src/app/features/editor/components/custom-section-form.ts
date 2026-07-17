import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { VoltButton, VoltInput, VoltTextarea } from "@voltui/components";
import { CustomSection, CustomItem } from "../../../domain/models/cv-model";
import { moveItem } from "../../../core/utils/array";

@Component({
  selector: "app-custom-section-form",
  imports: [ReactiveFormsModule, VoltButton, VoltInput, VoltTextarea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-foreground">Edit Custom Section</h3>
        <button
          type="button"
          (click)="removed.emit()"
          class="text-sm text-destructive hover:text-destructive/80 transition-colors"
        >
          Delete section
        </button>
      </div>

      <form [formGroup]="form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-foreground/80 mb-1.5"
            >Section Title *</label
          >
          <volt-input
            type="text"
            formControlName="title"
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
          <div
            class="p-4 bg-muted border border-border rounded-xl space-y-3"
          >
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
                  [value]="item.title"
                  (input)="updateItem(i, 'title', $event)"
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
                  [value]="item.subtitle"
                  (input)="updateItem(i, 'subtitle', $event)"
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
                [value]="item.description"
                (input)="updateItem(i, 'description', $event)"
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
  readonly section = input.required<CustomSection>();
  readonly sectionChange = output<CustomSection>();
  readonly removed = output<void>();

  items = signal<CustomItem[]>([]);

  form = new FormGroup({
    title: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const section = this.section();
      this.form.patchValue({ title: section.title }, { emitEvent: false });
      this.items.set(section.items ?? []);
    });

    this.form.valueChanges.subscribe(() => {
      this.emitChange();
    });
  }

  addItem(): void {
    this.items.update((items) => [
      ...items,
      {
        id: crypto.randomUUID(),
        title: "",
        subtitle: "",
        description: "",
      },
    ]);
    this.emitChange();
  }

  removeItem(index: number): void {
    this.items.update((items) => items.filter((_, i) => i !== index));
    this.emitChange();
  }

  moveItem(index: number, direction: "up" | "down"): void {
    this.items.update((items) => moveItem(items, index, direction));
    this.emitChange();
  }

  updateItem(
    index: number,
    field: keyof CustomItem,
    event: Event,
  ): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.items.update((items) =>
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
    this.emitChange();
  }

  private emitChange(): void {
    this.sectionChange.emit({
      ...this.section(),
      title: this.form.value.title ?? "",
      items: this.items(),
    });
  }
}
