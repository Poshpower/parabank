export class HomePage {
  constructor(page) {
    this.page = page;
    this.loginHeading = page.getByRole('heading', { name: 'Customer Login' });
    this.logo = page.getByRole('img', { name: 'ParaBank', exact: true });
    this.tagline = page.getByText('Experience the difference');
    this.atmServices = page.getByText('ATM Services', { exact: true });
    this.onlineServices = page.getByText('Online Services', { exact: true });
    this.latestNews = page.getByRole('heading', { name: 'Latest News' });
    this.aboutLink = page.locator('#headerPanel').getByRole('link', { name: 'About Us', exact: true });
    this.contactLink = page.locator('#headerPanel').getByRole('link', { name: 'contact', exact: true });
    this.homeLink = page.locator('#headerPanel').getByRole('link', { name: 'home', exact: true });
    this.registerLink = page.getByRole('link', { name: 'Register', exact: true });
    this.forgotLoginLink = page.getByRole('link', { name: 'Forgot login info?', exact: true });
    this.contentHeading = page.locator('#rightPanel').getByRole('heading', { level: 1 });
  }

  async goto() {
    await this.page.goto('/parabank/index.htm');
  }
}
