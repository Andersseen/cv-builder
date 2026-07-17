import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { VoltButton, VoltInput, VoltNativeSelect } from "@voltui/components";

import { Skill, SkillLevel } from "../../../domain/models/cv-model";
import { createDefaultSkill } from "../../../domain/models/cv-defaults";
import { moveItem } from "../../../core/utils/array";

@Component({
  selector: "app-skills-form",
  imports: [ReactiveFormsModule, VoltButton, VoltInput, VoltNativeSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-foreground">Skills</h2>
        <volt-button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-secondary text-secondary-foreground hover:bg-accent'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Skill" }}
        </volt-button>
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
                >Skill Name *</label
              >
              <volt-input
                type="text"
                formControlName="name"
                class="input-field"
                placeholder="TypeScript, React, Docker..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Level *</label
              >
              <volt-native-select
                formControlName="level"
                class="input-field"
              >
                @for (level of levels; track level) {
                  <option [value]="level">{{ level }}</option>
                }
              </volt-native-select>
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
              [disabled]="form.invalid"
              class="px-4 py-2 text-sm text-accent-foreground bg-accent rounded-lg hover:bg-accent/90
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ editingId() ? "Update" : "Add" }}
            </volt-button>
          </div>
        </form>
      }

      <!-- Skills grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        @for (skill of items(); track skill.id; let i = $index) {
          <div
            class="p-3 bg-muted border border-border rounded-xl group
                      hover:border-primary/30 transition-all duration-200 flex justify-between items-center"
          >
            <div class="cursor-pointer flex-grow" (click)="edit(skill)">
              <p
                class="font-medium text-foreground group-hover:text-primary transition-colors text-sm"
              >
                {{ skill.name }}
              </p>
              <p class="text-xs text-muted-foreground">{{ skill.level }}</p>
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
                (click)="edit(skill)"
                class="px-2 py-1 text-xs text-primary hover:bg-primary/15 rounded-md transition-colors"
              >
                Edit
              </volt-button>
              <volt-button
                (click)="remove(skill.id)"
                class="px-2 py-1 text-xs text-destructive hover:bg-destructive/15 rounded-md transition-colors"
              >
                ✕
              </volt-button>
            </div>
          </div>
        }
      </div>
      @if (items().length === 0) {
        <p class="text-muted-foreground text-sm text-center py-6">
          No skills added yet.
        </p>
      }
    </div>
  `,
})
export class SkillsForm {
  readonly items = input.required<Skill[]>();
  readonly itemsChange = output<Skill[]>();
  readonly removed = output<Skill>();
  showForm = signal(false);
  editingId = signal<string | null>(null);
  readonly levels: SkillLevel[] = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
  ];

  form = new FormGroup({
    id: new FormControl("", { nonNullable: true }),
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    level: new FormControl<SkillLevel>("Beginner", {
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
    this.form.reset({ id: createDefaultSkill().id, level: "Beginner" });
    this.showForm.set(true);
  }
  edit(skill: Skill) {
    this.editingId.set(skill.id);
    this.form.patchValue(skill);
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
    const value = this.form.getRawValue() as Skill;
    if (this.editingId()) {
      this.itemsChange.emit(
        this.items().map((s) => (s.id === this.editingId() ? value : s)),
      );
    } else {
      this.itemsChange.emit([...this.items(), value]);
    }
    this.cancelEdit();
  }
  remove(id: string) {
    const removed = this.items().find((s) => s.id === id);
    if (!removed) return;
    this.itemsChange.emit(this.items().filter((s) => s.id !== id));
    this.removed.emit(removed);
    if (this.editingId() === id) this.cancelEdit();
  }
  move(index: number, direction: "up" | "down") {
    this.itemsChange.emit(moveItem(this.items(), index, direction));
  }
}
