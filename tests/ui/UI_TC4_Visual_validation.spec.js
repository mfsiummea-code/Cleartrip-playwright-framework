const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/ui/homepage');

test.describe.serial('TC04 - Visual Validation on Homepage', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.closePopupIfVisible();
    });

    // TC04.1 - Element-specific screenshot comparison - should always pass
    test('TC04.1 - Cleartrip logo matches baseline screenshot', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const logo = homePage.getLogo();

        await expect(logo).toBeVisible();

        //Screenshot capture
        const capturePath = testInfo.outputPath('cleartrip-logo-capture.png');
        await logo.screenshot({ path: capturePath });

        //Element specific + Comparison - pixel diff against baseline.
        await expect(logo).toHaveScreenshot('cleartrip-logo.png');
    });

    // TC04.2 - Full page screenshot capture + comparison. EXPECTED TO FAIL after the first (baseline) run.
    test('TC04.2 - Full page screenshot capture and comparison', async ({ page }, testInfo) => {
        const capturePath = testInfo.outputPath('homepage-full-capture.png');
        await page.screenshot({ path: capturePath, fullPage: true });

        // "Comparison" requirement - full-page pixel diff against stored baseline.
        await expect(page).toHaveScreenshot('homepage-full.png', { fullPage: true });
    });

    // TC04.3 - Deliberate baseline mismatch. Will ALWAYS Fail
    test('TC04.3 - Search button deliberately compared against wrong baseline (expected failure)', async ({ page }) => {
        const homePage = new HomePage(page);
        const searchButton = page.locator('button:has-text("Search Flights")');

        await expect(searchButton).toBeVisible();
        // Intentionally reusing 'cleartrip-logo.png' as the baseline here - this is
        // the wrong image for this element on purpose, to force a deterministic fail.
        await expect(searchButton).toHaveScreenshot('cleartrip-logo.png');
    });
});