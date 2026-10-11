const selectors = {
  popupClose: 'div.gjZYNL',
  hotelName: 'h3.dGUNJF',
  totalPrice: 'div.bflckb h2.hFFAkE',
};
 
class HotelItineraryPage {
  constructor(page) {
    this.page = page;
  }
 
  async closePopupIfVisible() {
    const closeButton = this.page.locator(selectors.popupClose);
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }
 
  getHotelName() {
    return this.page.locator(selectors.hotelName);
  }
 
  getTotalPrice() {
    return this.page.locator(selectors.totalPrice);
  }
}
 
module.exports = { HotelItineraryPage };