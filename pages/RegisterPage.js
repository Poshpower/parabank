export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.form = page.locator('#customerForm');
    this.validationErrors = this.form.locator('.error').filter({ hasText: /\S/ });
    this.heading = page.getByRole('heading', { name: 'Signing up is easy!' });
    this.registerButton = this.form.getByRole('button', { name: 'Register' });
    this.logoutLink = page.getByRole('link', { name: 'Log Out', exact: true });
  }

  async fillForm(data) {
    for (const [name, value] of Object.entries(data)) {
      await this.field(name).fill(value);
    }
  }

  field(name) {
    return this.form.locator(`[name="${name}"]`);
  }

  async submit() {
    await this.registerButton.click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  errorFor(field) {
    return this.page.locator(`[id="${field}.errors"]`);
  }

  welcomeHeading(username) {
    return this.page.getByRole('heading', { name: `Welcome ${username}`, exact: true });
  }

  get successMessage() {
    return this.page.getByText('Your account was created successfully. You are now logged in.');
  }
}
