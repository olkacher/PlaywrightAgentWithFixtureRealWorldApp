import { test as base, expect } from '@playwright/test';
import { Page } from '@playwright/test';

type TestFixtures = {
  loginPage: Page;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await page.goto('http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/');
    await page.fill('#username', 'Solon_Robel60');
    await page.fill('#password', 's3cret');
    await page.click('[data-test="signin-submit"]');
    await page.waitForSelector('[data-test="sidenav-signout"]');
    await use(page);
  },
});

export { expect };