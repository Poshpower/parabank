# ParaBank Test Automation

This project contains UI and API automation tests for the [ParaBank web application](https://parabank.parasoft.com), built with Playwright and JavaScript.

The tests cover core banking functionalities and include positive, negative, and edge-case scenarios.

## Project structure

- `pages/` – Reusable page objects, locators, and actions.
- `tests/ui/` – UI automation tests.
- `tests/api/` – API automation tests.
- `test-data/` – Shared test data.

The project uses JavaScript ES modules (`import` and `export`). Include `.js` extensions in relative imports.

## Running the tests

Install dependencies and Chromium:

```sh
npm ci
npx playwright install chromium
```

Set `BASE_URL` in your `.env` file or pass it when running the tests:

```sh
BASE_URL=https://parabank.parasoft.com npm test
```

## API test configuration

The create-account and deposit tests require:

- `API_CUSTOMER_ID` – ID of a dedicated test customer.
- `API_SOURCE_ACCOUNT_ID` – ID of an existing account belonging to that customer.

Add these values to your `.env` file and GitHub repository secrets.

Run individual API tests:

```sh
npx playwright test tests/api/createAccount.spec.js
npx playwright test tests/api/deposit.spec.js
```

**Note:** These API tests modify account data. Create-account tests create new accounts, while deposit tests add $1.00 and $0.01 per successful run. Retries are disabled, and created accounts are not automatically deleted.

The negative and edge cases use invalid inputs. The public API returned HTTP 404 during testing, although the Swagger documentation does not specify the expected error responses.

## GitHub Actions

The project includes a GitHub Actions workflow that runs tests on pushes and pull requests to `main` or `master`. It uploads the Playwright report as an artifact.

The home-page UI tests do not require an account or modify customer data.