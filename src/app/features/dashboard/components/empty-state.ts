import { Component, output, ChangeDetectionStrategy } from "@angular/core";
import { VoltButton } from "@voltui/components";
import { LmnDocumentTextIcon } from "lumen-icons/document-text";
import { LmnPlusIcon } from "lumen-icons/plus";
import { MoveEnterDirective } from "angular-movement";

@Component({
  selector: "app-empty-state",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoltButton, LmnDocumentTextIcon, LmnPlusIcon, MoveEnterDirective],
  template: `
    <div class="text-center py-24" moveEnter="fade-up">
      <div
        class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-card flex items-center justify-center border border-border"
      >
        <lmn-document-text [size]="32" tone="muted" ariaLabel="No resumes" />
      </div>
      <h2 class="text-xl font-semibold text-foreground mb-2">No resumes yet</h2>
      <p class="text-muted-foreground mb-8 max-w-md mx-auto">
        Create your first resume and start building your professional profile.
      </p>
      <volt-button size="lg" (click)="create.emit()">
        <lmn-plus slot="leading" [size]="20" />
        Create Your First Resume
      </volt-button>
    </div>
  `,
})
export class EmptyState {
  readonly create = output<void>();
}
