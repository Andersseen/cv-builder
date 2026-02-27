import { Component,
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

import { Education } from "../../../domain/models/cv-model";
import { createDefaultEducation  } from "../../../domain/models/cv-defaults";

@Component({
  selector: "app-education-form",
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-foreground">Education</h2>
        <button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-secondary text-secondary-foreground hover:bg-surface-hover'
              : 'bg-primary text-primary-foreground hover:bg-primary-700'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Education" }}
        </button>
      </div>

      @if (showForm()) {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="space-y-4 bg-surface-alt rounded-xl p-5 border border-border"
        >
          <h3 class="text-sm font-medium text-muted-foreground">
            {{ editingId() ? "Edit Education" : "New Education" }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Degree *</label
              >
              <input
                type="text"
                formControlName="degree"
                class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-foreground
                       placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Institution *</label
              >
              <input
                type="text"
                formControlName="institution"
                class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-foreground
                       placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="MIT"
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
                placeholder="Cambridge, MA"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Graduation Date *</label
              >
              <input
                type="month"
                formControlName="graduationDate"
                class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-foreground
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >GPA</label
              >
              <input
                type="text"
                formControlName="gpa"
                class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-foreground
                       placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="3.8 / 4.0"
              />
            </div>
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

      <div class="space-y-3">
        @for (edu of items(); track edu.id) {
          <div
            class="p-4 bg-surface-alt border border-border rounded-xl group
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
                <button
                  (click)="edit(edu)"
                  class="px-2.5 py-1 text-xs text-primary hover:bg-primary/15 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  (click)="remove(edu.id)"
                  class="px-2.5 py-1 text-xs text-danger hover:bg-danger/15 rounded-md transition-colors"
                >
                  Remove
                </button>
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
    this.showForm() ? this.cancelEdit() : this.startNew();
  }
  startNew() {
    this.editingId.set(null);
    this.form.reset({ id: createDefaultEducation().id });
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
      this.itemsChange.emit(
        this.items().map((e) => (e.id === this.editingId() ? value : e)),
      );
    } else {
      this.itemsChange.emit([...this.items(), value]);
    }
    this.cancelEdit();
  }
  remove(id: string) {
    if (confirm("Delete this education entry?")) {
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
