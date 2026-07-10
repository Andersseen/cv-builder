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

import { Project } from "../../../domain/models/cv-model";
import { createDefaultProject } from "../../../domain/models/cv-defaults";
import { moveItem } from "../../../core/utils/array";

@Component({
  selector: "app-projects-form",
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-foreground">Projects</h2>
        <button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-secondary text-secondary-foreground hover:bg-accent'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Project" }}
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
                >Project Name *</label
              >
              <input
                type="text"
                formControlName="name"
                class="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground
                       placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Portfolio Website"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >URL</label
              >
              <input
                type="text"
                formControlName="url"
                class="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground
                       placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="https://github.com/you/project"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Technologies</label
            >
            <input
              type="text"
              formControlName="technologies"
              class="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground
                     placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Angular, TypeScript, Tailwind"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Description</label
            >
            <textarea
              formControlName="description"
              rows="3"
              class="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground
                     placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="What the project does and your role..."
            ></textarea>
            <p class="text-xs text-muted-foreground mt-1.5">
              Supports <code>**bold**</code>, <code>*italic*</code>, and
              <code>-</code> bullet lines.
            </p>
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

      <!-- List -->
      <div class="space-y-3">
        @for (proj of items(); track proj.id; let i = $index) {
          <div
            class="p-4 bg-muted border border-border rounded-xl group
                      hover:border-primary/30 transition-all duration-200"
          >
            <div class="flex justify-between items-start">
              <div class="cursor-pointer flex-grow" (click)="edit(proj)">
                <h3
                  class="font-semibold text-foreground group-hover:text-primary transition-colors"
                >
                  {{ proj.name }}
                </h3>
                @if (proj.technologies) {
                  <p class="text-muted-foreground text-sm">
                    {{ proj.technologies }}
                  </p>
                }
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
                  (click)="edit(proj)"
                  class="px-2.5 py-1 text-xs text-primary hover:bg-primary/15 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  (click)="remove(proj.id)"
                  class="px-2.5 py-1 text-xs text-destructive hover:bg-destructive/15 rounded-md transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        }
        @if (items().length === 0) {
          <p class="text-muted-foreground text-sm text-center py-6">
            No projects added yet.
          </p>
        }
      </div>
    </div>
  `,
})
export class ProjectsForm {
  readonly items = input.required<Project[]>();
  readonly itemsChange = output<Project[]>();

  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = new FormGroup({
    id: new FormControl("", { nonNullable: true }),
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    url: new FormControl("", { nonNullable: true }),
    technologies: new FormControl("", { nonNullable: true }),
    description: new FormControl("", { nonNullable: true }),
  });

  toggleForm() {
    if (this.showForm()) this.cancelEdit();
    else this.startNew();
  }
  startNew() {
    this.editingId.set(null);
    this.form.reset({ id: createDefaultProject().id });
    this.showForm.set(true);
  }
  edit(proj: Project) {
    this.editingId.set(proj.id);
    this.form.patchValue(proj);
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
    const value = this.form.getRawValue() as Project;
    if (this.editingId()) {
      this.itemsChange.emit(
        this.items().map((p) => (p.id === this.editingId() ? value : p)),
      );
    } else {
      this.itemsChange.emit([...this.items(), value]);
    }
    this.cancelEdit();
  }
  remove(id: string) {
    this.itemsChange.emit(this.items().filter((p) => p.id !== id));
    if (this.editingId() === id) this.cancelEdit();
  }
  move(index: number, direction: "up" | "down") {
    this.itemsChange.emit(moveItem(this.items(), index, direction));
  }
}
