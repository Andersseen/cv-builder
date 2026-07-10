import { test, expect } from "@playwright/test";

/**
 * Smoke E2E covering the core flow: landing → dashboard → editor → live preview.
 * These also serve as the regression gate for the Angular 21 upgrade — if the
 * zoneless bootstrap, file-based routing, or signals break, these fail.
 */

/** Create a fresh resume from the dashboard and land in the editor. */
async function createResume(page: import("@playwright/test").Page) {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: /New Resume/i }).click();
  await page.waitForURL(/\/editor\?cv=/);
}

test.describe("Landing", () => {
  test("renders the hero and links to the dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Modern CV Builder/i);

    const cta = page.getByRole("link", { name: /Start Building Free/i });
    await expect(cta).toBeVisible();

    await cta.click();
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe("Dashboard", () => {
  test("shows the empty state on a fresh profile", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: /My Resumes/i })).toBeVisible();
    await expect(page.getByText(/No resumes yet/i)).toBeVisible();
  });

  test("creating a resume opens the editor", async ({ page }) => {
    await createResume(page);
    // Editor tabs render (there are desktop + mobile copies, take the first).
    await expect(page.getByRole("button", { name: /Personal/ }).first()).toBeVisible();
    // Live preview container is present.
    await expect(page.locator("#resume-content")).toBeVisible();
  });
});

test.describe("Editor live preview (zoneless signals)", () => {
  test("typing the full name updates the preview instantly", async ({ page }) => {
    await createResume(page);

    const name = "Ada Lovelace";
    await page.locator('input[formcontrolname="fullName"]').fill(name);

    // The name must appear inside the rendered resume preview without a reload —
    // proves OnPush + signals change detection works under zoneless Angular 21.
    await expect(page.locator("#resume-content").getByText(name)).toBeVisible();
  });
});

test.describe("Persistence", () => {
  test("edits survive a reload (IndexedDB autosave)", async ({ page }) => {
    await createResume(page);
    const editorUrl = page.url();

    const name = "Grace Hopper";
    await page.locator('input[formcontrolname="fullName"]').fill(name);
    // Autosave debounce is 800ms; wait it out before reloading.
    await page.waitForTimeout(1200);

    // Reload the same editor URL — the persisted value must come back from IndexedDB.
    await page.goto(editorUrl);
    await expect(page.locator('input[formcontrolname="fullName"]')).toHaveValue(name);
    await expect(page.locator("#resume-content").getByText(name)).toBeVisible();
  });
});
