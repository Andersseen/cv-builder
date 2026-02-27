import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from "@angular/core";

export interface ColorPreset {
  name: string;
  value: string;
}

@Component({
  selector: "app-color-picker",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h3 class="text-sm font-semibold text-foreground mb-1">{{ label() }}</h3>
      @if (description()) {
        <p class="text-xs text-muted-foreground mb-3">{{ description() }}</p>
      }

      <!-- Preset swatches -->
      @if (presets().length > 0) {
        <div class="flex flex-wrap gap-2 mb-3">
          @for (color of presets(); track color.value) {
            <button
              type="button"
              class="w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-110"
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
      }

      <!-- Custom color input -->
      <div class="flex items-center gap-2">
        <input
          type="color"
          [value]="currentColor()"
          (input)="onColorInput($event)"
          class="w-9 h-9 rounded-lg border border-border cursor-pointer"
          title="Pick custom color"
        />
        <input
          type="text"
          [value]="currentColor()"
          (change)="onHexInput($event)"
          class="w-24 px-2.5 py-1.5 bg-surface-alt border border-border rounded-lg text-foreground text-xs
                 font-mono placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                 transition-all duration-200"
          placeholder="#4f46e5"
          maxlength="7"
        />
      </div>
    </div>
  `,
})
export class ColorPickerComponent {
  readonly label = input.required<string>();
  readonly description = input("");
  readonly currentColor = input.required<string>();
  readonly presets = input<ColorPreset[]>([]);

  readonly colorChanged = output<string>();

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
