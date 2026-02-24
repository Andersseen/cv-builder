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
        <h2 class="text-lg font-semibold text-white">Work Experience</h2>
        <button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
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
          class="space-y-4 bg-slate-700/30 rounded-xl p-5 border border-slate-600/50"
        >
          <h3 class="text-sm font-medium text-slate-300">
            {{ editingId() ? "Edit Experience" : "New Experience" }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5"
                >Job Title *</label
              >
              <input
                type="text"
                formControlName="jobTitle"
                class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                       placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5"
                >Company *</label
              >
              <input
                type="text"
                formControlName="company"
                class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                       placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tech Corp"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5"
                >Location</label
              >
              <input
                type="text"
                formControlName="location"
                class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                       placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5"
                >Start Date *</label
              >
              <input
                type="month"
                formControlName="startDate"
                class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              @if (!form.controls.current.value) {
                <label class="block text-sm font-medium text-slate-300 mb-1.5"
                  >End Date</label
                >
                <input
                  type="month"
                  formControlName="endDate"
                  class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              }
              <label class="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  formControlName="current"
                  class="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-700"
                />
                <span class="text-sm text-slate-300"
                  >Currently working here</span
                >
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5"
              >Description</label
            >
            <textarea
              formControlName="description"
              rows="3"
              class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                     placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Key responsibilities and achievements..."
            ></textarea>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              (click)="cancelEdit()"
              class="px-4 py-2 text-sm text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="form.invalid"
              class="px-4 py-2 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700
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
            class="p-4 bg-slate-700/30 border border-slate-600/50 rounded-xl group
                      hover:border-blue-500/30 transition-all duration-200"
          >
            <div class="flex justify-between items-start">
              <div class="cursor-pointer flex-grow" (click)="edit(exp)">
                <h3
                  class="font-semibold text-white group-hover:text-blue-400 transition-colors"
                >
                  {{ exp.jobTitle }}
                </h3>
                <p class="text-slate-400 text-sm">
                  {{ exp.company
                  }}{{ exp.location ? " — " + exp.location : "" }}
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  {{ formatDate(exp.startDate) }} –
                  {{ exp.current ? "Present" : formatDate(exp.endDate) }}
                </p>
              </div>
              <div
                class="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  (click)="edit(exp)"
                  class="px-2.5 py-1 text-xs text-blue-400 hover:bg-blue-500/15 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  (click)="remove(exp.id)"
                  class="px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/15 rounded-md transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
            @if (exp.description) {
              <p class="text-slate-400 text-sm mt-2 whitespace-pre-wrap">
                {{ exp.description }}
              </p>
            }
          </div>
        }
        @if (items().length === 0) {
          <p class="text-slate-500 text-sm text-center py-6">
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
    if (this.showForm()) {
      this.cancelEdit();
    } else {
      this.startNew();
    }
  }

  startNew() {
    this.editingId.set(null);
    const defaults = createDefaultExperience();
    this.form.reset({ id: defaults.id, current: false });
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
      // Update existing
      const updated = this.items().map((exp) =>
        exp.id === this.editingId() ? value : exp,
      );
      this.itemsChange.emit(updated);
    } else {
      // Add new
      this.itemsChange.emit([...this.items(), value]);
    }
    this.cancelEdit();
  }

  remove(id: string) {
    if (confirm("Delete this experience?")) {
      this.itemsChange.emit(this.items().filter((exp) => exp.id !== id));
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
