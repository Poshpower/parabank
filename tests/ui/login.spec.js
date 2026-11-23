import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import {
  createInvalidCredentials,
  getLoginCredentials,
  loginErrors,
  missingLoginCases,
  whitespaceCredentials,
} from '../../utils/loginData.js';

test.use({ trace: 'off', screenshot: 'off', video: 'off' });

test.describe('Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('verify the customer login form is displayed', async () => {
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('verify a registered user can log in and log out', async () => {
    const { username, password } = getLoginCredentials();
    await loginPage.login(username, password);

    await expect(loginPage.accountsOverview).toBeVisible();
    await expect(loginPage.logoutLink).toBeVisible();

    await loginPage.logout();
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.logoutLink).toHaveCount(0);
  });

  test('verify invalid credentials are rejected', async () => {
    const { username, password } = createInvalidCredentials();
    await loginPage.login(username, password);

    await expect(loginPage.errorMessage).toHaveText(loginErrors.invalid);
    await expect(loginPage.heading).toBeVisible();
  });

  test('verify an incorrect password is rejected for a registered username', async () => {
    const { username } = getLoginCredentials();
    const { password } = createInvalidCredentials();
    await loginPage.login(username, password);

    await expect(loginPage.errorMessage).toHaveText(loginErrors.invalid);
    await expect(loginPage.heading).toBeVisible();
  });

  for (const { name, username, password } of missingLoginCases) {
    test(`verify login is rejected with ${name}`, async () => {
      await loginPage.login(username, password);

      await expect(loginPage.errorMessage).toHaveText(loginErrors.required);
      await expect(loginPage.heading).toBeVisible();
    });
  }

  test('verify whitespace-only credentials do not authenticate', async () => {
    await loginPage.login(whitespaceCredentials.username, whitespaceCredentials.password);

    await expect(loginPage.errorMessage).toHaveText(loginErrors.invalid);
    await expect(loginPage.heading).toBeVisible();
  });
});
