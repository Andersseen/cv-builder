import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from "@angular/core";

@Component({
  selector: "app-accent-color-picker",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mt-6 pt-5 border-t border-border">
      <h3 class="text-sm font-semibold text-foreground mb-3">Accent Color</h3>
      <p class="text-xs text-muted-foreground mb-3">
        Customize the accent color used across your resume
      </p>

      <!-- Preset swatches -->
      <div class="flex flex-wrap gap-2 mb-3">
        @for (color of presetColors; track color.value) {
          <button
            type="button"
            class="w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
            [style.background-color]="color.value"
            [class]="
              currentColor() === color.value
                ? 'border-foreground ring-2 ring-offset-2 ring-primary scale-110'
                : 'border-border/50'
            "
            [title]="color.name"
            (click)="colorChanged.emit(color.value)"
          ></button>
        }
      </div>

      <!-- Custom color input -->
      <div class="flex items-center gap-3">
        <input
          type="color"
          [value]="currentColor()"
          (input)="onColorInput($event)"
          class="w-10 h-10 rounded-lg border border-border cursor-pointer"
          title="Pick custom color"
        />
        <input
          type="text"
          [value]="currentColor()"
          (change)="onHexInput($event)"
          class="w-28 px-3 py-2 bg-surface-alt border border-border rounded-lg text-foreground text-sm
                 font-mono placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                 transition-all duration-200"
          placeholder="#4f46e5"
          maxlength="7"
        />
      </div>
    </div>
  `,
})
export class AccentColorPickerComponent {
  currentColor = input.required<string>();
  colorChanged = output<string>();

  readonly presetColors = [
    { name: "Indigo", value: "#4f46e5" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Emerald", value: "#10b981" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Orange", value: "#f97316" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Slate", value: "#475569" },
    { name: "Charcoal", value: "#111827" },
  ];

  onColorInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.colorChanged.emit(value);
  }

  onHexInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      this.colorChanged.emit(value);
    }
  }
}
