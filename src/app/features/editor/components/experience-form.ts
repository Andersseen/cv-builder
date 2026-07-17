import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { VoltButton, VoltInput, VoltTextarea } from "@voltui/components";

import { Experience } from "../../../domain/models/cv-model";
import { createDefaultExperience } from "../../../domain/models/cv-defaults";
import { moveItem } from "../../../core/utils/array";

@Component({
  selector: "app-experience-form",
  imports: [ReactiveFormsModule, VoltButton, VoltInput, VoltTextarea],
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

      <!-- Form -->
      @if (showForm()) {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
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
                formControlName="jobTitle"
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
                formControlName="company"
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
                formControlName="location"
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
                formControlName="startDate"
                class="input-field"
              />
            </div>
            <div>
              @if (!form.controls.current.value) {
                <label
                  class="block text-sm font-medium text-foreground/80 mb-1.5"
                  >End Date</label
                >
                <volt-input
                  type="month"
                  formControlName="endDate"
                  class="input-field"
                />
              }
              <label class="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  formControlName="current"
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
              formControlName="description"
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
              [disabled]="form.invalid"
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

  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = new FormGroup({
    id: new FormControl("", { nonNullable: true }),
    jobTitle: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    company: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    location: new FormControl("", { nonNullable: true }),
    startDate: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    endDate: new FormControl("", { nonNullable: true }),
    current: new FormControl(false, { nonNullable: true }),
    description: new FormControl("", { nonNullable: true }),
  });

  constructor() {
    this.form.controls.current.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((isCurrent) => {
        if (isCurrent) {
          this.form.controls.endDate.setValue("");
          this.form.controls.endDate.disable();
        } else {
          this.form.controls.endDate.enable();
        }
      });
  }

  toggleForm() {
    if (this.showForm()) this.cancelEdit();
    else this.startNew();
  }
  startNew() {
    this.editingId.set(null);
    this.form.reset({ id: createDefaultExperience().id, current: false });
    this.showForm.set(true);
  }
  edit(exp: Experience) {
    this.editingId.set(exp.id);
    this.form.patchValue(exp);
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
    const value = this.form.getRawValue() as Experience;
    if (this.editingId()) {
      this.itemsChange.emit(
        this.items().map((e) => (e.id === this.editingId() ? value : e)),
      );
    } else {
      this.itemsChange.emit([...this.items(), value]);
    }
    this.cancelEdit();
  }
  remove(id: string) {
    const removed = this.items().find((e) => e.id === id);
    if (!removed) return;
    this.itemsChange.emit(this.items().filter((e) => e.id !== id));
    this.removed.emit(removed);
    if (this.editingId() === id) this.cancelEdit();
  }
  move(index: number, direction: "up" | "down") {
    this.itemsChange.emit(moveItem(this.items(), index, direction));
  }
  formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }
}
