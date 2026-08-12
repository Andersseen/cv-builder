import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

/**
 * Two Vitest projects:
 *
 * - `domain`   — pure domain/application logic. Plain Node environment, no
 *                Angular compiler, no jsdom. Stays fast (~250ms for the whole
 *                suite) and isolated from the build pipeline.
 * - `component`— editor form components. Needs the AnalogJS Angular plugin to
 *                compile templates and jsdom to render them. Only `*.ct.spec.ts`
 *                files run here, so the domain suite is not slowed down.
 *
 * Neither project loads vite.config.ts — the Analog *platform* plugin brings
 * file-based routing and Nitro, which tests do not need.
 */
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "domain",
          globals: true,
          environment: "node",
          include: ["src/**/*.spec.ts"],
          exclude: ["src/**/*.ct.spec.ts"],
        },
      },
      {
        plugins: [angular()],
        test: {
          name: "component",
          globals: true,
          environment: "jsdom",
          include: ["src/**/*.ct.spec.ts"],
          setupFiles: ["src/test-setup.ts"],
          // The Angular compiler runs per file; a shared pool keeps it warm.
          pool: "threads",
        },
      },
    ],
  },
});
