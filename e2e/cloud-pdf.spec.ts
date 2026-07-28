import { test, expect } from "@playwright/test";

// A minimal but structurally valid PDF binary for the mocked /api/pdf route.
const FAKE_PDF = Buffer.from(
  "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]>>endobj\n" +
    "trailer<</Root 1 0 R>>\n%%EOF",
);

async function createResume(page) {
  await page.goto("/dashboard");
  const btn = page.getByRole("button", { name: /New Resume/i });
  await btn.waitFor({ state: "visible" });
  // Wait for the initial IndexedDB load to settle — otherwise createNew()
  // races it and the editor bounces back to /dashboard (flaky navigation).
  await page.waitForSelector("app-cv-card, app-empty-state");
  await btn.click();
  await page.waitForURL(/\/editor\?cv=/, { timeout: 30000 });
}

test.describe("Cloud PDF export (server-rendered via /api/pdf)", () => {
  test("posts the resume document to /api/pdf and downloads the PDF", async ({
    page,
  }) => {
    // The e2e suite runs against the Vite dev server (no Worker), so the
    // /api/pdf endpoint is mocked. The real rendering is verified with
    // `pnpm dev:worker` (see docs/specs/005).
    let receivedBody: { document?: string } | null = null;
    await page.route("**/api/pdf", async (route) => {
      receivedBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/pdf",
        body: FAKE_PDF,
      });
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await createResume(page);
    await page
      .locator("input[type='text'][placeholder='John Doe']")
      .fill("Ada Lovelace");
    await page.waitForTimeout(300);

    await page
      .locator('[data-testid="export-dropdown-toggle"]')
      .first()
      .click();
    await page.waitForTimeout(200);

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30000 }),
      page.locator('[data-testid="export-cloud-pdf"]').first().click(),
    ]);

    // The Worker received a full HTML document containing the resume.
    expect(receivedBody).not.toBeNull();
    expect(receivedBody!.document).toContain("<!DOCTYPE html>");
    expect(receivedBody!.document).toContain("resume-content");
    expect(receivedBody!.document).toContain("Ada Lovelace");
    expect(receivedBody!.document).toContain('id="print-wrapper"');

    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test("shows an error toast when /api/pdf fails", async ({ page }) => {
    await page.route("**/api/pdf", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "PDF generation failed" }),
      });
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await createResume(page);
    await page.waitForTimeout(300);

    await page
      .locator('[data-testid="export-dropdown-toggle"]')
      .first()
      .click();
    await page.locator('[data-testid="export-cloud-pdf"]').first().click();

    await expect(page.getByText("Error exporting cloud PDF")).toBeVisible();
  });
});
