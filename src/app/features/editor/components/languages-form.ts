import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { FormField, form, required } from "@angular/forms/signals";
import { VoltButton, VoltInput, VoltNativeSelect } from "@voltui/components";

import { Language, LanguageProficiency } from "../../../domain/models/cv-model";
import { createDefaultLanguage } from "../../../domain/models/cv-defaults";
import { moveItem } from "../../../core/utils/array";

@Component({
  selector: "app-languages-form",
  imports: [FormField, VoltButton, VoltInput, VoltNativeSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-foreground">Languages</h2>
        <volt-button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-secondary text-secondary-foreground hover:bg-accent'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Language" }}
        </volt-button>
      </div>

      @if (showForm()) {
        <form
          (submit)="onSubmit($event)"
          class="space-y-4 bg-muted rounded-xl p-5 border border-border"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Language *</label
              >
              <volt-input
                type="text"
                [formField]="languageForm.name"
                class="input-field"
                placeholder="Spanish, English, German..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Proficiency *</label
              >
              <select voltNativeSelect [formField]="languageForm.proficiency">
                @for (level of levels; track level) {
                  <option [value]="level">{{ level }}</option>
                }
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <volt-button
              type="button"
              (click)="cancelEdit()"
              class="px-4 py-2 text-sm text-secondary-foreground bg-secondary rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </volt-button>
            <volt-button
              type="submit"
              [disabled]="languageForm().invalid()"
              class="px-4 py-2 text-sm text-accent-foreground bg-accent rounded-lg hover:bg-accent/90
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ editingId() ? "Update" : "Add" }}
            </volt-button>
          </div>
        </form>
      }

      <!-- Languages grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        @for (lang of items(); track lang.id; let i = $index) {
          <div
            class="p-3 bg-muted border border-border rounded-xl group
                      hover:border-primary/30 transition-all duration-200 flex justify-between items-center"
          >
            <div class="cursor-pointer flex-grow" (click)="edit(lang)">
              <p
                class="font-medium text-foreground group-hover:text-primary transition-colors text-sm"
              >
                {{ lang.name }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ lang.proficiency }}
              </p>
            </div>
            <div
              class="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <volt-button
                type="button"
                (click)="move(i, 'up')"
                [disabled]="i === 0"
                title="Move up"
                class="px-2 py-1 text-xs text-muted-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↑
              </volt-button>
              <volt-button
                type="button"
                (click)="move(i, 'down')"
                [disabled]="i === items().length - 1"
                title="Move down"
                class="px-2 py-1 text-xs text-muted-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↓
              </volt-button>
              <volt-button
                (click)="remove(lang.id)"
                class="px-2 py-1 text-xs text-destructive hover:bg-destructive/15 rounded-md transition-colors"
              >
                ✕
              </volt-button>
            </div>
          </div>
        }
      </div>
      @if (items().length === 0) {
        <p class="text-muted-foreground text-sm text-center py-6">
          No languages added yet.
        </p>
      }
    </div>
  `,
})
export class LanguagesForm {
  readonly items = input.required<Language[]>();
  readonly itemsChange = output<Language[]>();
  readonly removed = output<Language>();

  protected readonly showForm = signal(false);
  protected readonly editingId = signal<string | null>(null);

  protected readonly levels: LanguageProficiency[] = [
    "Basic",
    "Conversational",
    "Professional",
    "Fluent",
    "Native",
  ];

  /** The edit buffer. Never the same object as an entry in `items()`. */
  private readonly draft = signal<Language>(createDefaultLanguage());

  protected readonly languageForm = form(this.draft, (lang) => {
    required(lang.name);
    required(lang.proficiency);
  });

  protected toggleForm(): void {
    if (this.showForm()) this.cancelEdit();
    else this.startNew();
  }

  protected startNew(): void {
    this.editingId.set(null);
    this.languageForm().reset(createDefaultLanguage());
    this.showForm.set(true);
  }

  protected edit(lang: Language): void {
    this.editingId.set(lang.id);
    this.languageForm().reset({ ...lang });
    this.showForm.set(true);
  }

  protected cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.languageForm().reset(createDefaultLanguage());
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.languageForm().invalid()) {
      this.languageForm().markAsTouched();
      return;
    }

    const value = { ...this.draft() };
    const editingId = this.editingId();

    this.itemsChange.emit(
      editingId
        ? this.items().map((l) => (l.id === editingId ? value : l))
        : [...this.items(), value],
    );
    this.cancelEdit();
  }

  protected remove(id: string): void {
    const removed = this.items().find((l) => l.id === id);
    if (!removed) return;
    this.itemsChange.emit(this.items().filter((l) => l.id !== id));
    this.removed.emit(removed);
    if (this.editingId() === id) this.cancelEdit();
  }

  protected move(index: number, direction: "up" | "down"): void {
    this.itemsChange.emit(moveItem(this.items(), index, direction));
  }
}
