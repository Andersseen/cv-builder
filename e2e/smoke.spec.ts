import { test, expect } from "@playwright/test";

/**
 * Smoke E2E covering the core flow: landing → dashboard → editor → live preview.
 * These also serve as the regression gate for the Angular 21 upgrade — if the
 * zoneless bootstrap, file-based routing, or signals break, these fail.
 */

/** Create a fresh resume from the dashboard and land in the editor. */
async function createResume(page: import("@playwright/test").Page) {
  await page.goto("/dashboard");
  const btn = page.getByRole("button", { name: /New Resume/i });
  await btn.waitFor({ state: "visible" });
  await Promise.all([
    page.waitForURL(/\/editor\?cv=/, { waitUntil: "load" }),
    btn.click(),
  ]);
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
    await expect(
      page.getByRole("heading", { name: /My Resumes/i }),
    ).toBeVisible();
    await expect(page.getByText(/No resumes yet/i)).toBeVisible();
  });

  test("creating a resume opens the editor", async ({ page }) => {
    await createResume(page);
    // Editor tabs render (there are desktop + mobile copies, take the first).
    await expect(
      page.getByRole("button", { name: /Personal/ }).first(),
    ).toBeVisible();
    // Live preview container is present.
    await expect(
      page.locator('[data-testid="desktop-preview-panel"] .resume-content'),
    ).toBeVisible();
  });
});

test.describe("Editor live preview (zoneless signals)", () => {
  test("typing the full name updates the preview instantly", async ({
    page,
  }) => {
    await createResume(page);

    const name = "Ada Lovelace";
    // volt-input wraps the native input, so target the inner textbox by placeholder.
    await page.locator("input[type='text'][placeholder='John Doe']").fill(name);

    // The name must appear inside the rendered resume preview without a reload —
    // proves OnPush + signals change detection works under zoneless Angular 21.
    await expect(
      page
        .locator('[data-testid="desktop-preview-panel"] .resume-content')
        .getByText(name),
    ).toBeVisible();
  });
});

test.describe("Persistence", () => {
  test("edits survive a reload (IndexedDB autosave)", async ({ page }) => {
    await createResume(page);
    const editorUrl = page.url();

    const name = "Grace Hopper";
    await page.locator("input[type='text'][placeholder='John Doe']").fill(name);
    // Autosave debounce is 800ms; wait it out before reloading.
    await page.waitForTimeout(1200);

    // Reload the same editor URL — the persisted value must come back from IndexedDB.
    await page.goto(editorUrl);
    await expect(
      page.locator("input[type='text'][placeholder='John Doe']"),
    ).toHaveValue(name);
    await expect(
      page
        .locator('[data-testid="desktop-preview-panel"] .resume-content')
        .getByText(name),
    ).toBeVisible();
  });
});

test.describe("Fase 5 — Onboarding and completeness", () => {
  test("starting with an example creates a high-scoring CV", async ({ page }) => {
    await page.goto("/dashboard");

    await page.getByRole("button", { name: /Start with an Example/i }).click();
    await page.waitForURL(/\/editor\?cv=/, { waitUntil: "load" });

    // The preview should show the example data.
    await expect(
      page
        .locator('[data-testid="desktop-preview-panel"] .resume-content')
        .getByText("Alex Rivera"),
    ).toBeVisible();

    // The completeness score should be high.
    const scoreButton = page.locator('[aria-label^="Completeness score:"]').first();
    await expect(scoreButton).toBeVisible();
    const scoreText = await scoreButton.locator('[data-testid="completeness-score"]').textContent();
    expect(Number(scoreText)).toBeGreaterThanOrEqual(80);
  });

  test("a blank CV shows a low score with suggestions", async ({ page }) => {
    await createResume(page);

    const scoreButton = page.locator('[aria-label^="Completeness score:"]').first();
    await expect(scoreButton).toBeVisible();
    const scoreText = await scoreButton.locator('[data-testid="completeness-score"]').textContent();
    expect(Number(scoreText)).toBeLessThan(50);

    // Opening the popover reveals at least one suggestion.
    await scoreButton.click();
    await expect(page.getByRole("button", { name: /Add your full name/i })).toBeVisible();
  });
});
test.describe("Full editor flow", () => {
  test("create, fill, preview and return to dashboard", async ({ page }) => {
    await createResume(page);

    // Fill personal info
    await page
      .locator("input[type='text'][placeholder='John Doe']")
      .fill("Ada Lovelace");
    await page.locator("input[type='email']").fill("ada@example.com");
    await page
      .locator(
        "textarea[placeholder='Brief overview of your professional background and key achievements...']",
      )
      .fill("Mathematician and writer.");

    // Add one experience entry
    await page
      .getByRole("button", { name: /Experience/i })
      .first()
      .click();
    await page.getByRole("button", { name: /\+ Add Experience/i }).click();
    await page
      .locator("input[type='text'][placeholder='Software Engineer']")
      .fill("Software Engineer");
    await page
      .locator("input[type='text'][placeholder='Tech Corp']")
      .fill("Tech Corp");
    await page
      .locator("input[type='text'][placeholder='San Francisco, CA']")
      .fill("London");
    await page.locator('input[type="month"]').first().fill("2020-01");
    await page
      .locator(
        "textarea[placeholder='Key responsibilities and achievements...']",
      )
      .fill("- Built the first algorithm\n- **Led** team");
    await page.getByRole("button", { name: /^Add$/i }).click();

    // Verify preview reflects both personal and experience data
    await expect(
      page
        .locator('[data-testid="desktop-preview-panel"] .resume-content')
        .getByText("Ada Lovelace"),
    ).toBeVisible();
    await expect(
      page
        .locator('[data-testid="desktop-preview-panel"] .resume-content')
        .getByText("Tech Corp"),
    ).toBeVisible();

    // Wait for autosave
    await page.waitForTimeout(1200);

    // Return to dashboard and verify the card exists
    await page.getByRole("button", { name: /Back/i }).click();
    await page.waitForURL(/\/dashboard/);
    await expect(
      page.locator("h3", { hasText: /Untitled Resume/ }),
    ).toBeVisible();
  });
});
