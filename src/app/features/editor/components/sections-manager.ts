import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { Cv, CustomSection } from "../../../domain/models/cv-model";
import { VoltButton } from "@voltui/components";
import { CustomSectionForm } from "./custom-section-form";
import {
  getSectionLabel,
  moveSection,
  toggleSectionVisibility,
  DEFAULT_SECTION_ORDER,
} from "../../../domain/models/section-helpers";

@Component({
  selector: "app-sections-manager",
  imports: [VoltButton, CustomSectionForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <div>
        <h2 class="text-lg font-semibold text-foreground mb-1">
          Sections
        </h2>
        <p class="text-sm text-muted-foreground mb-5">
          Show, hide and reorder the sections of your resume
        </p>

        <div class="space-y-2">
          @for (sectionId of orderedSectionIds(); track sectionId) {
            <div
              class="flex items-center justify-between p-3 bg-muted rounded-xl border border-border"
            >
              <div class="flex items-center gap-3">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [checked]="isVisible(sectionId)"
                    (change)="toggleVisibility(sectionId)"
                    class="sr-only peer"
                  />
                  <span
                    class="w-9 h-5 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer transition-colors peer-checked:bg-primary"
                  ></span>
                  <span
                    class="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"
                  ></span>
                </label>
                <span class="text-sm font-medium text-foreground">
                  {{ sectionLabel(sectionId) }}
                </span>
              </div>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  (click)="move(sectionId, 'up')"
                  [disabled]="$first"
                  class="p-1.5 text-xs text-muted-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-30"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  (click)="move(sectionId, 'down')"
                  [disabled]="$last"
                  class="p-1.5 text-xs text-muted-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-foreground">Custom Sections</h3>
            <p class="text-sm text-muted-foreground">
              Add extra sections like volunteering, awards or publications
            </p>
          </div>
          <volt-button size="sm" (click)="addCustom()">
            + Add Custom Section
          </volt-button>
        </div>

        @if (cv().sections.customSections.length === 0) {
          <p class="text-sm text-muted-foreground text-center py-6 bg-muted rounded-xl border border-border">
            No custom sections yet.
          </p>
        }

        <div class="space-y-3">
          @for (section of cv().sections.customSections; track section.id) {
            @if (editingSectionId() === section.id) {
              <div
                class="p-4 bg-card border border-primary/30 rounded-xl shadow-sm"
              >
                <app-custom-section-form
                  [section]="section"
                  (sectionChange)="updateCustom(section.id, $event)"
                  (removed)="removeCustom(section.id)"
                />
                <div class="mt-4 flex justify-end">
                  <button
                    type="button"
                    (click)="editingSectionId.set(null)"
                    class="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            } @else {
              <div
                class="flex items-center justify-between p-4 bg-muted rounded-xl border border-border group hover:border-primary/30 transition-colors"
              >
                <div>
                  <h4 class="text-sm font-semibold text-foreground">
                    {{ section.title || "Untitled section" }}
                  </h4>
                  <p class="text-xs text-muted-foreground">
                    {{ section.items.length }} item{{ section.items.length === 1 ? "" : "s" }}
                  </p>
                </div>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    (click)="editingSectionId.set(section.id)"
                    class="px-2.5 py-1 text-xs text-primary hover:bg-primary/15 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    (click)="removeCustom(section.id)"
                    class="px-2.5 py-1 text-xs text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class SectionsManager {
  readonly cv = input.required<Cv>();

  readonly visibilityChanged = output<Record<string, boolean>>();
  readonly orderChanged = output<string[]>();
  readonly addCustomSection = output<void>();
  readonly updateCustomSection = output<{ id: string; section: CustomSection }>();
  readonly removeCustomSection = output<string>();

  protected editingSectionId = signal<string | null>(null);

  protected orderedSectionIds = computed(() => {
    const cv = this.cv();
    const allIds = [
      ...DEFAULT_SECTION_ORDER,
      ...cv.sections.customSections.map((s) => s.id),
    ];
    const order = (cv.settings.sectionOrder ?? []).filter((id) => allIds.includes(id));
    for (const id of allIds) {
      if (!order.includes(id)) order.push(id);
    }
    return order;
  });

  protected isVisible(sectionId: string): boolean {
    return (this.cv().settings.sectionVisibility ?? {})[sectionId] !== false;
  }

  protected sectionLabel(sectionId: string): string {
    return getSectionLabel(this.cv(), sectionId);
  }

  protected toggleVisibility(sectionId: string): void {
    this.visibilityChanged.emit(
      toggleSectionVisibility(this.cv().settings.sectionVisibility ?? {}, sectionId),
    );
  }

  protected move(sectionId: string, direction: "up" | "down"): void {
    this.orderChanged.emit(
      moveSection(this.orderedSectionIds(), sectionId, direction),
    );
  }

  protected addCustom(): void {
    this.addCustomSection.emit();
  }

  protected updateCustom(id: string, section: CustomSection): void {
    this.updateCustomSection.emit({ id, section });
  }

  protected removeCustom(id: string): void {
    if (this.editingSectionId() === id) {
      this.editingSectionId.set(null);
    }
    this.removeCustomSection.emit(id);
  }
}
