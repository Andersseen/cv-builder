import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideFileRouter } from "@analogjs/router";
import { provideMovement } from "angular-movement";
import { App } from "./app/app";

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideFileRouter(),
    provideAnimations(),
    provideMovement({
      duration: 320,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      delay: 0,
      disabled: false,
    }),
  ],
}).catch((err) => console.error(err));
