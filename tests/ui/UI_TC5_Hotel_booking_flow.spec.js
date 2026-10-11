const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/ui/homepage');
const { HotelHomePage } = require('../../pages/ui/hotelhomepage');
const { HotelResultsPage } = require('../../pages/ui/hotelresultspage');
const { HotelDetailsPage } = require('../../pages/ui/hoteldetailspage');
const { HotelItineraryPage } = require('../../pages/ui/hotelitinerarypage');

test('TC05 - One way hotel search',{ tag: '@smoke' }, async ({ page }) => {
  const homePage = new HomePage(page);
  const hotelHomePage = new HotelHomePage(page);
  const hotelResultsPage = new HotelResultsPage(page);

  await homePage.goto();
  await homePage.closePopupIfVisible();

  // Navigate to Hotels via the homepage tab 
  await homePage.goToHotels();
  await expect(page).toHaveURL(/\/hotels/);

  await hotelHomePage.enterLocation('Lucknow');
  await expect(hotelHomePage.getLocationInput()).toHaveValue(/Lucknow/i);

  await hotelHomePage.selectStayDates();
  await hotelHomePage.clickSearchHotels();

  await expect(page).toHaveURL(/hotels\/results/);
  await expect(page).toHaveURL(/city=Lucknow/i);

 // dynamic hotel selection - change this single value to pick any hotel card
  const hotelIndexToSelect = 1;

  const hotelCount = await hotelResultsPage.getHotelCardsCount();
  expect(hotelCount).toBeGreaterThan(hotelIndexToSelect);

  const selectedHotelName = await hotelResultsPage.getHotelName(hotelIndexToSelect).innerText();
  const selectedHotelPrice = await hotelResultsPage.getHotelPrice(hotelIndexToSelect).innerText();

  // clicking a hotel card opens it in a new tab 
  const detailsTab = await hotelResultsPage.selectHotel(hotelIndexToSelect);
  const hotelDetailsPage = new HotelDetailsPage(detailsTab);

  await expect(detailsTab).toHaveURL(/hotels\/details/);

  // verify the hotel we clicked on the results page is the same one shown here
  await expect(hotelDetailsPage.getHotelName()).toHaveText(selectedHotelName);
  await expect(hotelDetailsPage.getPrice()).toHaveText(selectedHotelPrice);
  await expect(hotelDetailsPage.getSelectRoomButton()).toBeVisible();

  await hotelDetailsPage.clickSelectRoom();
  await expect(hotelDetailsPage.getRoomOptionBookButton('Room Only')).toBeVisible();
 
  // clicking Book opens the itinerary review page in a new tab
  const itineraryTab = await hotelDetailsPage.clickBookForRoomOption('Room Only');
  const hotelItineraryPage = new HotelItineraryPage(itineraryTab);
 
  await expect(itineraryTab).toHaveURL(/hotels\/itinerary\//);
 
  // a popup appears here for a price change since the last page - dismiss it if present before asserting on the page underneath
  await hotelItineraryPage.closePopupIfVisible();
 
  // verify the correct hotel carried through to the review page
  await expect(hotelItineraryPage.getHotelName()).toHaveText(selectedHotelName);
  await expect(hotelItineraryPage.getTotalPrice()).toHaveText(/₹[\d,]+/);
});