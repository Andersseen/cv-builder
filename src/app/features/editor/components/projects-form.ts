import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { FormField, form, required } from "@angular/forms/signals";
import { VoltButton, VoltInput, VoltTextarea } from "@voltui/components";

import { Project } from "../../../domain/models/cv-model";
import { createDefaultProject } from "../../../domain/models/cv-defaults";
import { moveItem } from "../../../core/utils/array";

@Component({
  selector: "app-projects-form",
  imports: [FormField, VoltButton, VoltInput, VoltTextarea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-foreground">Projects</h2>
        <volt-button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-secondary text-secondary-foreground hover:bg-accent'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Project" }}
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
                >Project Name *</label
              >
              <volt-input
                type="text"
                [formField]="projectForm.name"
                class="input-field"
                placeholder="Portfolio Website"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >URL</label
              >
              <volt-input
                type="text"
                [formField]="projectForm.url"
                class="input-field"
                placeholder="https://github.com/you/project"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Technologies</label
            >
            <volt-input
              type="text"
              [formField]="projectForm.technologies"
              class="input-field"
              placeholder="Angular, TypeScript, Tailwind"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Description</label
            >
            <volt-textarea
              [formField]="projectForm.description"
              [rows]="3"
              class="input-field-resize-none"
              placeholder="What the project does and your role..."
            ></volt-textarea>
            <p class="text-xs text-muted-foreground mt-1.5">
              Supports <code>**bold**</code>, <code>*italic*</code>, and
              <code>-</code> bullet lines.
            </p>
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
              [disabled]="projectForm().invalid()"
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
                  (click)="edit(proj)"
                  class="px-2.5 py-1 text-xs text-primary hover:bg-primary/15 rounded-md transition-colors"
                >
                  Edit
                </volt-button>
                <volt-button
                  (click)="remove(proj.id)"
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
  readonly removed = output<Project>();

  protected readonly showForm = signal(false);
  protected readonly editingId = signal<string | null>(null);

  /** The edit buffer. Never the same object as an entry in `items()`. */
  private readonly draft = signal<Project>(createDefaultProject());

  protected readonly projectForm = form(this.draft, (proj) => {
    required(proj.name);
  });

  protected toggleForm(): void {
    if (this.showForm()) this.cancelEdit();
    else this.startNew();
  }

  protected startNew(): void {
    this.editingId.set(null);
    this.projectForm().reset(createDefaultProject());
    this.showForm.set(true);
  }

  protected edit(entry: Project): void {
    this.editingId.set(entry.id);
    this.projectForm().reset({ ...entry });
    this.showForm.set(true);
  }

  protected cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.projectForm().reset(createDefaultProject());
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.projectForm().invalid()) {
      this.projectForm().markAsTouched();
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
}
