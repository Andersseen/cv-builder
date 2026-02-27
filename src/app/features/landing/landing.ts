import { Component, ChangeDetectionStrategy,   } from "@angular/core";
import { Hero } from "./components/hero/hero";
import { Features } from "./components/features/features";
import { Cta } from "./components/cta/cta";

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
