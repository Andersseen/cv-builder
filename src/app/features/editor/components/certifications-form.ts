import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { FormField, form, required } from "@angular/forms/signals";
import { VoltButton, VoltInput } from "@voltui/components";

import { Certification } from "../../../domain/models/cv-model";
import { createDefaultCertification } from "../../../domain/models/cv-defaults";
import { moveItem } from "../../../core/utils/array";

@Component({
  selector: "app-certifications-form",
  imports: [FormField, VoltButton, VoltInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-foreground">Certifications</h2>
        <volt-button
          (click)="toggleForm()"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          [class]="
            showForm()
              ? 'bg-secondary text-secondary-foreground hover:bg-accent'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          "
        >
          {{ showForm() ? "Cancel" : "+ Add Certification" }}
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
                >Certification *</label
              >
              <volt-input
                type="text"
                [formField]="certificationForm.name"
                class="input-field"
                placeholder="AWS Certified Solutions Architect"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Issuer</label
              >
              <volt-input
                type="text"
                [formField]="certificationForm.issuer"
                class="input-field"
                placeholder="Amazon Web Services"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Date</label
              >
              <volt-input
                type="month"
                [formField]="certificationForm.date"
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1.5"
                >Credential URL</label
              >
              <volt-input
                type="text"
                [formField]="certificationForm.url"
                class="input-field"
                placeholder="https://..."
              />
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
              [disabled]="certificationForm().invalid()"
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
        @for (cert of items(); track cert.id; let i = $index) {
          <div
            class="p-4 bg-muted border border-border rounded-xl group
                      hover:border-primary/30 transition-all duration-200"
          >
            <div class="flex justify-between items-start">
              <div class="cursor-pointer flex-grow" (click)="edit(cert)">
                <h3
                  class="font-semibold text-foreground group-hover:text-primary transition-colors"
                >
                  {{ cert.name }}
                </h3>
                <p class="text-muted-foreground text-sm">
                  {{ cert.issuer
                  }}{{ cert.date ? " — " + formatDate(cert.date) : "" }}
                </p>
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
                  (click)="edit(cert)"
                  class="px-2.5 py-1 text-xs text-primary hover:bg-primary/15 rounded-md transition-colors"
                >
                  Edit
                </volt-button>
                <volt-button
                  (click)="remove(cert.id)"
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
            No certifications added yet.
          </p>
        }
      </div>
    </div>
  `,
})
export class CertificationsForm {
  readonly items = input.required<Certification[]>();
  readonly itemsChange = output<Certification[]>();
  readonly removed = output<Certification>();

  protected readonly showForm = signal(false);
  protected readonly editingId = signal<string | null>(null);

  /** The edit buffer. Never the same object as an entry in `items()`. */
  private readonly draft = signal<Certification>(createDefaultCertification());

  protected readonly certificationForm = form(this.draft, (cert) => {
    required(cert.name);
  });

  protected toggleForm(): void {
    if (this.showForm()) this.cancelEdit();
    else this.startNew();
  }

  protected startNew(): void {
    this.editingId.set(null);
    this.certificationForm().reset(createDefaultCertification());
    this.showForm.set(true);
  }

  protected edit(entry: Certification): void {
    this.editingId.set(entry.id);
    this.certificationForm().reset({ ...entry });
    this.showForm.set(true);
  }

  protected cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.certificationForm().reset(createDefaultCertification());
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.certificationForm().invalid()) {
      this.certificationForm().markAsTouched();
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

  protected formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }
}
