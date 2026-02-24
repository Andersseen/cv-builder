import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CvStore } from "../../application/state/cv.store";
import { Cv } from "../../domain/models/cv.model";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      <div class="max-w-6xl mx-auto px-4 py-12">
        <!-- Header -->
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
        >
          <div>
            <h1 class="text-3xl font-bold text-white mb-1">My Resumes</h1>
            <p class="text-slate-400 text-sm">
              Create, manage, and export your resumes
            </p>
          </div>
          <button
            (click)="createNew()"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold
                   transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40
                   flex items-center gap-2"
          >
            <span class="text-lg">+</span> New Resume
          </button>
        </div>

        <!-- Loading -->
        @if (cvStore.loading()) {
          <div class="flex items-center justify-center py-24">
            <div
              class="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"
            ></div>
          </div>
        }

        <!-- Empty state -->
        @if (!cvStore.loading() && cvStore.cvs().length === 0) {
          <div class="text-center py-24">
            <div
              class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-700/50 flex items-center justify-center"
            >
              <span class="text-3xl">📄</span>
            </div>
            <h2 class="text-xl font-semibold text-white mb-2">
              No resumes yet
            </h2>
            <p class="text-slate-400 mb-8 max-w-md mx-auto">
              Create your first resume and start building your professional
              profile.
            </p>
            <button
              (click)="createNew()"
              class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold
                     transition-all duration-200 shadow-lg shadow-blue-600/25"
            >
              Create Your First Resume
            </button>
          </div>
        }

        <!-- CV Grid -->
        @if (!cvStore.loading() && cvStore.cvs().length > 0) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (cv of cvStore.cvs(); track cv.id) {
              <div
                class="group relative bg-slate-800/60 backdrop-blur-sm border border-slate-700/50
                       rounded-2xl overflow-hidden transition-all duration-300
                       hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                <!-- Card preview area -->
                <div
                  class="h-40 bg-gradient-to-br from-slate-700/40 to-slate-800/40 flex items-center
                         justify-center cursor-pointer relative"
                  (click)="openEditor(cv.id)"
                >
                  <div class="text-center">
                    <div class="text-4xl mb-2 opacity-40">📝</div>
                    <span
                      class="text-xs text-slate-500 uppercase tracking-wider font-medium"
                    >
                      {{ cv.templateId }} template
                    </span>
                  </div>

                  <!-- Hover overlay -->
                  <div
                    class="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100
                              transition-opacity duration-300 flex items-center justify-center"
                  >
                    <span
                      class="text-white font-semibold bg-blue-600 px-4 py-2 rounded-lg
                                 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300
                                 transform translate-y-2 group-hover:translate-y-0"
                    >
                      Open Editor
                    </span>
                  </div>
                </div>

                <!-- Card info -->
                <div class="p-5">
                  <!-- Editable name -->
                  @if (editingId() === cv.id) {
                    <input
                      #nameInput
                      type="text"
                      [ngModel]="cv.name"
                      (ngModelChange)="onNameChange(cv.id, $event)"
                      (blur)="stopEditing()"
                      (keydown.enter)="stopEditing()"
                      (keydown.escape)="stopEditing()"
                      class="w-full bg-slate-700 text-white px-3 py-1.5 rounded-lg text-base font-semibold
                             outline-none ring-2 ring-blue-500 mb-2"
                    />
                  } @else {
                    <h3
                      class="text-base font-semibold text-white mb-2 truncate cursor-pointer
                             hover:text-blue-400 transition-colors"
                      (dblclick)="startEditing(cv.id)"
                      title="Double-click to rename"
                    >
                      {{ cv.name }}
                    </h3>
                  }

                  <p class="text-xs text-slate-500 mb-4">
                    Updated {{ formatDate(cv.updatedAt) }}
                  </p>

                  <!-- Actions -->
                  <div class="flex gap-2">
                    <button
                      (click)="openEditor(cv.id)"
                      class="flex-1 px-3 py-2 bg-blue-600/15 text-blue-400 text-sm font-medium
                             rounded-lg hover:bg-blue-600/25 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      (click)="duplicateCv(cv.id)"
                      class="px-3 py-2 bg-slate-700/50 text-slate-300 text-sm rounded-lg
                             hover:bg-slate-700 transition-colors"
                      title="Duplicate"
                    >
                      ⧉
                    </button>
                    <button
                      (click)="deleteCv(cv)"
                      class="px-3 py-2 bg-red-500/10 text-red-400 text-sm rounded-lg
                             hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export default class DashboardComponent implements OnInit {
  cvStore = inject(CvStore);
  private router = inject(Router);

  editingId = signal<string | null>(null);

  async ngOnInit() {
    await this.cvStore.loadAll();
  }

  async createNew() {
    const cv = await this.cvStore.create();
    this.openEditor(cv.id);
  }

  openEditor(id: string) {
    this.router.navigate(["/editor"], { queryParams: { cv: id } });
  }

  async duplicateCv(id: string) {
    await this.cvStore.duplicate(id);
  }

  async deleteCv(cv: Cv) {
    if (confirm(`Delete "${cv.name}"? This cannot be undone.`)) {
      await this.cvStore.deleteById(cv.id);
    }
  }

  startEditing(id: string) {
    this.editingId.set(id);
  }

  stopEditing() {
    this.editingId.set(null);
  }

  onNameChange(id: string, name: string) {
    this.cvStore.rename(id, name);
  }

  formatDate(isoString: string): string {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60_000);

    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}
