import {
  Component,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Cv } from "../../../domain/models/cv.model";

@Component({
  selector: "app-cv-card",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="group relative bg-surface border border-border
             rounded-2xl overflow-hidden transition-all duration-300
             hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
    >
      <!-- Card preview area -->
      <div
        class="h-40 bg-surface-alt flex items-center
               justify-center cursor-pointer relative"
        (click)="edit.emit(cv().id)"
      >
        <div class="text-center">
          <div class="text-4xl mb-2 opacity-40">📝</div>
          <span
            class="text-xs text-muted-foreground uppercase tracking-wider font-medium"
          >
            {{ cv().templateId }} template
          </span>
        </div>

        <!-- Hover overlay -->
        <div
          class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 flex items-center justify-center"
        >
          <span
            class="text-primary-foreground font-semibold bg-primary px-4 py-2 rounded-lg
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
        @if (isEditing()) {
          <input
            #nameInput
            type="text"
            [value]="cv().name"
            (input)="onNameInput($event)"
            (blur)="isEditing.set(false)"
            (keydown.enter)="isEditing.set(false)"
            (keydown.escape)="isEditing.set(false)"
            class="w-full bg-surface-hover text-foreground px-3 py-1.5 rounded-lg text-base font-semibold
                   outline-none ring-2 ring-primary mb-2"
          />
        } @else {
          <h3
            class="text-base font-semibold text-foreground mb-2 truncate cursor-pointer
                   hover:text-primary transition-colors"
            (dblclick)="isEditing.set(true)"
            title="Double-click to rename"
          >
            {{ cv().name }}
          </h3>
        }

        <p class="text-xs text-muted-foreground mb-4">
          Updated {{ formatDate(cv().updatedAt) }}
        </p>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            (click)="edit.emit(cv().id)"
            class="flex-1 px-3 py-2 bg-primary/15 text-primary text-sm font-medium
                   rounded-lg hover:bg-primary/25 transition-colors"
          >
            Edit
          </button>
          <button
            (click)="duplicate.emit(cv().id)"
            class="px-3 py-2 bg-secondary text-secondary-foreground text-sm rounded-lg
                   hover:bg-surface-hover transition-colors"
            title="Duplicate"
          >
            ⧉
          </button>
          <button
            (click)="delete.emit(cv())"
            class="px-3 py-2 bg-danger/10 text-danger text-sm rounded-lg
                   hover:bg-danger/20 transition-colors"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CvCardComponent {
  readonly cv = input.required<Cv>();

  readonly edit = output<string>();
  readonly duplicate = output<string>();
  readonly delete = output<Cv>();
  readonly renamed = output<{ id: string; name: string }>();

  isEditing = signal(false);

  onNameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.renamed.emit({ id: this.cv().id, name: value });
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
