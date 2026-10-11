const selectors = {
  search: {
    locationInput: 'div.field-root input[type="text"]',
    suggestionRow: 'li.hotelSuggestionList',
    checkInField: 'div.fromDiv',
    checkOutField: 'div.toDiv',
    travellerSelector: 'div.homePageTraveller',
    searchButton: 'button:has-text("Search hotels")',
  },
};

class HotelHomePage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/hotels', { waitUntil: 'domcontentloaded' });
  }

  getLocationInput() {
    return this.page.locator(selectors.search.locationInput);
  }

  async enterLocation(cityName) {
    const input = this.getLocationInput();
    await input.click();
    await input.pressSequentially(cityName, { delay: 100 });

    const firstSuggestion = this.page.locator(selectors.search.suggestionRow).first();
    await firstSuggestion.waitFor({ state: 'visible' });
    await firstSuggestion.click();
  }

  getTargetCheckInDate() {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 1);
    return targetDate;
  }

  formatAriaDateLabel(date) {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${dayOfWeek} ${month} ${String(day).padStart(2, '0')} ${year}`;
  }

  // Opens the shared calendar and picks check-in then check-out (checkout = checkin + 1 day)
  async selectStayDates() {
    await this.page.locator(selectors.search.checkInField).click();

    const checkIn = this.getTargetCheckInDate();
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 1);

    await this.page.locator(`[aria-label="${this.formatAriaDateLabel(checkIn)}"]`).click();
    await this.page.locator(`[aria-label="${this.formatAriaDateLabel(checkOut)}"]`).click();
  }

  async clickSearchHotels() {
    await this.page.locator(selectors.search.searchButton).click();
  }
}

module.exports = { HotelHomePage };