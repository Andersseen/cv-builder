import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { FormField, form, required } from "@angular/forms/signals";
import { VoltButton, VoltInput } from "@voltui/components";

import { Education } from "../../../domain/models/cv-model";
import { createDefaultEducation } from "../../../domain/models/cv-defaults";
import { moveItem } from "../../../core/utils/array";

@Component({
  selector: "app-education-form",
  imports: [FormField, VoltButton, VoltInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-foreground">Education</h2>
        <volt-button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-secondary text-secondary-foreground hover:bg-accent'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Education" }}
        </volt-button>
      </div>

      @if (showForm()) {
        <form
          (submit)="onSubmit($event)"
          class="space-y-4 bg-muted rounded-xl p-5 border border-border"
        >
          <h3 class="text-sm font-medium text-muted-foreground">
            {{ editingId() ? "Edit Education" : "New Education" }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Degree *</label
              >
              <volt-input
                type="text"
                [formField]="educationForm.degree"
                class="input-field"
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Institution *</label
              >
              <volt-input
                type="text"
                [formField]="educationForm.institution"
                class="input-field"
                placeholder="MIT"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Location</label
              >
              <volt-input
                type="text"
                [formField]="educationForm.location"
                class="input-field"
                placeholder="Cambridge, MA"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Graduation Date *</label
              >
              <volt-input
                type="month"
                [formField]="educationForm.graduationDate"
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >GPA</label
              >
              <volt-input
                type="text"
                [formField]="educationForm.gpa"
                class="input-field"
                placeholder="3.8 / 4.0"
              />
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
              [disabled]="educationForm().invalid()"
              class="px-4 py-2 text-sm text-accent-foreground bg-accent rounded-lg hover:bg-accent/90
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ editingId() ? "Update" : "Add" }}
            </volt-button>
          </div>
        </form>
      }

      <div class="space-y-3">
        @for (edu of items(); track edu.id; let i = $index) {
          <div
            class="p-4 bg-muted border border-border rounded-xl group
                      hover:border-primary/30 transition-all duration-200"
          >
            <div class="flex justify-between items-start">
              <div class="cursor-pointer flex-grow" (click)="edit(edu)">
                <h3
                  class="font-semibold text-foreground group-hover:text-primary transition-colors"
                >
                  {{ edu.degree }}
                </h3>
                <p class="text-muted-foreground text-sm">
                  {{ edu.institution
                  }}{{ edu.location ? " — " + edu.location : "" }}
                </p>
                <p class="text-xs text-muted-foreground/70 mt-1">
                  {{ formatDate(edu.graduationDate) }}
                  {{ edu.gpa ? " · GPA: " + edu.gpa : "" }}
                </p>
              </div>
              <div
                class="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                  (click)="edit(edu)"
                  class="px-2.5 py-1 text-xs text-primary hover:bg-primary/15 rounded-md transition-colors"
                >
                  Edit
                </volt-button>
                <volt-button
                  (click)="remove(edu.id)"
                  class="px-2.5 py-1 text-xs text-destructive hover:bg-destructive/15 rounded-md transition-colors"
                >
                  Remove
                </volt-button>
              </div>
            </div>
          </div>
        }
        @if (items().length === 0) {
          <p class="text-muted-foreground text-sm text-center py-6">
            No education added yet.
          </p>
        }
      </div>
    </div>
  `,
})
export class EducationForm {
  readonly items = input.required<Education[]>();
  readonly itemsChange = output<Education[]>();
  readonly removed = output<Education>();

  protected readonly showForm = signal(false);
  protected readonly editingId = signal<string | null>(null);

  /** The edit buffer. Never the same object as an entry in `items()`. */
  private readonly draft = signal<Education>(createDefaultEducation());

  protected readonly educationForm = form(this.draft, (edu) => {
    required(edu.degree);
    required(edu.institution);
    required(edu.graduationDate);
  });

  protected toggleForm(): void {
    if (this.showForm()) this.cancelEdit();
    else this.startNew();
  }

  protected startNew(): void {
    this.editingId.set(null);
    this.educationForm().reset(createDefaultEducation());
    this.showForm.set(true);
  }

  protected edit(entry: Education): void {
    this.editingId.set(entry.id);
    this.educationForm().reset({ ...entry });
    this.showForm.set(true);
  }

  protected cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.educationForm().reset(createDefaultEducation());
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.educationForm().invalid()) {
      this.educationForm().markAsTouched();
      return;
    }

    const value = { ...this.draft() };
    const editingId = this.editingId();

    this.itemsChange.emit(
      editingId
        ? this.items().map((e) => (e.id === editingId ? value : e))
        : [...this.items(), value],
    );
    this.cancelEdit();
  }

  protected remove(id: string): void {
    const removed = this.items().find((e) => e.id === id);
    if (!removed) return;
    this.itemsChange.emit(this.items().filter((e) => e.id !== id));
    this.removed.emit(removed);
    if (this.editingId() === id) this.cancelEdit();
  }

  protected move(index: number, direction: "up" | "down"): void {
    this.itemsChange.emit(moveItem(this.items(), index, direction));
  }

  protected formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }
}
