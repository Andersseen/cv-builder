import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ResumeService } from "../services/resume.service";
import { Skill } from "../interfaces/resume.interface";

@Component({
  selector: "app-skills-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Skills</h2>
        <button
          (click)="toggleAddForm()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {{ showAddForm() ? "Cancel" : "Add Skill" }}
        </button>
      </div>

      <!-- Add Skill Form -->
      @if (showAddForm()) {
      <form
        (ngSubmit)="addSkill()"
        class="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Skill Name *</label
            >
            <input
              type="text"
              [(ngModel)]="newSkill().name"
              name="name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="JavaScript"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Proficiency Level *</label
            >
            <select
              [(ngModel)]="newSkill().level"
              name="level"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          Add Skill
        </button>
      </form>
      }

      <!-- Skills List -->
      <div class="space-y-2">
        @for (skill of resumeService.resume().skills; track skill.id) {
        <div
          class="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <span class="font-medium text-gray-800">{{ skill.name }}</span>
            <span
              class="px-2 py-1 text-xs rounded-full"
              [class]="getSkillLevelClass(skill.level)"
            >
              {{ skill.level }}
            </span>
          </div>
          <button
            (click)="removeSkill(skill.id)"
            class="text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            Remove
          </button>
        </div>
        } @if (resumeService.resume().skills.length === 0) {
        <p class="text-gray-500 text-center py-8">No skills added yet.</p>
        }
      </div>
    </div>
  `,
})
export class SkillsFormComponent {
  showAddForm = signal(false);
  newSkill = signal<Skill>({
    id: "",
    name: "",
    level: "Intermediate",
  });

  constructor(public resumeService: ResumeService) {}

  toggleAddForm() {
    this.showAddForm.update((show) => !show);
    if (!this.showAddForm()) {
      this.resetForm();
    }
  }

  addSkill() {
    const skill = {
      ...this.newSkill(),
      id: this.resumeService.generateId(),
    };
    this.resumeService.addSkill(skill);
    this.resetForm();
    this.showAddForm.set(false);
  }

  removeSkill(id: string) {
    this.resumeService.removeSkill(id);
  }

  resetForm() {
    this.newSkill.set({
      id: "",
      name: "",
      level: "Intermediate",
    });
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
