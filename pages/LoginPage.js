export class LoginPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Customer Login' });
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.errorMessage = page.locator('#rightPanel .error');
    this.accountsOverview = page.getByRole('heading', { name: 'Accounts Overview', exact: true });
    this.logoutLink = page.getByRole('link', { name: 'Log Out', exact: true });
  }

  async goto() {
    await this.page.goto('/parabank/index.htm');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.logoutLink.click();
  }
}
