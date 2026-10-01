const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/homepage');
const { ResultsPage } = require('../pages/resultspage');

test('TC03 - Swap cities and verify search results', async ({ page }) => {
  const homePage = new HomePage(page);
  const resultsPage = new ResultsPage(page);

  await homePage.goto();
  await homePage.closePopupIfVisible();

  await homePage.enterFromCity('Delhi');
  await homePage.enterToCity('Mumbai');

  // confirm initial state before swap
  await expect(homePage.getFromInput()).toHaveValue(/Delhi/i);
  await expect(homePage.getToInput()).toHaveValue(/Mumbai/i);

  await homePage.swapCities();

  // confirm swap happened - From now has Mumbai, To now has Delhi
  await expect(homePage.getFromInput()).toHaveValue(/Mumbai/i);
  await expect(homePage.getToInput()).toHaveValue(/Delhi/i);

  await homePage.selectDepartureDate();
  await homePage.clickSearchFlights();

  await expect(page).toHaveURL(/flights\/results/);

  // confirm swap on search results psge
  await expect(resultsPage.getFromInput()).toHaveValue(/Mumbai/i);
  await expect(resultsPage.getToInput()).toHaveValue(/Delhi/i);

  await resultsPage.selectAirlineFilter('Air India');
  await expect(resultsPage.isAirlineFilterChecked('Air India')).toBeChecked();
  // Add when no result is shown for that filter -??

  // default should be ascending - first price should be <= second price
const ascendingPrices = await resultsPage.getAllFlightPrices();
expect(ascendingPrices[0]).toBeLessThanOrEqual(ascendingPrices[1]);

// toggle to descending
await resultsPage.clickPriceSort();
await page.waitForTimeout(500);

const descendingPrices = await resultsPage.getAllFlightPrices();
expect(descendingPrices[0]).toBeGreaterThanOrEqual(descendingPrices[1]);

// toggle back to ascending
await resultsPage.clickPriceSort();
await page.waitForTimeout(500);

const ascendingAgain = await resultsPage.getAllFlightPrices();
expect(ascendingAgain[0]).toBeLessThanOrEqual(ascendingAgain[1]);
});
