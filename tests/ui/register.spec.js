import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage.js';
import { RegisterPage } from '../../pages/RegisterPage.js';
import {
  createRegistrationData,
  credentialSpaceCases,
  duplicateUsernameError,
  passwordMismatchError,
  passwordMismatchSuffix,
  registrationBoundaries,
  registrationLongInputs,
  requiredRegistrationErrors,
  specialPasswordPrefix,
  specialUsernameSuffix,
  whitespaceOnly,
  withCredentialSpace,
  withFieldLength,
} from '../../utils/registrationData.js';

test.use({ trace: 'off', screenshot: 'off', video: 'off' });

test.describe('Registration', () => {
  let registerPage;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    registerPage = new RegisterPage(page);
    await homePage.goto();
    await homePage.clickRegister();
    await expect(registerPage.heading).toBeVisible();
  });


  test('verify a new user can register', async () => {
    const data = createRegistrationData();

    await registerPage.fillForm(data);
    await registerPage.submit();

    await expect(registerPage.welcomeHeading(data['customer.username'])).toBeVisible();

    await expect(registerPage.successMessage
    ).toBeVisible();
  });

  test('verify required-field errors appear when the form is empty', async () => {
    await registerPage.submit();

    for (const [field, message] of Object.entries(requiredRegistrationErrors)) {
      await expect(registerPage.errorFor(field)).toHaveText(message);
    }
    await expect(registerPage.errorFor('customer.phoneNumber')).toHaveCount(0);
  });

  test('verify registration rejects mismatched passwords', async () => {
    const data = createRegistrationData();
    data.repeatedPassword = `${data['customer.password']}${passwordMismatchSuffix}`;
    await registerPage.fillForm(data);
    await registerPage.submit();

    await expect(registerPage.errorFor('repeatedPassword')).toHaveText(passwordMismatchError);
    await expect(registerPage.heading).toBeVisible();
  });

  test('verify registration requires password confirmation', async () => {
    const data = createRegistrationData();
    data.repeatedPassword = '';
    await registerPage.fillForm(data);
    await registerPage.submit();

    await expect(registerPage.errorFor('repeatedPassword')).toHaveText(requiredRegistrationErrors.repeatedPassword);
    await expect(registerPage.heading).toBeVisible();
  });

  for (const [field, message] of Object.entries(requiredRegistrationErrors)) {
    test(`verify ${field} is required when other fields are completed`, async () => {
      const data = createRegistrationData();
      data[field] = '';
      await registerPage.fillForm(data);
      await registerPage.submit();

      await expect(registerPage.errorFor(field)).toHaveText(message);
      await expect(registerPage.heading).toBeVisible();
    });

    test(`verify whitespace-only ${field} is not treated as empty`, async () => {
      const data = createRegistrationData();
      data[field] = whitespaceOnly;
      if (field !== 'customer.password' && field !== 'repeatedPassword') {
        data.repeatedPassword += passwordMismatchSuffix;
      }
      await registerPage.fillForm(data);
      await registerPage.submit();

      await expect(registerPage.errorFor('repeatedPassword')).toHaveText(passwordMismatchError);
      if (field !== 'repeatedPassword') {
        await expect(registerPage.errorFor(field)).toHaveCount(0);
      }
      await expect(registerPage.heading).toBeVisible();
    });
  }

  test('verify an existing username cannot be registered again', async ({ page }) => {
    const data = createRegistrationData();
    await registerPage.fillForm(data);
    await registerPage.submit();
    await expect(registerPage.welcomeHeading(data['customer.username'])).toBeVisible();
    await expect(registerPage.successMessage).toBeVisible();

    await registerPage.logout();
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.clickRegister();
    await registerPage.fillForm(data);
    await registerPage.submit();

    await expect(registerPage.errorFor('customer.username')).toHaveText(duplicateUsernameError);
    await expect(registerPage.heading).toBeVisible();
  });

  test('verify registration succeeds without a phone number', async () => {
    const data = createRegistrationData();
    data['customer.phoneNumber'] = '';
    await registerPage.fillForm(data);
    await registerPage.submit();

    await expect(registerPage.welcomeHeading(data['customer.username'])).toBeVisible();
    await expect(registerPage.successMessage).toBeVisible();
  });

  for (const { field, name, length } of registrationLongInputs) {
    test(`verify the ${name} field accepts ${length} characters while typing`, async () => {
      const data = withFieldLength(createRegistrationData(), field, length);
      await registerPage.field(field).fill(data[field]);

      await expect(registerPage.field(field)).toHaveValue(data[field]);
    });
  }

  for (const { field, name, limit } of registrationBoundaries) {
    test(`verify registration accepts a ${limit}-character ${name}`, async () => {
      const data = withFieldLength(createRegistrationData(), field, limit);
      await registerPage.fillForm(data);
      await registerPage.submit();

      await expect(registerPage.welcomeHeading(data['customer.username'])).toBeVisible();
      await expect(registerPage.successMessage).toBeVisible();
    });

    test(`verify registration rejects a ${limit + 1}-character ${name}`, async () => {
      const data = withFieldLength(createRegistrationData(), field, limit + 1);
      await registerPage.fillForm(data);
      await registerPage.submit();

      await expect(registerPage.form).toBeVisible();
      await expect(registerPage.validationErrors).not.toHaveCount(0);
      await expect(registerPage.successMessage).not.toBeVisible();
    });
  }

  test('verify registration accepts special characters in credentials', async () => {
    const data = createRegistrationData();
    data['customer.username'] = `${data['customer.username'].slice(0, 17)}${specialUsernameSuffix}`;
    data['customer.password'] = `${specialPasswordPrefix}${data['customer.password']}`;
    data.repeatedPassword = data['customer.password'];
    await registerPage.fillForm(data);
    await registerPage.submit();

    await expect(registerPage.welcomeHeading(data['customer.username'])).toBeVisible();
    await expect(registerPage.successMessage).toBeVisible();
  });

  for (const { field, name, position } of credentialSpaceCases) {
    test(`verify registration rejects ${position} spaces in the ${name}`, async () => {
      const data = withCredentialSpace(createRegistrationData(), field, position);
      await registerPage.fillForm(data);
      await registerPage.submit();

      await expect(registerPage.form).toBeVisible();
      await expect(registerPage.successMessage).not.toBeVisible();
    });
  }
});
