const selectors = {
  popup: {
    closeIcon: '[data-testid="closeIcon"]',
  },
  search: {
    fromInput: 'input[placeholder="Where from?"]',
    toInput: 'input[placeholder="Where to?"]',
    searchButton: 'button:has-text("Search Flights")',
    citySuggestion: (cityName) => `[role="listbox"] :has-text("${cityName}")`,
    roundTripRadio: 'input#roundtrip[name="journeyType"]', // radio button to switch the search mode from "One way" to "Round trip"
    returnDateField: '[data-testid="dateSelectReturn"]', // the return-date field shown only when Round trip is selected
    swapButton: `svg.c-pointer:near(input[placeholder="Where from?"], 100)`, // the swap icon between "From" and "To" fields to exchange the two cities
  },
  fareTypes: {
    student: ':text-is("Student")',
    seniorCitizen: ':text-is("Senior citizen")',
    armedForces: ':text-is("Armed forces")',
  },
  header: {
    logoWrapper: 'div.sc-bdfDLd.kWzmOd', // container div wrapping the Cleartrip logo SVG + adjacent "A Flipkart Company" tagline SVG
    logo: 'div.sc-bdfDLd.kWzmOd svg:first-of-type', // the Cleartrip logo mark specifically - first svg in the wrapper (second svg is the Flipkart tagline)
    hotelsTab: 'a[href="/hotels"]',
  },
};

class HomePage {
  constructor(page) {
    this.page = page;
  }

      async goto() {
    // Dismiss the login popup whenever it appears and blocks an action
    await this.page.addLocatorHandler(
      this.page.locator(selectors.popup.closeIcon),
      async (closeIcon) => {
        await closeIcon.click();
      }
    );
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

    async closePopupIfVisible() {
    const closeIcon = this.page.locator(selectors.popup.closeIcon);

    // Give the popup up to 5s to appear. If it never does, there's nothing to close.
    const appeared = await closeIcon
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    if (appeared) {
      await closeIcon.click();
    }
  }

  getPopupCloseIcon() {
    return this.page.locator(selectors.popup.closeIcon);
  }

  getFromInput() {
    return this.page.locator(selectors.search.fromInput);
  }

  getToInput() {
    return this.page.locator(selectors.search.toInput);
  }

  async enterFromCity(cityName) {
    const fromInput = this.page.locator(selectors.search.fromInput);
    await fromInput.click();
    await fromInput.fill(cityName);
    await this.page.locator(selectors.search.citySuggestion(cityName)).last().click();
  }

  async enterToCity(cityName) {
    const toInput = this.page.locator(selectors.search.toInput);
    await toInput.click();
    await toInput.fill(cityName);
    await this.page.locator(selectors.search.citySuggestion(cityName)).last().click();
  }

  getTargetDate() {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 1);
    return targetDate;
  }

  getResultsDateTabLabel() {
    const targetDate = this.getTargetDate();
    const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
    const day = String(targetDate.getDate()).padStart(2, '0');
    const month = targetDate.toLocaleDateString('en-US', { month: 'short' });
    return `${dayOfWeek}, ${day} ${month}`;
  }

  async selectDepartureDate() {
    await this.page.locator(':text-matches("^[A-Za-z]{3}, [A-Za-z]{3}")').first().click();

    const targetDate = this.getTargetDate();
    const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
    const month = targetDate.toLocaleDateString('en-US', { month: 'short' });
    const day = String(targetDate.getDate()).padStart(2, '0');
    const year = targetDate.getFullYear();

    const dateLabel = `${dayOfWeek} ${month} ${day} ${year}`;
    await this.page.locator(`[aria-label="${dateLabel}"]`).click();
  }

  //TC02- clicks the "Round trip" radio button, switching the search form out of "One way" mode
  async selectRoundTrip() {
    await this.page.locator(selectors.search.roundTripRadio).click();
  }

  // picks the return date on the calendar. Assumes the calendar is already open
  // (left open by selectDepartureDate()) - Cleartrip uses ONE shared calendar for
  // both departure and return dates in round-trip mode, so we don't reopen anything here.
  // Return date is always set to (departure date + 1 day).
  async selectReturnDate() {
    const targetDate = this.getTargetDate();
    targetDate.setDate(targetDate.getDate() + 1); // return date = departure date + 1 day

    const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
    const month = targetDate.toLocaleDateString('en-US', { month: 'short' });
    const day = String(targetDate.getDate()).padStart(2, '0');
    const year = targetDate.getFullYear();
    const dateLabel = `${dayOfWeek} ${month} ${day} ${year}`;

    await this.page.locator(`[aria-label="${dateLabel}"]`).click();
  }

  async selectFareType(fareType) {
    if (!fareType) return; // no fare type selected, skip

    const cssSelector = selectors.fareTypes[fareType];
    await this.page.locator(cssSelector).click();
  }

  // clicks the swap icon to exchange the "From" and "To" city fields
  async swapCities() {
    await this.page.locator(selectors.search.swapButton).first().click();
  }

  async clickSearchFlights() {
    await this.page.locator(selectors.search.searchButton).click();
  }

  // TC04 - returns the Cleartrip logo element (used for visual/screenshot comparison tests)
  getLogo() {
    return this.page.locator(selectors.header.logo);
  }
  
  async goToHotels() {
  await this.page.locator(selectors.header.hotelsTab).click();
}
}

module.exports = { HomePage };