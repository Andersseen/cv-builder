import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/landing/landing.component"),
  },
  {
    path: "editor",
    loadComponent: () => import("./features/editor/editor.component"),
  },

  {
    path: "**",
    redirectTo: "",
  },
];
