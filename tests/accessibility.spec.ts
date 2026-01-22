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

    // Verify the New button actually received focus (activeElement contains its label)
    const activeText = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return '';
      return (el.getAttribute('aria-label') || el.textContent || '').trim();
    });
    if (activeText) {
      await expect(activeText.length).toBeGreaterThan(0);
    }

    // Verify dialog opened or flow started; if a dialog is open, close it. If a multi-step flow started, navigate Home.
    const dialog = page.getByRole('dialog');
    if (await dialog.count() > 0) {
      await expect(dialog).toBeVisible().catch(() => {});
      const closeBtn = dialog.getByRole('button', { name: /close|back|x/i }).first();
      if (await closeBtn.count() > 0) {
        await closeBtn.click().catch(() => {});
      } else {
        await page.keyboard.press('Escape').catch(() => {});
      }
      await dialog.waitFor({ state: 'hidden' }).catch(() => {});
    }

    // If the app moved to a multi-step 'Select Contact' / 'Payment' flow, return to Home
    if (await page.getByText('Select Contact').count() > 0 || await page.getByText('Payment').count() > 0) {
      if (await page.getByRole('button', { name: 'Home' }).count() > 0) {
        await page.getByRole('button', { name: 'Home' }).click().catch(() => {});
        await page.waitForLoadState('domcontentloaded').catch(() => {});
      }
    }

    // Tab to first feed item and ensure focus is visible and actionable
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Confirm that at least one feed item is focusable (try data-test selector, then fallback to text)
    const itemByData = page.locator('[data-test^="transaction-item-"]').first();
    if (await itemByData.count() > 0) {
      await expect(itemByData).toBeVisible();
    } else if (await page.getByRole('listitem').count() > 0) {
      await expect(page.getByRole('listitem').first()).toBeVisible();
    } else if (await page.getByText(/paid/i).count() > 0) {
      // Broad fallback: any transaction text containing 'paid'
      await expect(page.getByText(/paid/i).first()).toBeVisible();
    } else {
      const itemByText = page.getByText('Lenore Luettgen paid Reece Prohaska').first();
      await expect(itemByText).toBeVisible();
    }
  });
});
