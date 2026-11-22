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

The GitHub Actions workflow uses the public ParaBank site by default; set the repository variable `BASE_URL` to use another deployment. It does not require a `.env` file or secrets.
It runs on branch pushes, pull requests to `main` or `master`, and manual dispatch. The workflow uploads the HTML report and test results, including failure screenshots and traces, as an artifact.

The home-page suite covers main sections, navigation, and refresh. It does not require an account or modify customer data.

Do not store credentials or other sensitive test data in the repository.
