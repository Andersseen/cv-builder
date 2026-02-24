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
import { Skill, SkillLevel } from "../../../domain/models/cv.model";
import { createDefaultSkill } from "../../../domain/models/cv.defaults";

@Component({
  selector: "app-skills-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-white">Skills</h2>
        <button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Skill" }}
        </button>
      </div>

      @if (showForm()) {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="space-y-4 bg-slate-700/30 rounded-xl p-5 border border-slate-600/50"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5"
                >Skill Name *</label
              >
              <input
                type="text"
                formControlName="name"
                class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                       placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="TypeScript, React, Docker..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5"
                >Level *</label
              >
              <select
                formControlName="level"
                class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                @for (level of levels; track level) {
                  <option [value]="level">{{ level }}</option>
                }
              </select>
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

      <!-- Skills grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        @for (skill of items(); track skill.id) {
          <div
            class="p-3 bg-slate-700/30 border border-slate-600/50 rounded-xl group
                      hover:border-blue-500/30 transition-all duration-200 flex justify-between items-center"
          >
            <div class="cursor-pointer flex-grow" (click)="edit(skill)">
              <p
                class="font-medium text-white group-hover:text-blue-400 transition-colors text-sm"
              >
                {{ skill.name }}
              </p>
              <p class="text-xs text-slate-500">{{ skill.level }}</p>
            </div>
            <div
              class="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                (click)="edit(skill)"
                class="px-2 py-1 text-xs text-blue-400 hover:bg-blue-500/15 rounded-md transition-colors"
              >
                Edit
              </button>
              <button
                (click)="remove(skill.id)"
                class="px-2 py-1 text-xs text-red-400 hover:bg-red-500/15 rounded-md transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        }
      </div>
      @if (items().length === 0) {
        <p class="text-slate-500 text-sm text-center py-6">
          No skills added yet.
        </p>
      }
    </div>
  `,
})
export class SkillsFormComponent {
  items = input.required<Skill[]>();
  itemsChange = output<Skill[]>();

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
    if (this.showForm()) {
      this.cancelEdit();
    } else {
      this.startNew();
    }
  }

  startNew() {
    this.editingId.set(null);
    const defaults = createDefaultSkill();
    this.form.reset({ id: defaults.id, level: "Beginner" });
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
      const updated = this.items().map((s) =>
        s.id === this.editingId() ? value : s,
      );
      this.itemsChange.emit(updated);
    } else {
      this.itemsChange.emit([...this.items(), value]);
    }
    this.cancelEdit();
  }

  remove(id: string) {
    this.itemsChange.emit(this.items().filter((s) => s.id !== id));
    if (this.editingId() === id) this.cancelEdit();
  }
}
