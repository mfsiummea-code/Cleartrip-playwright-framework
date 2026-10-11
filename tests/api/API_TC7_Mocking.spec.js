import { test, expect } from '@playwright/test';

test.describe('API Mocking Demo', () => {

  test('mocks the fruit list completely — only shows Umme Abiha', async ({ page }) => {
    // Intercept before navigation so the mock is in place when the page loads
    await page.route('*/**/api/v1/fruits', async (route) => {
      const mockedFruits = [
        { name: 'Umme Abiha', id: 1 },
      ];
      await route.fulfill({ json: mockedFruits });
    });

    await page.goto('https://demo.playwright.dev/api-mocking');

    // Only the mocked fruit should be visible
    await expect(page.getByText('Umme Abiha')).toBeVisible();
  });

  test('simulates a server error on the fruits endpoint', async ({ page }) => {
    await page.route('*/**/api/v1/fruits', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // Wait for the mocked response directly, so we assert on the real status code too
    const [response] = await Promise.all([
      page.waitForResponse('*/**/api/v1/fruits'),
      page.goto('https://demo.playwright.dev/api-mocking'),
    ]);

    // Confirm the mocked status code was actually received
    expect(response.status()).toBe(500);//response assertion

    // No fruit items should render since the API returned an error
    const fruitList = page.locator('li');
    await expect(fruitList).toHaveCount(0);//ui assertion
  });

});


//clear fruit names and add something else instead TC1
// try UI assertion for error test case
// CI/CD - Schedule time, on push/PR, manual workflow

