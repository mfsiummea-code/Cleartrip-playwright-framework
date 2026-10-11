const selectors = {
  totalPriceBox: 'div.sc-bdfDLd.gGPkas',
  routeHeader: 'div.sc-bdfDLd.ezMTvV',
};

class ItineraryPage {
  constructor(page) {
    this.page = page;
  }

  getTotalPrice() {
    return this.page.locator(selectors.totalPriceBox).locator('h2').first();
  }

  getRouteText() {
    return this.page.locator(selectors.routeHeader).locator('h3').first();
  }
}

module.exports = { ItineraryPage };