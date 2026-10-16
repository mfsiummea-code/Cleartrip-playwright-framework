const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/ui/homepage');
const { ResultsPage } = require('../../pages/ui/resultspage');

test('TC03 - Swap cities and verify search results',{ tag: '@regression' }, async ({ page }) => {
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

  //sort helpers - check the top 5 prices, not just the first two
  const isAscending = (p) => p.every((v, i) => i === 0 || p[i - 1] <= v);
  const isDescending = (p) => p.every((v, i) => i === 0 || p[i - 1] >= v);
  const topPrices = async () => (await resultsPage.getAllFlightPrices()).slice(0, 5);

  // 1st click -> up arrow (ascending)
  await resultsPage.clickPriceSort();
  await expect.poll(async () => isAscending(await topPrices()), { timeout: 10000 }).toBe(true);

  // 2nd click -> down arrow (descending)
  await resultsPage.clickPriceSort();
  await expect.poll(async () => isDescending(await topPrices()), { timeout: 10000 }).toBe(true);

  // 3rd click -> up arrow again (ascending)
  await resultsPage.clickPriceSort();
  await expect.poll(async () => isAscending(await topPrices()), { timeout: 10000 }).toBe(true);
});
