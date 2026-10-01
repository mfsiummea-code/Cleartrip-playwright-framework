const selectors = {
  bookButton: 'button:has-text("Book")',
  cityInputWithValue: 'input[type="text"][value]:not([readonly])',
  flightCard: 'div.sc-bdfDLd.dDzCFr',
  airlineFilterRow: 'div.sc-bdfDLd.itIkov',

  // Round-trip additions
  roundTripFlightCard: (leg) =>
    `[data-testid="flight-card"][data-leg="${leg}"]`,
  bookNowButton: 'button:has-text("Book now")',
  comboPrice: 'h2:near(button:has-text("Book now"), 300)',
summaryBar: 'div.sc-bdfDLd.keUNTb.flex',
priceSortToggle: ':text-is("Price")',

summaryAirlineLogo: (airlineCode) =>
  `img[width="32"][height="32"][alt="${airlineCode}"]`,
};

class ResultsPage {
  constructor(page) {
    this.page = page;
  }

  getResultsHeading(fareType) {
    return this.page.getByRole('heading', { name: new RegExp(`Showing results with ${fareType} fare`, 'i') });
  }

  getBookButtons() {
    return this.page.locator(selectors.bookButton);
  }

  async getBookButtonsCount() {
    return await this.page.locator(selectors.bookButton).count();
  }

  getFromInput() {
    return this.page.locator(selectors.cityInputWithValue).first();
  }

  getToInput() {
    return this.page.locator(selectors.cityInputWithValue).nth(1);
  }

  getSelectedDateTab(dateLabel) {
    return this.page.locator(`:text-is("${dateLabel}")`);
  }

  getFlightCard(index) {
    return this.page.locator(selectors.flightCard).nth(index);
  }

  getFlightPrice(index) {
    return this.getFlightCard(index).locator('h2');
  }

  async bookFlight(index = 0) {
    await this.getFlightCard(index).locator(selectors.bookButton).click();
  }

// ---- Round trip methods ----

  getOnwardFlightCard(index) {
    return this.page.locator(selectors.roundTripFlightCard('0')).nth(index);
  }

  getReturnFlightCard(index) {
    return this.page.locator(selectors.roundTripFlightCard('1')).nth(index);
  }

  async selectOnwardFlight(index) {
    await this.getOnwardFlightCard(index).click();
  }

  async selectReturnFlight(index) {
    await this.getReturnFlightCard(index).click();
  }

  async getFlightAirlineCode(cardLocator) {
    return await cardLocator.locator('img').first().getAttribute('alt');
  }

  async getFlightDepartureTime(cardLocator) {
    const text = await cardLocator.innerText();
    const match = text.match(/\d{2}:\d{2}/);
    return match ? match[0] : null;
  }

// finds the filter row for an EXACT airline name match, then clicks its checkbox
async selectAirlineFilter(airlineName) {
  const row = this.page.locator(selectors.airlineFilterRow).filter({
    has: this.page.locator(`:text-is("${airlineName}")`),
  });
  await row.locator('input[type="checkbox"]').first().click();
}

isAirlineFilterChecked(airlineName) {
  const row = this.page.locator(selectors.airlineFilterRow).filter({
    has: this.page.locator(`:text-is("${airlineName}")`),
  });
  return row.locator('input[type="checkbox"]').first();
}

  getComboPrice() {
    return this.page.locator(selectors.comboPrice).first();
  }

getSummaryBar() {
  return this.page
    .locator('div.sc-bdfDLd.keUNTb.flex')
    .filter({
      has: this.page.getByRole('button', { name: 'Book now' })
    })
    .first();
}

getSummaryBarCount() {
  return this.getSummaryBar().count();
}

getSummaryAirlineLogo(airlineCode) {
  return this.getSummaryBar().locator(`img[alt="${airlineCode}"]`).nth(0);
}

getSummaryTimes() {
  return this.getSummaryBar()
    .locator('p')
    .filter({ hasText: /^\d{2}:\d{2}$/ });
}

  getBookNowButton() {
    return this.page.locator(selectors.bookNowButton);
  }

  async clickBookNow() {
    await this.getBookNowButton().click();
  }

  // clicks the "Price" sort control, toggling between ascending/descending
async clickPriceSort() {
  await this.page.locator(selectors.priceSortToggle).first().click();
}

// reads every visible flight card's price and returns them as an array of numbers,
// in the order they currently appear on the page - used to verify sort order
async getAllFlightPrices() {
  const priceElements = await this.page.locator(selectors.flightCard).locator('h2').all();
  const prices = [];
  for (const el of priceElements) {
    const text = await el.innerText();
    const number = parseInt(text.replace(/[^0-9]/g, ''), 10); // strips ₹ and commas, keeps digits
    prices.push(number);
  }
  return prices;
}
}

module.exports = { ResultsPage }; 