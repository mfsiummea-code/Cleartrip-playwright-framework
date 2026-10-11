const selectors = {
  selectedFarePrice: 'h2:near(h4:has-text("Selected"), 300)',
  bottomBar: 'div.sc-bdfDLd.jtBToR',
};

class FarePopup {
  constructor(page) {
    this.page = page;
  }

  getSelectedFarePrice() {
    return this.page.locator(selectors.selectedFarePrice).first();
  }

  getBottomConfirmPrice() {
    return this.page.locator(selectors.bottomBar).locator('h2').first();
  }

  getContinueButton() {
    return this.page.locator(selectors.bottomBar).locator('button:has-text("Continue")');
  }

  async clickContinue() {
    const continueButton = this.getContinueButton();
    await continueButton.scrollIntoViewIfNeeded();

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      continueButton.click(),
    ]);

    await newPage.waitForLoadState();
    return newPage;
  }
}

module.exports = { FarePopup };