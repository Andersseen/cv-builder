import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { VoltButton } from "@voltui/components";
import { LmnDocumentDuplicateIcon } from "lumen-icons/document-duplicate";
import { LmnTrashIcon } from "lumen-icons/trash";
import { MoveHoverDirective } from "angular-movement";
import { Cv } from "../../../domain/models/cv-model";

@Component({
  selector: "app-cv-card",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    VoltButton,
    LmnDocumentDuplicateIcon,
    LmnTrashIcon,
    MoveHoverDirective,
  ],
  template: `
    <div
      moveWhileHover="pulse"
      class="group relative bg-card border border-border
             rounded-xl overflow-hidden transition-all duration-300
             hover:border-primary/40 shadow-sm hover:shadow-glass"
    >
      <!-- Card preview area -->
      <div
        class="h-40 bg-muted/50 flex items-center
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
            class="w-full bg-background/50 backdrop-blur-sm text-foreground px-3.5 py-2 rounded-xl text-base font-semibold
                   outline-none ring-2 ring-primary shadow-inner mb-2 transition-all duration-300"
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
        <div class="grid grid-cols-[1fr_auto_auto] gap-2">
          <volt-button size="sm" class="w-full" (click)="edit.emit(cv().id)">
            Edit
          </volt-button>
          <volt-button
            variant="outline"
            size="icon"
            (click)="duplicate.emit(cv().id)"
          >
            <lmn-document-duplicate [size]="16" ariaLabel="Duplicate" />
          </volt-button>
          <volt-button
            variant="ghost"
            size="icon"
            class="text-destructive hover:bg-destructive/10"
            (click)="delete.emit(cv())"
          >
            <lmn-trash [size]="16" ariaLabel="Delete" />
          </volt-button>
        </div>
      </div>
    </div>
  `,
})
export class CvCard {
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
