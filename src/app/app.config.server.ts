import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { provideServerRendering } from "@angular/platform-server";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { provideFileRouter } from "@analogjs/router";

export const config: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideServerRendering(),
    provideFileRouter(),
    provideNoopAnimations(),
  ],
};
