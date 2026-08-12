import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideServerRendering } from "@angular/platform-server";
import { provideFileRouter } from "@analogjs/router";
import { provideMovement } from "angular-movement";

// No `provideNoopAnimations()`: `@angular/animations` is not a dependency any
// more, and `provideMovement({ disabled: true })` is what actually keeps
// angular-movement inert during prerendering.
export const config: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideServerRendering(),
    provideFileRouter(),
    provideMovement({ disabled: true }),
  ],
};
