import { test, expect } from '@playwright/test';
import {
  accountEndpoints,
  checkingAccount,
  invalidAccountRequests,
  jsonHeaders,
  successStatus,
} from '../../test-data/createAccount.js';

test.describe('Create account API', () => {

  test('Verify a customer can create a checking account', async ({ request }) => {

    const customerId = process.env.API_CUSTOMER_ID;
    const sourceAccountId = process.env.API_SOURCE_ACCOUNT_ID;

    expect(customerId).toMatch(/^[1-9]\d*$/);
    expect(sourceAccountId).toMatch(/^[1-9]\d*$/);

    const response = await request.post(accountEndpoints.create, {
      params: {
        customerId,
        newAccountType: checkingAccount.requestType,
        fromAccountId: sourceAccountId,
      },
      headers: jsonHeaders,
    });

    expect(response.status()).toBe(successStatus);
    expect(response.headers()['content-type']).toContain('application/json');

    const account = await response.json();

    expect(account).toMatchObject({
      customerId: Number(customerId),
      type: checkingAccount.responseType,
      balance: 0,
    });

    expect(Number.isInteger(account.id)).toBe(true);
    expect(account.id).toBeGreaterThan(0);
    expect(account.id).not.toBe(Number(sourceAccountId));

  });

  for (const { name, params, expectedStatus } of invalidAccountRequests) {

    test(`Verify account creation rejects ${name}`, async ({ request }) => {

      const response = await request.post(accountEndpoints.create, {
        params,
        headers: jsonHeaders,
      });

      expect(response.status()).toBe(expectedStatus);
    });
  }
});