import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";
import { provideFileRouter } from "@analogjs/router";
import { provideMovement } from "angular-movement";
import { App } from "./app/app";

// No `provideAnimations()`: nothing here uses `@angular/animations`, and
// angular-movement drives its own Web Animations API transitions. The provider
// is also deprecated (Angular 20.2, removal intended in v23).
bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideFileRouter(),
    provideMovement({
      duration: 320,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      delay: 0,
      disabled: false,
    }),
  ],
}).catch((err) => console.error(err));
