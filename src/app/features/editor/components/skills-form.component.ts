import { Component, signal } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ResumeService } from "../services/resume.service";
import { SkillForm } from "../interfaces/resume-forms.interface";
import { Skill } from "../interfaces/resume.interface";

@Component({
  selector: "app-skills-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Skills</h2>
        <button
          (click)="toggleAddForm()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {{
            showForm() ? "Cancel" : editingId() ? "Cancel Edit" : "Add Skill"
          }}
        </button>
      </div>

      <!-- Add/Edit Skill Form -->
      @if (showForm()) {
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <h3 class="text-md font-medium text-gray-700 mb-2">
            {{ editingId() ? "Edit Skill" : "New Skill" }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Skill Name *</label
              >
              <input
                type="text"
                formControlName="name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="JavaScript"
              />
              <div
                *ngIf="form.controls.name.touched && form.controls.name.invalid"
                class="text-red-500 text-xs mt-1"
              >
                Skill Name is required
              </div>
            </div>

            <!-- Level -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Proficiency Level *</label
              >
              <select
                formControlName="level"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <div
                *ngIf="
                  form.controls.level.touched && form.controls.level.invalid
                "
                class="text-red-500 text-xs mt-1"
              >
                Level is required
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              (click)="cancelEdit()"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="form.invalid"
            >
              {{ editingId() ? "Update Skill" : "Add Skill" }}
            </button>
          </div>
        </form>
      }

      <!-- Skills List -->
      <div class="space-y-2">
        @for (skill of resumeService.resume().skills; track skill.id) {
          <div
            class="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200 group"
          >
            <div
              class="flex items-center space-x-4 cursor-pointer flex-grow"
              (click)="editSkill(skill)"
            >
              <span
                class="font-medium text-gray-800 group-hover:text-blue-600"
                >{{ skill.name }}</span
              >
              <span
                class="px-2 py-1 text-xs rounded-full"
                [class]="getSkillLevelClass(skill.level)"
              >
                {{ skill.level }}
              </span>
            </div>
            <div class="flex space-x-2">
              <button
                (click)="editSkill(skill)"
                class="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
              >
                Edit
              </button>
              <button
                (click)="removeSkill(skill.id)"
                class="text-red-600 hover:text-red-800 transition-colors duration-200 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        }
        @if (resumeService.resume().skills.length === 0) {
          <p class="text-gray-500 text-center py-8">No skills added yet.</p>
        }
      </div>
    </div>
  `,
})
export class SkillsFormComponent {
  showForm = signal(false);
  editingId = signal<string | null>(null);

  form: FormGroup<SkillForm>;

  constructor(public resumeService: ResumeService) {
    this.form = new FormGroup<SkillForm>({
      id: new FormControl("", { nonNullable: true }),
      name: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      level: new FormControl("Intermediate", {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  toggleAddForm() {
    if (this.showForm()) {
      this.cancelEdit();
    } else {
      this.startNew();
    }
  }

  startNew() {
    this.editingId.set(null);
    this.form.reset({
      id: this.resumeService.generateId(),
      level: "Intermediate",
    });
    this.showForm.set(true);
  }

  editSkill(skill: Skill) {
    this.editingId.set(skill.id);
    this.form.patchValue(skill);
    this.showForm.set(true);
  }

  cancelEdit() {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset({ level: "Intermediate" });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const skill: Skill = {
        ...formValue,
        id: this.editingId() || formValue.id || this.resumeService.generateId(),
      };

      if (this.editingId()) {
        this.resumeService.updateSkill(this.editingId()!, skill);
      } else {
        this.resumeService.addSkill(skill);
      }
      this.cancelEdit();
    } else {
      this.form.markAllAsTouched();
    }
  }

  removeSkill(id: string) {
    if (confirm("Are you sure you want to delete this skill?")) {
      this.resumeService.removeSkill(id);
      if (this.editingId() === id) {
        this.cancelEdit();
      }
    }
  }

  getSkillLevelClass(level: string): string {
    const classes = {
      Beginner: "bg-yellow-100 text-yellow-800",
      Intermediate: "bg-blue-100 text-blue-800",
      Advanced: "bg-green-100 text-green-800",
      Expert: "bg-purple-100 text-purple-800",
    };
    return (
      classes[level as keyof typeof classes] || "bg-gray-100 text-gray-800"
    );
  }
}
