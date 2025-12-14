import { ChangeDetectionStrategy, Component } from "@angular/core";
import { HeroComponent } from "./components/hero/hero.component";
import { FeaturesComponent } from "./components/features/features.component";
import { CtaComponent } from "./components/cta/cta.component";

@Component({
  selector: "app-landing",
  imports: [HeroComponent, FeaturesComponent, CtaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="bg-background min-h-screen">
      <app-hero />
      <app-features />
      <app-cta />
    </main>
  `,
})
export default class LandingComponent {}
