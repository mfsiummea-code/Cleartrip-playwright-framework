const { test } = require('@playwright/test');

test('cleartrip homepage loads and popup handled', async ({ page }) => {
  await page.goto('/');

  const closeIcon = page.getByTestId('closeIcon');
  if (await closeIcon.isVisible({ timeout: 5000 }).catch(() => false)) {
    await closeIcon.click();
  }

  await page.waitForTimeout(2000);
  console.log(await page.title());
  await page.getByText('One Way').click();
});