import {
  Component,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

import {
  Language,
  LanguageProficiency,
} from "../../../domain/models/cv-model";
import { createDefaultLanguage } from "../../../domain/models/cv-defaults";
import { moveItem } from "../../../core/utils/array";

@Component({
  selector: "app-languages-form",
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-foreground">Languages</h2>
        <button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-secondary text-secondary-foreground hover:bg-accent'
              : 'bg-primary text-primary-foreground hover:bg-primary-700'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Language" }}
        </button>
      </div>

      @if (showForm()) {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="space-y-4 bg-muted rounded-xl p-5 border border-border"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Language *</label
              >
              <input
                type="text"
                formControlName="name"
                class="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground
                       placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Spanish, English, German..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Proficiency *</label
              >
              <select
                formControlName="proficiency"
                class="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                @for (level of levels; track level) {
                  <option [value]="level">{{ level }}</option>
                }
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              (click)="cancelEdit()"
              class="px-4 py-2 text-sm text-secondary-foreground bg-secondary rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="form.invalid"
              class="px-4 py-2 text-sm text-accent-foreground bg-accent rounded-lg hover:bg-accent/90
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ editingId() ? "Update" : "Add" }}
            </button>
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
              <p class="text-xs text-muted-foreground">{{ lang.proficiency }}</p>
            </div>
            <div
              class="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                type="button"
                (click)="move(i, 'up')"
                [disabled]="i === 0"
                title="Move up"
                class="px-2 py-1 text-xs text-muted-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↑
              </button>
              <button
                type="button"
                (click)="move(i, 'down')"
                [disabled]="i === items().length - 1"
                title="Move down"
                class="px-2 py-1 text-xs text-muted-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↓
              </button>
              <button
                (click)="remove(lang.id)"
                class="px-2 py-1 text-xs text-destructive hover:bg-destructive/15 rounded-md transition-colors"
              >
                ✕
              </button>
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
  showForm = signal(false);
  editingId = signal<string | null>(null);
  readonly levels: LanguageProficiency[] = [
    "Basic",
    "Conversational",
    "Professional",
    "Fluent",
    "Native",
  ];

  form = new FormGroup({
    id: new FormControl("", { nonNullable: true }),
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    proficiency: new FormControl<LanguageProficiency>("Professional", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  toggleForm() {
    if (this.showForm()) this.cancelEdit();
    else this.startNew();
  }
  startNew() {
    this.editingId.set(null);
    this.form.reset({ id: createDefaultLanguage().id, proficiency: "Professional" });
    this.showForm.set(true);
  }
  edit(lang: Language) {
    this.editingId.set(lang.id);
    this.form.patchValue(lang);
    this.showForm.set(true);
  }
  cancelEdit() {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset();
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue() as Language;
    if (this.editingId()) {
      this.itemsChange.emit(
        this.items().map((l) => (l.id === this.editingId() ? value : l)),
      );
    } else {
      this.itemsChange.emit([...this.items(), value]);
    }
    this.cancelEdit();
  }
  remove(id: string) {
    this.itemsChange.emit(this.items().filter((l) => l.id !== id));
    if (this.editingId() === id) this.cancelEdit();
  }
  move(index: number, direction: "up" | "down") {
    this.itemsChange.emit(moveItem(this.items(), index, direction));
  }
}
