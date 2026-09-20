const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/homepage');
const { ResultsPage } = require('../pages/resultspage');

test('TC02 - Round trip flight search', async ({ page }) => {
  const homePage = new HomePage(page);
  const resultsPage = new ResultsPage(page);

  await homePage.goto();
  await expect(page).toHaveTitle(/Cleartrip/i);
  await homePage.closePopupIfVisible();
  await expect(homePage.getPopupCloseIcon()).toBeHidden();

  await homePage.selectRoundTrip();
  await homePage.enterFromCity('Delhi');
  await expect(homePage.getFromInput()).toHaveValue(/Delhi/i);
  await homePage.enterToCity('Mumbai');
  await expect(homePage.getToInput()).toHaveValue(/Mumbai/i);

  await homePage.selectDepartureDate();
  await homePage.selectReturnDate();
  await homePage.clickSearchFlights();

  await expect(page).toHaveURL(/flights\/results/);
  await expect(page).toHaveURL(/rnd_one=R/i);

  const onwardIndex = 0; // change to any index
  const returnIndex = 0; // change to any index

  const onwardCard = resultsPage.getOnwardFlightCard(onwardIndex);
  const returnCard = resultsPage.getReturnFlightCard(returnIndex);

  // capture what we're about to select, before clicking
  const onwardAirline = await resultsPage.getFlightAirlineCode(onwardCard);
  const onwardTime = await resultsPage.getFlightDepartureTime(onwardCard);
  const returnAirline = await resultsPage.getFlightAirlineCode(returnCard);
  const returnTime = await resultsPage.getFlightDepartureTime(returnCard);

  await resultsPage.selectOnwardFlight(onwardIndex);
  await expect(onwardCard).toHaveAttribute('data-selected', 'true');

  await resultsPage.selectReturnFlight(returnIndex);
  await expect(returnCard).toHaveAttribute('data-selected', 'true');

  // verify the summary bar reflects exactly what we selected
console.log(
  'Summary bar count:',
  await resultsPage.getSummaryBarCount()
);
  await expect(resultsPage.getSummaryAirlineLogo(onwardAirline)).toHaveCount(1);
  await expect(resultsPage.getSummaryTimes().filter({ hasText: onwardTime }).first()).toBeVisible();
  await expect(resultsPage.getSummaryTimes().filter({ hasText: returnTime }).last()).toBeVisible();
  await expect(resultsPage.getComboPrice()).toBeVisible();
  await resultsPage.clickBookNow();

  await page.waitForTimeout(3000);
});