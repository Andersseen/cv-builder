import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/landing/landing.component"),
  },
  {
    path: "dashboard",
    loadComponent: () => import("./features/dashboard/dashboard.component"),
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
