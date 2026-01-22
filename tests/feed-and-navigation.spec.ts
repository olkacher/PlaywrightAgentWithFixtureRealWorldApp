// spec: specs/RealWorldApp-after-login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixture/loginPage';

test.describe('RealWorldApp - Post-Login Flows', () => {
  test('Feed Loads & Primary Navigation', async ({ loginPage }) => {
    const page = loginPage;
    // Verify the header/banner shows the New button
    await expect(page.getByRole('button', { name: 'New' })).toBeVisible();

    // Verify 'Everyone' tab is present and selected by default (visible)
    await expect(page.getByText('Everyone')).toBeVisible();

    // Click the 'Friends' tab to switch feed content
    await page.locator('[data-test="nav-contacts-tab"]').click();

    // Verify side navigation contains Home button
    await expect(page.getByRole('button', { name: 'Home' })).toBeVisible();

    // Click 'Home' to return to feed view
    await page.locator('[data-test="sidenav-home"]').click();

    // Final assertion: feed has at least one transaction item
    await expect(page.getByText('Lenore Luettgen paid Reece Prohaska')).toBeVisible();
  });
});
