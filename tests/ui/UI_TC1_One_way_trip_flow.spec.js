const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/ui/homepage');
const { ResultsPage } = require('../../pages/ui/resultspage');
const { FarePopup } = require('../../pages/ui/farepopup');
const { ItineraryPage } = require('../../pages/ui/itinerarypage');

test('TC01 - One way flight search',{ tag: '@smoke' }, async ({ page }) => {
  const homePage = new HomePage(page);
  const resultsPage = new ResultsPage(page);
  const farePopup = new FarePopup(page);

  await homePage.goto();
  await expect(page).toHaveTitle(/Cleartrip/i);

  await homePage.closePopupIfVisible();
  await expect(homePage.getPopupCloseIcon()).toBeHidden();
  await homePage.enterFromCity('Delhi');
  await expect(homePage.getFromInput()).toHaveValue(/Delhi/i);
  await homePage.enterToCity('Mumbai');
  await expect(homePage.getToInput()).toHaveValue(/Mumbai/i);
  await homePage.selectDepartureDate();
  await homePage.selectFareType('student');
  await homePage.clickSearchFlights();

  await expect(page).toHaveURL(/flights\/results/);
  console.log('Book button count:', await resultsPage.getBookButtons().count());
  console.log('Current URL:', page.url());
  await expect(resultsPage.getBookButtons().first()).toBeVisible({ timeout: 30000 });

  // verify from/to locations carried over correctly
  await expect(resultsPage.getFromInput()).toHaveValue(/Delhi/i);
  await expect(resultsPage.getToInput()).toHaveValue(/Mumbai/i);

  // verify fare type is reflected
  await expect(resultsPage.getResultsHeading('Student')).toBeVisible();

  // verify departure date matches what we selected (today + 1 month)
  await expect(resultsPage.getSelectedDateTab(homePage.getResultsDateTabLabel())).toBeVisible();

  //const flightIndexToBook = 1; // change this single value to book any flight dynamically

  const flightCount = await resultsPage.getBookButtonsCount();
  expect(flightCount).toBeGreaterThan(0);
  const flightIndexToBook = Math.min(3, flightCount - 1);

  const cardCount = await resultsPage.page.locator('div.sc-bdfDLd.dDzCFr').count();
console.log('Flight card count:', cardCount);
console.log('Book button count:', flightCount);

  const resultsPrice = await resultsPage.getFlightPrice(flightIndexToBook).innerText();

  await resultsPage.bookFlight(flightIndexToBook);

  await expect(farePopup.getSelectedFarePrice()).toHaveText(resultsPrice);
  await expect(farePopup.getBottomConfirmPrice()).toHaveText(resultsPrice);

const newPage = await farePopup.clickContinue();
const itineraryPage = new ItineraryPage(newPage);

await expect(newPage).toHaveURL(/flights\/itinerary/, {
  timeout: 15000
});

await expect(itineraryPage.getTotalPrice()).toHaveText(resultsPrice);
await expect(itineraryPage.getRouteText()).toContainText('Mumbai');

});


test('TC01b - Fare types are mutually exclusive', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();
  await homePage.closePopupIfVisible();
  await homePage.enterFromCity('Delhi');
  await homePage.enterToCity('Mumbai');
  await homePage.selectDepartureDate();

  await homePage.selectFareType('student');
  await homePage.selectFareType('seniorCitizen');

  await homePage.clickSearchFlights();

  await expect(page).toHaveURL(/sft=senior_citizen/i);
  await expect(page).not.toHaveURL(/sft=student/i);
});






