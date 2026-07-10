import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideFileRouter } from "@analogjs/router";
import { App } from "./app/app";

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideFileRouter(),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
