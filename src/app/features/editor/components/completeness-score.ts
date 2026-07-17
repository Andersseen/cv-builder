import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { Cv } from "../../../domain/models/cv-model";
import {
  scoreCompleteness,
  CompletenessSuggestion,
  SuggestionSeverity,
} from "../../../domain/models/cv-completeness";

@Component({
  selector: "app-completeness-score",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <button
        type="button"
        (click)="popoverOpen.set(!popoverOpen())"
        [attr.aria-label]="'Completeness score: ' + result().score + ' out of 100'"
        [title]="'Completeness score: ' + result().score + ' — click for suggestions'"
        class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors"
      >
        <div
          class="relative w-8 h-8 flex items-center justify-center"
          [attr.aria-hidden]="true"
        >
          <svg class="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
            <!-- Track -->
            <path
              class="text-muted/20"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            />
            <!-- Progress -->
            <path
              [attr.stroke-dasharray]="result().score + ', 100'"
              class="transition-all duration-500 ease-out"
              [class]="scoreColorClass()"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
          <span
            data-testid="completeness-score"
            class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground"
          >
            {{ result().score }}
          </span>
        </div>
        <span class="hidden sm:inline text-xs font-medium text-muted-foreground">
          Score
        </span>
      </button>

      @if (popoverOpen()) {
        <div
          class="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-xl shadow-foreground/10 z-50 overflow-hidden"
          (click)="$event.stopPropagation()"
        >
          <div class="px-4 py-3 border-b border-border">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-foreground">CV Completeness</h3>
              <span
                class="text-xs font-medium px-2 py-0.5 rounded-full"
                [class]="scoreBadgeClass()"
              >
                {{ result().score }}/100
              </span>
            </div>
            <p class="text-xs text-muted-foreground mt-1">
              @if (result().score >= 80) {
                Great job — your resume is in excellent shape.
              } @else if (result().score >= 50) {
                A few improvements will make your resume stronger.
              } @else {
                Complete the critical items below to get started.
              }
            </p>
          </div>

          <div class="max-h-72 overflow-y-auto">
            @if (result().suggestions.length === 0) {
              <div class="px-4 py-6 text-center text-sm text-muted-foreground">
                No suggestions left. You're all set!
              </div>
            } @else {
              <ul class="py-2">
                @for (suggestion of result().suggestions; track suggestion.message) {
                  <li>
                    <button
                      type="button"
                      (click)="onSuggestionClick(suggestion)"
                      class="w-full text-left px-4 py-2.5 hover:bg-accent transition-colors flex items-start gap-3"
                    >
                      <span
                        class="mt-0.5 w-2 h-2 rounded-full shrink-0"
                        [class]="severityDotClass(suggestion.severity)"
                      ></span>
                      <span class="text-sm text-foreground">{{ suggestion.message }}</span>
                    </button>
                  </li>
                }
              </ul>
            }
          </div>
        </div>
      }
    </div>

    @if (popoverOpen()) {
      <div
        class="fixed inset-0 z-40"
        (click)="popoverOpen.set(false)"
      ></div>
    }
  `,
})
export class CompletenessScore {
  readonly cv = input.required<Cv>();
  readonly tabSelected = output<string>();

  protected popoverOpen = signal(false);

  protected result = computed(() => scoreCompleteness(this.cv()));

  protected scoreColorClass = computed(() => {
    const score = this.result().score;
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  });

  protected scoreBadgeClass = computed(() => {
    const score = this.result().score;
    if (score >= 80) return "bg-success/10 text-success";
    if (score >= 50) return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
  });

  protected onSuggestionClick(suggestion: CompletenessSuggestion): void {
    this.popoverOpen.set(false);
    this.tabSelected.emit(suggestion.tabId);
  }

  protected severityDotClass(severity: SuggestionSeverity): string {
    switch (severity) {
      case "critical":
        return "bg-destructive";
      case "warning":
        return "bg-warning";
      case "info":
        return "bg-info";
    }
  }
}
