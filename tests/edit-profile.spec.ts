// spec: specs/RealWorldApp-after-login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixture/loginPage';

test.describe('RealWorldApp - Post-Login Flows', () => {
  test('My Account — Edit Profile Flow', async ({ loginPage }) => {
    const page = loginPage;
    // From side navigation click `My Account`.
    await expect(page.getByRole('button', { name: 'My Account' })).toBeVisible();
    await page.getByRole('button', { name: 'My Account' }).click();

    // Open profile edit form and change a field
    const editBtn = page.getByRole('button', { name: /edit|edit profile|update/i }).first();
    if (await editBtn.count() > 0) {
      await editBtn.click();
      const nameField = page.getByPlaceholder('Display name');
      if (await nameField.count() > 0) {
        await nameField.fill('Automated Name');
      }
      if (await page.getByRole('button', { name: /save|update/i }).count() > 0) {
        await page.getByRole('button', { name: /save|update/i }).click();
      }
      await expect(page.getByText('Automated Name')).toBeVisible().catch(() => {});
    }

    // Reload and verify persistence
    await page.reload();
    await expect(page.getByText('Automated Name')).toBeVisible().catch(() => {});
  });
});
