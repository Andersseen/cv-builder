import { test, expect } from "@playwright/test";

async function createResume(page) {
  await page.goto("/dashboard");
  const btn = page.getByRole("button", { name: /New Resume/i });
  await btn.waitFor({ state: "visible" });
  await Promise.all([
    page.waitForURL(/\/editor\?cv=/, { waitUntil: "load" }),
    btn.click(),
  ]);
}

test.describe("Fase 2 — Mobile preview and export", () => {
  test("mobile form layout is usable and preview overlay works", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await createResume(page);

    // Fill a field
    await page
      .locator("input[type='text'][placeholder='John Doe']")
      .fill("Ada Lovelace");
    await page.waitForTimeout(300);

    // Form input should be reasonably wide (not squeezed to a tiny column)
    const inputBox = await page
      .locator("input[type='text'][placeholder='John Doe']")
      .boundingBox();
    expect(inputBox?.width).toBeGreaterThan(250);

    // Preview toggle button visible
    const previewBtn = page.locator("button", { hasText: /Preview/i });
    await expect(previewBtn).toBeVisible();

    // Open preview overlay
    await previewBtn.click();
    await page.waitForTimeout(300);

    // Overlay should contain the CV name
    const overlay = page.locator("text=Preview").first();
    await expect(overlay).toBeVisible();
    await expect(
      page
        .locator('[data-testid="mobile-preview-overlay"] .resume-content')
        .getByText("Ada Lovelace"),
    ).toBeVisible();

    // Close overlay
    await page.getByRole("button", { name: /Close/i }).click();
    await page.waitForTimeout(200);
    await expect(page.locator("button", { hasText: /Preview/i })).toBeVisible();
  });

  test("mobile PDF image export works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await createResume(page);
    await page
      .locator("input[type='text'][placeholder='John Doe']")
      .fill("Ada Lovelace");
    await page.waitForTimeout(300);

    // Open dropdown and export image PDF
    await page.locator('[data-testid="export-dropdown-toggle"]').first().click();
    await page.waitForTimeout(200);

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30000 }),
      page.locator('[data-testid="export-image-pdf"]').first().click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test("mobile print export does not crash", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await createResume(page);
    await page
      .locator("input[type='text'][placeholder='John Doe']")
      .fill("Ada Lovelace");
    await page.waitForTimeout(300);

    // Print PDF primary action
    await page.locator('[data-testid="export-print-pdf"]').first().click();
    await page.waitForTimeout(200);

    // No error dialog expected; print dialog is native and ignored in headless.
    await expect(page.locator("text=Preview not ready")).toBeHidden();
  });

  test("desktop side panel still works", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await createResume(page);
    await page
      .locator("input[type='text'][placeholder='John Doe']")
      .fill("Ada Lovelace");
    await page.waitForTimeout(300);

    await expect(
      page
        .locator('[data-testid="desktop-preview-panel"] .resume-content')
        .getByText("Ada Lovelace"),
    ).toBeVisible();

    // Toggle hides panel
    await page.locator("button", { hasText: /Hide Preview/i }).click();
    await page.waitForTimeout(200);
    await expect(
      page.locator("button", { hasText: /Show Preview/i }),
    ).toBeVisible();

    // Toggle shows panel
    await page.locator("button", { hasText: /Show Preview/i }).click();
    await page.waitForTimeout(200);
    await expect(
      page.locator("button", { hasText: /Hide Preview/i }),
    ).toBeVisible();
  });
});
