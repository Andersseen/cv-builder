import { test, expect, type Page } from "@playwright/test";

/**
 * End-to-end coverage for behaviours the Signal Forms migration touched and
 * that only a real browser can prove: the Volt native-select interop, keyboard
 * undo/redo, and draft-cancel semantics surviving a round trip through
 * IndexedDB.
 *
 * See docs/signal-forms-migration.md.
 */

async function createResume(page: Page): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/dashboard");
  const btn = page.getByRole("button", { name: /New Resume/i });
  await btn.waitFor({ state: "visible" });
  // Wait for the initial IndexedDB load to settle — otherwise createNew()
  // races it and the editor bounces back to /dashboard.
  await page.waitForSelector("app-cv-card, app-empty-state");
  await btn.click();
  await page.waitForURL(/\/editor\?cv=/, { timeout: 30_000 });
}

async function openTab(page: Page, name: RegExp): Promise<void> {
  await page.getByRole("button", { name }).first().click();
}

test.describe("Volt native select interop", () => {
  test("the skill level select is bound and its value is saved", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await createResume(page);
    await openTab(page, /Skills/);
    await page.getByRole("button", { name: "+ Add Skill" }).click();

    await page
      .locator("input[placeholder='TypeScript, React, Docker...']")
      .fill("Rust");
    await page.locator("select").selectOption("Advanced");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    // The chosen level — not the default — must land in the saved skill.
    // Scope to the form: the two preview panels render the same text.
    await expect(
      page.locator("app-skills-form").getByText("Advanced"),
    ).toBeVisible();
    expect(errors.join("\n")).not.toContain("NG01203");
  });

  test("the stored level is loaded back into the select when editing", async ({
    page,
  }) => {
    await createResume(page);
    await openTab(page, /Skills/);
    await page.getByRole("button", { name: "+ Add Skill" }).click();
    await page
      .locator("input[placeholder='TypeScript, React, Docker...']")
      .fill("Rust");
    await page.locator("select").selectOption("Expert");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await page.getByRole("button", { name: "Edit" }).first().click();

    await expect(page.locator("select")).toHaveValue("Expert");
  });

  test("the language proficiency select is bound and survives a reload", async ({
    page,
  }) => {
    await createResume(page);
    const editorUrl = page.url();

    await openTab(page, /Languages/);
    await page.getByRole("button", { name: "+ Add Language" }).click();
    await page
      .locator("input[placeholder='Spanish, English, German...']")
      .fill("German");
    await page.locator("select").selectOption("Fluent");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    // Autosave debounce is 800ms.
    await page.waitForTimeout(1200);
    await page.goto(editorUrl);
    await openTab(page, /Languages/);

    const languagesForm = page.locator("app-languages-form");
    await expect(languagesForm.getByText("German")).toBeVisible();
    await expect(languagesForm.getByText("Fluent")).toBeVisible();
  });
});

test.describe("Draft cancel semantics", () => {
  test("cancelling an experience edit leaves the stored entry untouched", async ({
    page,
  }) => {
    await createResume(page);
    await openTab(page, /Experience/);

    await page.getByRole("button", { name: "+ Add Experience" }).click();
    await page
      .locator("input[placeholder='Software Engineer']")
      .fill("Engineer");
    await page.locator("input[placeholder='Tech Corp']").fill("Acme");
    await page.locator("input[type='month']").first().fill("2020-01");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    const experienceForm = page.locator("app-experience-form");
    await expect(experienceForm.getByText("Acme")).toBeVisible();

    // Re-open it, type something else, then cancel.
    await page.getByRole("button", { name: "Edit" }).first().click();
    await page.locator("input[placeholder='Tech Corp']").fill("Discarded Corp");
    await page
      .getByRole("button", { name: "Cancel", exact: true })
      .last()
      .click();

    await expect(experienceForm.getByText("Acme")).toBeVisible();
    await expect(page.getByText("Discarded Corp")).toHaveCount(0);
  });

  test("a current role saves without an end date", async ({ page }) => {
    await createResume(page);
    await openTab(page, /Experience/);

    await page.getByRole("button", { name: "+ Add Experience" }).click();
    await page
      .locator("input[placeholder='Software Engineer']")
      .fill("Engineer");
    await page.locator("input[placeholder='Tech Corp']").fill("Acme");
    await page.locator("input[type='month']").first().fill("2020-01");
    await page.locator("input[type='month']").nth(1).fill("2022-06");

    // Ticking "currently working here" hides the end date field...
    await page.locator("input[type='checkbox']").check();
    await expect(page.locator("input[type='month']")).toHaveCount(1);

    await page.getByRole("button", { name: "Add", exact: true }).click();

    // ...and the saved entry shows "Present", not the stale end date.
    await expect(
      page.locator("app-experience-form").getByText("Jan 2020 – Present"),
    ).toBeVisible();
  });
});

test.describe("Undo / redo", () => {
  test("ctrl+z reverts typing in personal info and the preview follows", async ({
    page,
  }) => {
    await createResume(page);

    const nameInput = page.locator(
      "input[type='text'][placeholder='John Doe']",
    );
    await nameInput.fill("Ada Lovelace");
    const preview = page.locator(
      '[data-testid="desktop-preview-panel"] .resume-content',
    );
    await expect(preview.getByText("Ada Lovelace")).toBeVisible();

    await page.keyboard.press("ControlOrMeta+z");

    await expect(nameInput).toHaveValue("");
    await expect(preview.getByText("Ada Lovelace")).toHaveCount(0);
  });

  test("ctrl+z removes an added experience entry", async ({ page }) => {
    await createResume(page);
    await openTab(page, /Experience/);

    await page.getByRole("button", { name: "+ Add Experience" }).click();
    await page
      .locator("input[placeholder='Software Engineer']")
      .fill("Engineer");
    await page.locator("input[placeholder='Tech Corp']").fill("Acme");
    await page.locator("input[type='month']").first().fill("2020-01");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(
      page.locator("app-experience-form").getByText("Acme"),
    ).toBeVisible();

    await page.keyboard.press("ControlOrMeta+z");

    await expect(page.getByText("No work experience added yet.")).toBeVisible();
  });
});

test.describe("Custom sections (nested Signal Forms arrays)", () => {
  test("add, edit, reorder and remove nested items", async ({ page }) => {
    await createResume(page);
    await openTab(page, /Sections/);

    await page.getByRole("button", { name: /Add custom section/i }).click();
    await page.getByRole("button", { name: /Edit/i }).first().click();

    const sectionForm = page.locator("app-custom-section-form");
    const itemTitles = sectionForm.locator(
      "input[placeholder='Award name / Project title']",
    );
    const sectionTitle = page.locator(
      "input[placeholder='Volunteering, Awards, Publications...']",
    );
    await sectionTitle.fill("Awards");

    // A brand-new custom section already ships with one empty starter item;
    // drop it so this test starts from a known-empty list.
    await sectionForm.locator("button[title='Delete item']").first().click();
    await expect(itemTitles).toHaveCount(0);

    await page.getByRole("button", { name: "+ Add Item" }).click();
    await itemTitles.first().fill("Best Paper");

    await page.getByRole("button", { name: "+ Add Item" }).click();
    await itemTitles.nth(1).fill("Hackathon Winner");
    await expect(itemTitles).toHaveCount(2);

    // Reorder: the second item moves to the top, carrying its value with it.
    await sectionForm.locator("button[title='Move up']").nth(1).click();
    await expect(itemTitles.first()).toHaveValue("Hackathon Winner");
    await expect(itemTitles.nth(1)).toHaveValue("Best Paper");

    // Remove the first item; the other one keeps its value.
    await sectionForm.locator("button[title='Delete item']").first().click();
    await expect(itemTitles).toHaveCount(1);
    await expect(itemTitles.first()).toHaveValue("Best Paper");

    // The section title is untouched by all the item churn.
    await expect(sectionTitle).toHaveValue("Awards");
  });
});
