/// <reference types="vitest" />

import { defineConfig } from "vite";
import analog from "@analogjs/platform";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ["es2022"],
  },
  resolve: {
    mainFields: ["module"],
  },
  plugins: [
    analog({
      ssr: false,
      static: true,
      liveReload: false,
    }),
  ],
  define: {
    "import.meta.vitest": mode !== "production",
  },
}));
