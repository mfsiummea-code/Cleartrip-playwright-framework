# Cleartrip Playwright Framework

An end-to-end test automation framework built with [Playwright](https://playwright.dev/) and JavaScript. It covers UI tests on [Cleartrip](https://www.cleartrip.com) and API tests on [ReqRes](https://reqres.in), and follows the Page Object Model (POM) design pattern.

## Features

- Page Object Model for both UI (`pages/ui`) and API (`pages/api`)
- 5 UI test cases and 3 API test cases (positive and negative scenarios)
- Visual comparison using screenshot baselines
- API mocking with `page.route`
- Auth reuse: log in once in global setup and share the token through a custom fixture
- Tags for smoke tests (`@smoke`)
- Multiple reporters: list, Playwright HTML, Allure and JSON
- Screenshots, videos and traces retained on failure
- Cross-browser projects: Chromium, Firefox and WebKit
- CI/CD with GitHub Actions, a daily scheduled smoke run and Allure report published to GitHub Pages

## Project Structure

```
Cleartrip-playwright-framework/
├── .github/workflows/     # GitHub Actions workflow
├── fixtures/
│   └── authFixture.js     # Custom fixture: adds Bearer token to API requests
├── pages/
│   ├── ui/                # UI page objects (HomePage, ResultsPage, FarePopup, ItineraryPage, ...)
│   └── api/               # API client (ReqresApiClient)
├── tests/
│   ├── ui/                # UI specs (UI_TC1 to UI_TC5)
│   └── api/               # API specs (API_TC6 to API_TC8)
├── global-setup.js        # Logs in once before all tests and stores the token
├── playwright.config.js   # Playwright configuration
├── .env                   # Local environment variables (not committed)
└── package.json
```

## Test Cases

### UI (Cleartrip)

| ID | Description |
|---|---|
| UI_TC1 | One-way flight search, with price consistency check across results, fare popup and itinerary |
| UI_TC2 | Round-trip search, onward and return flight selection, summary bar verification |
| UI_TC3 | Swap cities, airline filter and price sorting |
| UI_TC4 | Visual validation of the homepage using screenshot comparison |
| UI_TC5 | Hotel booking flow |

### API (ReqRes and others)

| ID | Description |
|---|---|
| API_TC6 | Users CRUD (GET, POST, PUT, DELETE) plus a negative 404 test |
| API_TC7 | Network mocking: custom response data and a simulated 500 error |
| API_TC8 | Auth reuse: login returns a token, stored token is sent, request without token is rejected |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher (CI uses Node 20)
- npm
- Java (only needed to open Allure reports locally)

## Setup

```bash
# Clone the repository
git clone https://github.com/mfsiummea-code/Cleartrip-playwright-framework
cd Cleartrip-playwright-framework

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

## Environment Variables

Create a `.env` file in the project root:

```env
REQRES_LOGIN_URL=<login endpoint URL>
REQRES_EMAIL=<email>
REQRES_PASSWORD=<password>
```

`global-setup.js` reads these values, logs in once and stores the token in `process.env.AUTH_TOKEN` for the test run. The `.env` file is gitignored. On CI, the same values come from GitHub Secrets.

## Running Tests

```bash
# Run all tests on all browsers
npx playwright test

# Run on one browser
npx playwright test --project=chromium

# Run only smoke tests
npx playwright test --grep @smoke

# Run a single spec file
npx playwright test API_TC6_Users_CRUD --project=chromium

# Run in headed mode
npx playwright test --headed

# Debug a test
npx playwright test --debug

# Open UI mode
npx playwright test --ui
```

### Visual tests

The first run of `toHaveScreenshot` creates the baseline images and reports a failure. Run the test again to compare against them. To accept a new baseline:

```bash
npx playwright test UI_TC4 --update-snapshots
```

Baselines are stored per browser and operating system.

## Reports

| Report | How to open |
|---|---|
| Playwright HTML | `npx playwright show-report` |
| Allure | `npx allure generate allure-results --clean -o allure-report` then `npx allure open allure-report` |
| JSON | `reports/results.json` |

Traces can be opened with `npx playwright show-trace <trace.zip>`.

## CI/CD

The GitHub Actions workflow (`.github/workflows`) runs:

| Trigger | What runs |
|---|---|
| Push or pull request to `master` | `test` job (smoke tests on Chromium by default) |
| Manual run | `test` job with a chosen browser and tag |
| Daily at 07:30 UTC | `smoke-schedule` job (smoke tests on Chromium) |
| Push to `master` | Allure report is published to GitHub Pages |

Playwright and Allure reports are uploaded as artifacts and kept for 14 days. Required repository secrets: `REQRES_LOGIN_URL`, `REQRES_EMAIL`, `REQRES_PASSWORD`.

## Tech Stack

- Playwright Test
- JavaScript (Node.js)
- dotenv
- Allure Playwright reporter
- GitHub Actions and GitHub Pages

## Possible Improvements

- Mobile web projects (for example Pixel 5 and iPhone 12)
- Separate Playwright projects for UI and API tests
- Multiple environment files (`.env.qa`, `.env.staging`)
- Custom logging and `test.step` for clearer reports
- Retries on CI