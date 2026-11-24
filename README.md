# parabank
Test automation project for the **ParaBank web application**, focused on validating core banking functionalities through automated UI and API tests using Playwright and JavaScript. The project demonstrates test automation best practices, reusable test components, and reliable test execution.

## Project structure

The project uses JavaScript ES modules (`import` and `export`). Include the `.js` extension in relative imports.

- `pages/`: reusable page objects containing locators and page actions.
- `tests/ui/`: browser tests that use page objects.
- `tests/api/`: API tests.
- `test-data/`: non-sensitive test data shared by tests.

## Running tests

Install dependencies and the Chromium browser:

```sh
npm ci
npx playwright install chromium
```

Set `BASE_URL` to the origin of a ParaBank deployment, either in `.env` or in the command environment. The tests expect ParaBank to be available at `/parabank/`:
```sh
BASE_URL=https://parabank.parasoft.com npm test
```

The GitHub Actions workflow uses the public ParaBank site by default; set the repository variable `BASE_URL` to use another deployment. It runs on pushes and pull requests to `main` or `master` and uploads the Playwright report as an artifact. The API test requires the repository secrets described below.

The home-page suite covers main sections, navigation, and refresh. It does not require an account or modify customer data.

## Create-account API test

The API test uses Playwright's request fixture and the `BASE_URL` above. Its non-secret paths and account type are in `test-data/createAccount.js`. Set `API_CUSTOMER_ID` and `API_SOURCE_ACCOUNT_ID` in `.env` to the numeric IDs of a dedicated test customer and an existing account belonging to that customer. The source account must have sufficient funds for the opening deposit. Add the same values as GitHub repository secrets for Actions; secrets are not available to pull requests from forks.

Run the API test alone with:

```sh
npx playwright test tests/api/createAccount.spec.js
```

Each run creates a checking account and may transfer an opening deposit from the source account. It also runs in the full suite and GitHub Actions. Retries are disabled for this test, and created accounts are not automatically deleted.

The positive test compares the retrieved account's initial balance with the source account's opening-transfer debit. The negative and edge tests use synthetic malformed values; the public ParaBank API returned HTTP 404 for these inputs during investigation, although Swagger does not specify their error status.

Do not store credentials or other sensitive test data in the repository.
