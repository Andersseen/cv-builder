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
import { Education } from "../../../domain/models/cv.model";
import { createDefaultEducation } from "../../../domain/models/cv.defaults";

@Component({
  selector: "app-education-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-white">Education</h2>
        <button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Education" }}
        </button>
      </div>

      @if (showForm()) {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="space-y-4 bg-slate-700/30 rounded-xl p-5 border border-slate-600/50"
        >
          <h3 class="text-sm font-medium text-slate-300">
            {{ editingId() ? "Edit Education" : "New Education" }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5"
                >Degree *</label
              >
              <input
                type="text"
                formControlName="degree"
                class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                       placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5"
                >Institution *</label
              >
              <input
                type="text"
                formControlName="institution"
                class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                       placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="MIT"
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
                placeholder="Cambridge, MA"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5"
                >Graduation Date *</label
              >
              <input
                type="month"
                formControlName="graduationDate"
                class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5"
                >GPA</label
              >
              <input
                type="text"
                formControlName="gpa"
                class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                       placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="3.8 / 4.0"
              />
            </div>
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

      <div class="space-y-3">
        @for (edu of items(); track edu.id) {
          <div
            class="p-4 bg-slate-700/30 border border-slate-600/50 rounded-xl group
                      hover:border-blue-500/30 transition-all duration-200"
          >
            <div class="flex justify-between items-start">
              <div class="cursor-pointer flex-grow" (click)="edit(edu)">
                <h3
                  class="font-semibold text-white group-hover:text-blue-400 transition-colors"
                >
                  {{ edu.degree }}
                </h3>
                <p class="text-slate-400 text-sm">
                  {{ edu.institution
                  }}{{ edu.location ? " — " + edu.location : "" }}
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  {{ formatDate(edu.graduationDate) }}
                  {{ edu.gpa ? " · GPA: " + edu.gpa : "" }}
                </p>
              </div>
              <div
                class="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  (click)="edit(edu)"
                  class="px-2.5 py-1 text-xs text-blue-400 hover:bg-blue-500/15 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  (click)="remove(edu.id)"
                  class="px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/15 rounded-md transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        }
        @if (items().length === 0) {
          <p class="text-slate-500 text-sm text-center py-6">
            No education added yet.
          </p>
        }
      </div>
    </div>
  `,
})
export class EducationFormComponent {
  items = input.required<Education[]>();
  itemsChange = output<Education[]>();

  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = new FormGroup({
    id: new FormControl("", { nonNullable: true }),
    degree: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    institution: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    location: new FormControl("", { nonNullable: true }),
    graduationDate: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    gpa: new FormControl("", { nonNullable: true }),
  });

  toggleForm() {
    if (this.showForm()) {
      this.cancelEdit();
    } else {
      this.startNew();
    }
  }

  startNew() {
    this.editingId.set(null);
    const defaults = createDefaultEducation();
    this.form.reset({ id: defaults.id });
    this.showForm.set(true);
  }

  edit(edu: Education) {
    this.editingId.set(edu.id);
    this.form.patchValue(edu);
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

    const value = this.form.getRawValue() as Education;

    if (this.editingId()) {
      const updated = this.items().map((edu) =>
        edu.id === this.editingId() ? value : edu,
      );
      this.itemsChange.emit(updated);
    } else {
      this.itemsChange.emit([...this.items(), value]);
    }
    this.cancelEdit();
  }

  remove(id: string) {
    if (confirm("Delete this education entry?")) {
      this.itemsChange.emit(this.items().filter((edu) => edu.id !== id));
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
