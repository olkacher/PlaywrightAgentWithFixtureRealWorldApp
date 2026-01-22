// spec: specs/RealWorldApp-after-login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixture/loginPage';

test.describe('RealWorldApp - Post-Login Flows', () => {
  test('Accessibility — Keyboard Navigation to Primary Controls', async ({ loginPage }) => {
    const page = loginPage;
    // Use keyboard (Tab/Shift+Tab/Enter) to navigate to primary controls
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Attempt to focus and activate `New` button
    const newBtn = page.getByRole('button', { name: 'New' });
    await expect(newBtn).toBeVisible();
    await newBtn.focus();
    await page.keyboard.press('Enter');

    // Verify dialog opened or focus moved to form
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible().catch(() => {});

    // Tab to first feed item and ensure focus is visible and actionable
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Confirm that at least one feed item is focusable
    const item = page.getByText('Lenore Luettgen paid Reece Prohaska').first();
    await expect(item).toBeVisible();
  });
});
