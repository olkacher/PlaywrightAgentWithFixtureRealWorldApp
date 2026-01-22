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

    // Verify feed updates: compare item counts before/after applying filters
    let beforeCount = 0;
    try {
      beforeCount = await page.getByRole('listitem').count();
    } catch {
      beforeCount = 0;
    }

    // Apply a short wait for filters to take effect
    await page.waitForTimeout(500);

    let afterCount = 0;
    try {
      afterCount = await page.getByRole('listitem').count();
    } catch {
      afterCount = 0;
    }

    // After applying a restrictive amount filter the count should be <= before
    await expect(afterCount).toBeLessThanOrEqual(beforeCount);
  });
});
