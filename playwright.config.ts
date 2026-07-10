import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config. Boots the Vite dev server (port 5173) and drives the
 * app in a real browser. Each test runs in a fresh context, so IndexedDB
 * (Dexie) starts empty — tests that need existing CVs create them in-flow.
 */
export default defineConfig({
  testDir: "./e2e",
  // The Vite dev server compiles routes on demand; parallel workers hammering
  // it cause lazy-route loads to exceed timeouts. Serialize for stability.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 1,
  reporter: process.env["CI"] ? "github" : "list",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:5173",
    navigationTimeout: 20_000,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env["CI"],
    timeout: 120_000,
  },
});
