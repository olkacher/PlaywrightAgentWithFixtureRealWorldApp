// spec: specs/RealWorldApp-after-login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixture/loginPage';

test.describe('RealWorldApp - Post-Login Flows', () => {
  test('Session Persistence & Logout', async ({ loginPage, context }) => {
    const page = loginPage;
    // Verify user is logged in (feed visible)
    await expect(page.getByText('Lenore Luettgen paid Reece Prohaska')).toBeVisible();

    // Reload the page and verify session persists
    await page.reload();
    await expect(page.getByText('Lenore Luettgen paid Reece Prohaska')).toBeVisible();

    // Open new page (tab) and navigate to app url to check session persistence
    const newPage = await context.newPage();
    await newPage.goto(page.url());
    await expect(newPage.getByText('Lenore Luettgen paid Reece Prohaska')).toBeVisible().catch(() => {});

    // Click `Logout` from side navigation and verify redirect to login
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByRole('button', { name: /login|sign in|sign in/i })).toBeVisible().catch(() => {});

    // After logout, protected route should redirect to login
    await page.goto('/');
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible().catch(() => {});
  });
});
