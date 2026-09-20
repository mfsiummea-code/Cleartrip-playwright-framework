const selectors = {
  popup: {
    closeIcon: '[data-testid="closeIcon"]',
  },
  search: {
    fromInput: 'input[placeholder="Where from?"]',
    toInput: 'input[placeholder="Where to?"]',
    searchButton: 'button:has-text("Search Flights")',
    citySuggestion: (cityName) => `[role="listbox"] :has-text("${cityName}")`,
    roundTripRadio: 'input#roundtrip[name="journeyType"]',
    returnDateField: '[data-testid="dateSelectReturn"]',
  },
  fareTypes: {
    student: ':text-is("Student")',
    seniorCitizen: ':text-is("Senior citizen")',
    armedForces: ':text-is("Armed forces")',
  },
};

class HomePage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  async closePopupIfVisible() {
    const closeIcon = this.page.locator(selectors.popup.closeIcon);
    if (await closeIcon.isVisible()) {
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
  const day = targetDate.getDate();
  const month = targetDate.toLocaleDateString('en-US', { month: 'short' });
  return `${dayOfWeek}, ${day} ${month}`;
}

async selectDepartureDate() {
  await this.page.locator(':text-matches("^[A-Za-z]{3}, [A-Za-z]{3}")').first().click();

  const targetDate = this.getTargetDate();
  const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
  const month = targetDate.toLocaleDateString('en-US', { month: 'short' });
  const day = targetDate.getDate();
  const year = targetDate.getFullYear();

  const dateLabel = `${dayOfWeek} ${month} ${day} ${year}`;
  await this.page.locator(`[aria-label="${dateLabel}"]`).click();
}

//TC02 -return date function to select departure date + 1 day
async selectRoundTrip() {
  await this.page.locator(selectors.search.roundTripRadio).click();
}

async selectReturnDate() {
  const targetDate = this.getTargetDate();
  targetDate.setDate(targetDate.getDate() + 1); // return date = departure date + 1 day

  const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
  const month = targetDate.toLocaleDateString('en-US', { month: 'short' });
  const day = targetDate.getDate();
  const year = targetDate.getFullYear();
  const dateLabel = `${dayOfWeek} ${month} ${day} ${year}`;

  await this.page.locator(`[aria-label="${dateLabel}"]`).click();
}

  async selectFareType(fareType) {
  if (!fareType) return; // no fare type selected, skip

  const cssSelector = selectors.fareTypes[fareType];
  await this.page.locator(cssSelector).click();
}

  async clickSearchFlights() {
    await this.page.locator(selectors.search.searchButton).click();
  }
}

module.exports = { HomePage };