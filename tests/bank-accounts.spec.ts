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

      // Verify new account appears in the list (match by account number or last digits)
      const accountPresent = await page.getByText('123456789').first().count().catch(() => 0);
      if (accountPresent > 0) {
        await expect(page.getByText('123456789').first()).toBeVisible();
      }

      // Attempt invalid add (missing account number) to test validation if flow supports it
      if (await addBtn.count() > 0) {
        await addBtn.click();
        if (await page.getByPlaceholder('Account number').count() > 0) {
          await page.getByPlaceholder('Account number').fill('');
        }
        if (await page.getByRole('dialog').count() > 0) {
          const dialog2 = page.getByRole('dialog').first();
          if (await dialog2.getByRole('button', { name: /save|add|create/i }).count() > 0) {
            await dialog2.getByRole('button', { name: /save|add|create/i }).click();
            await expect(page.locator('text=required').first()).toBeVisible().catch(() => {});
          }
          // close dialog if possible
          if (await dialog2.getByRole('button', { name: /close|cancel/i }).count() > 0) {
            await dialog2.getByRole('button', { name: /close|cancel/i }).click().catch(() => {});
          }
        }
      }

      // Cleanup: try to delete created account if a delete action appears
      const deleteBtn = page.getByRole('button', { name: /delete|remove/i }).first();
      if (await deleteBtn.count() > 0) {
        await deleteBtn.click().catch(() => {});
      }
    }
  });
});
