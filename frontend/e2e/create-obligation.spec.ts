import { expect, test } from "@playwright/test";

const COMPANY_TAX_ID = "0002";
/** Backend mask: digits → `*` then append last 3 chars → `****002` for `0002`. */
const MASKED_TAX_ID = "****002";

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

test.describe("create obligation", () => {
  test("creates an obligation and shows it on detail", async ({ page }) => {
    const title = `E2E obligación ${Date.now()}`;
    const owner = "E2E Owner";

    await page.goto("/es/obligations/create");
    await expect(
      page.getByRole("heading", { name: "Crear obligación" }),
    ).toBeVisible();

    await page.locator("#title").fill(title);
    await page.locator("#description").fill("Creada por Playwright E2E");
    await page.locator("#dueDate").fill(todayIsoDate());
    await page.locator("#owner").fill(owner);
    await page.locator("#companyTaxId").fill(COMPANY_TAX_ID);

    await Promise.all([
      page.waitForURL(/\/es\/obligations\/[0-9a-f-]{36}$/i, {
        timeout: 15_000,
      }),
      page.getByRole("button", { name: "Crear" }).click(),
    ]);

    await expect(page.getByRole("heading", { name: title })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(owner)).toBeVisible();

    const taxIdField = page.locator("div").filter({
      has: page.locator("dt", { hasText: "Tax ID" }),
    });
    await expect(taxIdField.getByText(MASKED_TAX_ID)).toBeVisible();
    await expect(
      taxIdField.getByText(COMPANY_TAX_ID, { exact: true }),
    ).toHaveCount(0);
  });
});
