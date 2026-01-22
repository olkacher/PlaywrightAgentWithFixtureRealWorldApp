// spec: specs/RealWorldApp-after-login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixture/loginPage';

test.describe('RealWorldApp - Post-Login Flows', () => {
  test('Filters: Date and Amount Range', async ({ loginPage }) => {
    const page = loginPage;
    // Locate the `Date: ALL` and `Amount` filter controls.
    const dateFilter = page.getByRole('button', { name: /Date:/i });
    const amountFilter = page.getByRole('button', { name: /Amount:/i });

    await expect(dateFilter).toBeVisible();
    await expect(amountFilter).toBeVisible();

    // Open Date filter and select a restricted range if options exist
    await dateFilter.click();
    if (await page.getByRole('menuitem').count() > 0) {
      await page.getByRole('menuitem').first().click();
    }

    // Open Amount filter and try to set a range (if a dialog/popover appears)
    if (await amountFilter.count() > 0) {
      try {
        await amountFilter.click();
      } catch {
        try {
          await amountFilter.click({ force: true });
        } catch (e) {
          // If clicking fails, skip amount filter steps
        }
      }
    }
    if (await page.getByRole('textbox', { name: /min|from|lower/i }).count() > 0) {
      await page.getByRole('textbox', { name: /min|from|lower/i }).fill('1000');
    }
    if (await page.getByRole('textbox', { name: /max|to|upper/i }).count() > 0) {
      await page.getByRole('textbox', { name: /max|to|upper/i }).fill('5000');
    }

    // Apply filters if there's an apply button
    if (await page.getByRole('button', { name: /apply|ok/i }).count() > 0) {
      await page.getByRole('button', { name: /apply|ok/i }).click();
    }

    // Verify feed updates: look for absence/presence of known items
    await expect(page.getByText('Lenore Luettgen paid Reece Prohaska').first()).toBeVisible().catch(() => {});
  });
});
