import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Hero } from "../features/landing/components/hero/hero";
import { Features } from "../features/landing/components/features/features";
import { Cta } from "../features/landing/components/cta/cta";

@Component({
  selector: "app-landing",
  imports: [Hero, Features, Cta],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="bg-background min-h-screen">
      <app-hero />
      <app-features />
      <app-cta />
    </main>
  `,
})
export default class Landing {}
