const selectors = {
  hotelCard: 'a[href^="/hotels/details/"]',
  hotelName: 'span.hDWMSz',
  hotelPrice: 'p.hTAEcN',
};

class HotelResultsPage {
  constructor(page) {
    this.page = page;
  }

  getHotelCards() {
    return this.page.locator(selectors.hotelCard);
  }

  async getHotelCardsCount() {
    return await this.page.locator(selectors.hotelCard).count();
  }

  getHotelCard(index) {
    return this.page.locator(selectors.hotelCard).nth(index);
  }

  getHotelName(index) {
    return this.getHotelCard(index).locator(selectors.hotelName);
  }

  getHotelPrice(index) {
    return this.getHotelCard(index).locator(selectors.hotelPrice);
  }

  // clicks any hotel card by index (dynamic, not hardcoded to the first result)
  // and opens in a new tab - same target="_blank" pattern as TC01's Continue button
  async selectHotel(index = 0) {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.getHotelCard(index).click(),
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }
}

module.exports = { HotelResultsPage };