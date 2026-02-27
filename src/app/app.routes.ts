import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/landing/landing"),
  },
  {
    path: "dashboard",
    loadComponent: () => import("./features/dashboard/dashboard"),
  },
  {
    path: "editor",
    loadComponent: () => import("./features/editor/editor"),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
