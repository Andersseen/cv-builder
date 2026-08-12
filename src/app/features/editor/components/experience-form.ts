import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { FormField, disabled, form, required } from "@angular/forms/signals";
import { VoltButton, VoltInput, VoltTextarea } from "@voltui/components";

import { Experience } from "../../../domain/models/cv-model";
import { createDefaultExperience } from "../../../domain/models/cv-defaults";
import { moveItem } from "../../../core/utils/array";

/**
 * Work-experience editor.
 *
 * Unlike personal info, this is a *draft* editor: `draft` is a private edit
 * buffer that never touches `items()` until the user submits. Cancelling
 * discards it, so a stored entry is only ever replaced by an explicit Update.
 */
@Component({
  selector: "app-experience-form",
  imports: [FormField, VoltButton, VoltInput, VoltTextarea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-foreground">Work Experience</h2>
        <volt-button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-secondary text-secondary-foreground hover:bg-accent'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Experience" }}
        </volt-button>
      </div>

      <!-- Draft -->
      @if (showForm()) {
        <form
          (submit)="onSubmit($event)"
          class="space-y-4 bg-muted rounded-xl p-5 border border-border"
        >
          <h3 class="text-sm font-medium text-muted-foreground">
            {{ editingId() ? "Edit Experience" : "New Experience" }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Job Title *</label
              >
              <volt-input
                type="text"
                [formField]="experienceForm.jobTitle"
                class="input-field"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Company *</label
              >
              <volt-input
                type="text"
                [formField]="experienceForm.company"
                class="input-field"
                placeholder="Tech Corp"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Location</label
              >
              <volt-input
                type="text"
                [formField]="experienceForm.location"
                class="input-field"
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Start Date *</label
              >
              <volt-input
                type="month"
                [formField]="experienceForm.startDate"
                class="input-field"
              />
            </div>
            <div>
              <!-- An end date is not applicable while the role is current, so
                   the schema disables it and the field drops out of the form. -->
              @if (!experienceForm.endDate().disabled()) {
                <label
                  class="block text-sm font-medium text-foreground/80 mb-1.5"
                  >End Date</label
                >
                <volt-input
                  type="month"
                  [formField]="experienceForm.endDate"
                  class="input-field"
                />
              }
              <label class="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  [formField]="experienceForm.current"
                  class="w-4 h-4 rounded border-border text-primary focus:ring-ring bg-card"
                />
                <span class="text-sm text-foreground/80"
                  >Currently working here</span
                >
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Description</label
            >
            <volt-textarea
              [formField]="experienceForm.description"
              [rows]="3"
              class="input-field-resize-none"
              placeholder="Key responsibilities and achievements..."
            ></volt-textarea>
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
              [disabled]="experienceForm().invalid()"
              class="px-4 py-2 text-sm text-accent-foreground bg-accent rounded-lg hover:bg-accent/90
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ editingId() ? "Update" : "Add" }}
            </volt-button>
          </div>
        </form>
      }

      <!-- List -->
      <div class="space-y-3">
        @for (exp of items(); track exp.id; let i = $index) {
          <div
            class="p-4 bg-muted border border-border rounded-xl group
                      hover:border-primary/30 transition-all duration-200"
          >
            <div class="flex justify-between items-start">
              <div class="cursor-pointer flex-grow" (click)="edit(exp)">
                <h3
                  class="font-semibold text-foreground group-hover:text-primary transition-colors"
                >
                  {{ exp.jobTitle }}
                </h3>
                <p class="text-muted-foreground text-sm">
                  {{ exp.company
                  }}{{ exp.location ? " — " + exp.location : "" }}
                </p>
                <p class="text-xs text-muted-foreground/70 mt-1">
                  {{ formatDate(exp.startDate) }} –
                  {{ exp.current ? "Present" : formatDate(exp.endDate) }}
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
                  (click)="edit(exp)"
                  class="px-2.5 py-1 text-xs text-primary hover:bg-primary/15 rounded-md transition-colors"
                >
                  Edit
                </volt-button>
                <volt-button
                  (click)="remove(exp.id)"
                  class="px-2.5 py-1 text-xs text-destructive hover:bg-destructive/15 rounded-md transition-colors"
                >
                  Remove
                </volt-button>
              </div>
            </div>
            @if (exp.description) {
              <p class="text-muted-foreground text-sm mt-2 whitespace-pre-wrap">
                {{ exp.description }}
              </p>
            }
          </div>
        }
        @if (items().length === 0) {
          <p class="text-muted-foreground text-sm text-center py-6">
            No work experience added yet.
          </p>
        }
      </div>
    </div>
  `,
})
export class ExperienceForm {
  readonly items = input.required<Experience[]>();
  readonly itemsChange = output<Experience[]>();
  readonly removed = output<Experience>();

  protected readonly showForm = signal(false);
  protected readonly editingId = signal<string | null>(null);

  /** The edit buffer. Never the same object as an entry in `items()`. */
  private readonly draft = signal<Experience>(createDefaultExperience());

  protected readonly experienceForm = form(this.draft, (exp) => {
    required(exp.jobTitle);
    required(exp.company);
    required(exp.startDate);
    disabled(exp.endDate, ({ valueOf }) => valueOf(exp.current));
  });

  protected toggleForm(): void {
    if (this.showForm()) this.cancelEdit();
    else this.startNew();
  }

  protected startNew(): void {
    this.editingId.set(null);
    this.experienceForm().reset(createDefaultExperience());
    this.showForm.set(true);
  }

  protected edit(exp: Experience): void {
    this.editingId.set(exp.id);
    // Copy, so typing in the draft cannot reach the stored entry.
    this.experienceForm().reset({ ...exp });
    this.showForm.set(true);
  }

  protected cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.experienceForm().reset(createDefaultExperience());
  }

  /**
   * Submission stays explicit and synchronous: the "action" is a local array
   * update, so Signal Forms' async `submit()` API would only add a Promise
   * round-trip. The native submit event is stopped here instead of relying on
   * a form-level directive.
   */
  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.experienceForm().invalid()) {
      this.experienceForm().markAsTouched();
      return;
    }

    const value = this.normalize(this.draft());
    const editingId = this.editingId();

    this.itemsChange.emit(
      editingId
        ? this.items().map((e) => (e.id === editingId ? value : e))
        : [...this.items(), value],
    );
    this.cancelEdit();
  }

  /**
   * A current role has no end date. The draft keeps whatever the user typed —
   * so un-ticking the box brings it back — but the saved entry must not carry
   * a stale one.
   */
  private normalize(exp: Experience): Experience {
    return exp.current ? { ...exp, endDate: "" } : { ...exp };
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
