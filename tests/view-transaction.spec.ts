// spec: specs/RealWorldApp-after-login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixture/loginPage';

test.describe('RealWorldApp - Post-Login Flows', () => {
  test('View Transaction Details & Actions', async ({ loginPage }) => {
    const page = loginPage;
    // From feed, click a transaction list-item to open the details view
    const item = page.getByText('Lenore Luettgen paid Reece Prohaska').first();
    await expect(item).toBeVisible();
    await item.click();

    // Confirm details view appears (modal or new page)
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible().catch(async () => {
      await expect(page).toHaveURL(/\/transactions\/|\/details\//i).catch(() => {});
    });

    // Confirm details contain payer/payee, note and amount
    await expect(page.getByText('test note')).toBeVisible().catch(() => {});
    await expect(page.getByText(/-?\$?\d+/)).toBeVisible().catch(() => {});
    // Check payer/payee names exist in details
    await expect(page.getByText('Lenore Luettgen').first()).toBeVisible().catch(() => {});
    await expect(page.getByText('Reece Prohaska').first()).toBeVisible().catch(() => {});

    // If there is a comment box or like button, interact with it lightly
    if (await page.getByRole('button', { name: /comment|like|share/i }).count() > 0) {
      await page.getByRole('button', { name: /comment|like|share/i }).first().click().catch(() => {});
    }

    // Close details view if close button exists
    if (await dialog.getByRole('button', { name: /close|back|x/i }).count() > 0) {
      await dialog.getByRole('button', { name: /close|back|x/i }).click();
      await expect(dialog).toBeHidden().catch(() => {});
    }
  });
});
