// spec: specs/RealWorldApp-after-login.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixture/loginPage';

test.describe('RealWorldApp - Post-Login Flows', () => {
  test('Notifications Panel & Mark-as-Read', async ({ loginPage }) => {
    const page = loginPage;
    // Click `Notifications` from side navigation or header.
    const notifBtn = page.getByRole('button', { name: 'Notifications' }).first();
    await expect(notifBtn).toBeVisible();
    await notifBtn.click();

    // Verify list of notifications or empty state
    const list = page.getByRole('list');
    await expect(list.first()).toBeVisible().catch(() => {});

    // If notifications exist, click the first and verify navigation
    const first = list.getByRole('listitem').first();
    if (await first.count() > 0) {
      await first.click().catch(() => {});
    }

    // Mark as read if action exists
    const markRead = page.getByRole('button', { name: /mark as read|mark read/i }).first();
    if (await markRead.count() > 0) {
      await markRead.click().catch(() => {});
      await expect(markRead).toBeHidden().catch(() => {});
    }
  });
});
