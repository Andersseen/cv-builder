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
import { CommonModule } from "@angular/common";
import { Experience } from "../../../domain/models/cv.model";
import { createDefaultExperience } from "../../../domain/models/cv.defaults";

@Component({
  selector: "app-experience-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-foreground">Work Experience</h2>
        <button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-secondary text-secondary-foreground hover:bg-surface-hover'
              : 'bg-primary text-primary-foreground hover:bg-primary-700'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Experience" }}
        </button>
      </div>

      <!-- Form -->
      @if (showForm()) {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="space-y-4 bg-surface-alt rounded-xl p-5 border border-border"
        >
          <h3 class="text-sm font-medium text-muted-foreground">
            {{ editingId() ? "Edit Experience" : "New Experience" }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Job Title *</label
              >
              <input
                type="text"
                formControlName="jobTitle"
                class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-foreground
                       placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Company *</label
              >
              <input
                type="text"
                formControlName="company"
                class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-foreground
                       placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Tech Corp"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Location</label
              >
              <input
                type="text"
                formControlName="location"
                class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-foreground
                       placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Start Date *</label
              >
              <input
                type="month"
                formControlName="startDate"
                class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-foreground
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div>
              @if (!form.controls.current.value) {
                <label
                  class="block text-sm font-medium text-foreground/80 mb-1.5"
                  >End Date</label
                >
                <input
                  type="month"
                  formControlName="endDate"
                  class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              }
              <label class="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  formControlName="current"
                  class="w-4 h-4 rounded border-border text-primary focus:ring-ring bg-surface"
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
            <textarea
              formControlName="description"
              rows="3"
              class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-foreground
                     placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Key responsibilities and achievements..."
            ></textarea>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              (click)="cancelEdit()"
              class="px-4 py-2 text-sm text-secondary-foreground bg-secondary rounded-lg hover:bg-surface-hover transition-colors"
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

      <!-- List -->
      <div class="space-y-3">
        @for (exp of items(); track exp.id) {
          <div
            class="p-4 bg-surface-alt border border-border rounded-xl group
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
                <button
                  (click)="edit(exp)"
                  class="px-2.5 py-1 text-xs text-primary hover:bg-primary/15 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  (click)="remove(exp.id)"
                  class="px-2.5 py-1 text-xs text-danger hover:bg-danger/15 rounded-md transition-colors"
                >
                  Remove
                </button>
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
export class ExperienceFormComponent {
  items = input.required<Experience[]>();
  itemsChange = output<Experience[]>();

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
    this.form.controls.current.valueChanges.subscribe((isCurrent) => {
      if (isCurrent) {
        this.form.controls.endDate.setValue("");
        this.form.controls.endDate.disable();
      } else {
        this.form.controls.endDate.enable();
      }
    });
  }

  toggleForm() {
    this.showForm() ? this.cancelEdit() : this.startNew();
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
    if (confirm("Delete this experience?")) {
      this.itemsChange.emit(this.items().filter((e) => e.id !== id));
      if (this.editingId() === id) this.cancelEdit();
    }
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
