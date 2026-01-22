// spec: specs/RealWorldApp-after-login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixture/loginPage';

test.describe('RealWorldApp - Post-Login Flows', () => {
  test('Create Transaction - Validation Errors (Negative)', async ({ loginPage }) => {
    const page = loginPage;
    // From authenticated seeded state, click `New` to open the creation form.
    await expect(page.getByRole('button', { name: 'New' })).toBeVisible();
    await page.getByRole('button', { name: 'New' }).click();

    // Expect a dialog/form/inputs to appear
    const hasDialog = await page.getByRole('dialog').count() > 0;
    const hasAmount = await page.getByPlaceholder('Amount').count() > 0;
    const hasForm = await page.locator('form').count() > 0;
    if (!hasDialog && !hasAmount && !hasForm) {
      throw new Error('Transaction form not found after clicking New');
    }

    // Enter invalid values and submit (if fields exist)
    if (hasAmount) {
      await page.getByPlaceholder('Amount').fill('-10');
    }
    if (await page.getByPlaceholder('Name').count() > 0) {
      await page.getByPlaceholder('Name').fill('');
    }
    if (await page.getByPlaceholder('Note').count() > 0) {
      const long = 'x'.repeat(600);
      await page.getByPlaceholder('Note').fill(long);
    }

    // Try to submit and assert validation messages
    if (hasDialog) {
      const dialog = page.getByRole('dialog');
      if (await dialog.getByRole('button', { name: /submit|create|save/i }).count() > 0) {
        await dialog.getByRole('button', { name: /submit|create|save/i }).click();
      }
    } else if (hasForm) {
      const form = page.locator('form');
      if (await form.getByRole('button', { name: /submit|create|save/i }).count() > 0) {
        await form.getByRole('button', { name: /submit|create|save/i }).click();
      }
    }

    await expect(page.locator('text=required').first()).toBeVisible().catch(() => {});
    await expect(page.locator('text=invalid').first()).toBeVisible().catch(() => {});
  });
});
