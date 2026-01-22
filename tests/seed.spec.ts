import { test } from './fixture/loginPage';

test.describe('Test group', () => {
  test('seed', async ({ loginPage }) => {
    const page = loginPage;
    await page.waitForTimeout(10000);
  });
});