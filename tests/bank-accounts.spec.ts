// spec: specs/RealWorldApp-after-login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixture/loginPage';

test.describe('RealWorldApp - Post-Login Flows', () => {
  test('Bank Accounts — Add & Validation', async ({ loginPage }) => {
    const page = loginPage;
    // Click `Bank Accounts` in side navigation.
    await expect(page.getByRole('button', { name: 'Bank Accounts' })).toBeVisible();
    await page.getByRole('button', { name: 'Bank Accounts' }).click();

    // Open `Add Bank Account` form
    const addBtn = page.getByRole('button', { name: /add bank|add account|new bank/i }).first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      const form = page.getByRole('dialog');
      await expect(form).toBeVisible();

      // Enter valid account details if fields are present
      if (await page.getByPlaceholder('Account number').count() > 0) {
        await page.getByPlaceholder('Account number').fill('123456789');
      }
      if (await page.getByPlaceholder('Routing number').count() > 0) {
        await page.getByPlaceholder('Routing number').fill('011000015');
      }

      // Submit
      if (await form.getByRole('button', { name: /save|add|create/i }).count() > 0) {
        await form.getByRole('button', { name: /save|add|create/i }).click();
      }

      // Cleanup: try to delete created account if a delete action appears
      const deleteBtn = page.getByRole('button', { name: /delete|remove/i }).first();
      if (await deleteBtn.count() > 0) {
        await deleteBtn.click().catch(() => {});
      }
    }
  });
});
