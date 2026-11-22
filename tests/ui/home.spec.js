import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage.js';

test.describe('Home page', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('verify the home page displays its main sections', async ({ page }) => {
    await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking');
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.tagline).toBeVisible();
    await expect(homePage.atmServices).toBeVisible();
    await expect(homePage.onlineServices).toBeVisible();
    await expect(homePage.latestNews).toBeVisible();
    await expect(homePage.loginHeading).toBeVisible();
  });

  const destinations = [
    { name: 'About Us', link: 'aboutLink', heading: 'ParaSoft Demo Website' },
    { name: 'Contact', link: 'contactLink', heading: 'Customer Care' },
    { name: 'Register', link: 'registerLink', heading: 'Signing up is easy!' },
    { name: 'Forgot login info', link: 'forgotLoginLink', heading: 'Customer Lookup' },
  ];

  for (const destination of destinations) {
    test(`verify ${destination.name} opens from the home page`, async () => {
      await homePage[destination.link].click();
      await expect(homePage.contentHeading).toHaveText(destination.heading);
    });
  }

  test('verify the home link returns to the home page', async ({ page }) => {
    await homePage.aboutLink.click();
    await expect(homePage.contentHeading).toHaveText('ParaSoft Demo Website');

    await homePage.homeLink.click();
    await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking');
    await expect(homePage.latestNews).toBeVisible();
  });

  test('verify the home page remains available after a refresh', async ({ page }) => {
    await page.reload();

    await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking');
    await expect(homePage.loginHeading).toBeVisible();
    await expect(homePage.latestNews).toBeVisible();
  });
});
