const selectors = {
  hotelName: 'h1.jXNGCQ',
  price: '#selectRoomHighlights h2.hFFAkE',
  selectRoomButton: '#selectRoomHighlights button:has-text("Select room")',
  roomOptionCard: 'div.inclusionCardWrapper',
  roomOptionHeader: (optionName) => `h4.room--inclusions--header:text-is("${optionName}")`,
};

class HotelDetailsPage {
  constructor(page) {
    this.page = page;
  }

  getHotelName() {
    return this.page.locator(selectors.hotelName);
  }

  getPrice() {
    return this.page.locator(selectors.price);
  }

  getSelectRoomButton() {
    return this.page.locator(selectors.selectRoomButton);
  }

  async clickSelectRoom() {
    await this.getSelectRoomButton().click();
  }

  // scopes to the specific room option card by its exact header text
  getRoomOptionCard(optionName) {
    return this.page.locator(selectors.roomOptionCard).filter({
      has: this.page.locator(selectors.roomOptionHeader(optionName)),
    }).first();
  }

  getRoomOptionPrice(optionName) {
    return this.getRoomOptionCard(optionName).locator('h5.hFFAkE');
  }

  getRoomOptionBookButton(optionName) {
    return this.getRoomOptionCard(optionName).locator('button:has-text("Book")');
  }

  // clicking Book opens the itinerary review page in a new tab 
  async clickBookForRoomOption(optionName) {
    const bookButton = this.getRoomOptionBookButton(optionName);
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      bookButton.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }
}

module.exports = { HotelDetailsPage };