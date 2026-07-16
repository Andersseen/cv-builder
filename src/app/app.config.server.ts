import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideServerRendering } from "@angular/platform-server";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { provideFileRouter } from "@analogjs/router";
import { provideMovement } from "angular-movement";

export const config: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideServerRendering(),
    provideFileRouter(),
    provideNoopAnimations(),
    provideMovement({ disabled: true }),
  ],
};
