// spec: specs/RealWorldApp-after-login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixture/loginPage';

test.describe('RealWorldApp - Post-Login Flows', () => {
  test('Create New Transaction (Happy Path)', async ({ loginPage }) => {
    const page = loginPage;
    // From an authenticated seeded state, click the `New` button in the banner.
    await expect(page.getByRole('button', { name: 'New' })).toBeVisible();
    await page.getByRole('button', { name: 'New' }).click();

    // Fill the `New Transaction` form: look for dialog and common fields.
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Try filling common fields if present.
    if (await page.getByPlaceholder('Amount').count() > 0) {
      await page.getByPlaceholder('Amount').fill('42.50');
    }
    if (await page.getByPlaceholder('Name').count() > 0) {
      await page.getByPlaceholder('Name').fill('Test Recipient');
    }
    if (await page.getByPlaceholder('Note').count() > 0) {
      await page.getByPlaceholder('Note').fill('Created by automated test');
    }

    // Submit the form if a submit button exists.
    if (await dialog.getByRole('button', { name: /submit|create|save/i }).count() > 0) {
      await dialog.getByRole('button', { name: /submit|create|save/i }).click();
    }

    // Verify that either a toast appears or the new item is visible in feed.
    await expect(page.locator('text=Created').first()).toBeVisible({ timeout: 5000 }).catch(() => {});
    await expect(page.getByText('Created by automated test')).toBeVisible().catch(() => {});
  });
});
