import { defineConfig } from "vitest/config";

/**
 * Standalone Vitest config — intentionally does NOT load the AnalogJS Vite
 * plugin from vite.config.ts. Tests target pure domain/application logic
 * (no Angular TestBed), so a plain Node environment keeps them fast and
 * isolated from the build pipeline. Component tests, if added later, would
 * need @analogjs/vitest-angular and a jsdom environment.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.spec.ts"],
  },
});
