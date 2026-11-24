import { test, expect } from '@playwright/test';
import {
  accountEndpoints,
  jsonHeaders,
  successStatus,
} from '../../test-data/createAccount.js';

import {
  depositAmounts,
  depositEndpoint,
  invalidDepositRequests,
  transactionsEndpoint,
} from '../../test-data/deposit.js';

test.describe('Deposit API', () => {
  test.describe.configure({ mode: 'serial' });

  for (const { name, amount } of depositAmounts) {

    test(`Verify a customer can deposit ${name}`, async ({ request }) => {

      const customerId = process.env.API_CUSTOMER_ID;
      const accountId = process.env.API_SOURCE_ACCOUNT_ID;


      const accountResponse = await request.get(
        accountEndpoints.byId(accountId),
        { headers: jsonHeaders }
      );
      
      expect(accountResponse.status()).toBe(successStatus);

      const account = await accountResponse.json();

      expect(account.customerId).toBe(Number(customerId));

      const initialBalance = account.balance;

      expect(typeof initialBalance).toBe('number');


      const response = await request.post(depositEndpoint, {
        params: { accountId, amount },
        headers: jsonHeaders,
      });

      expect(response.status()).toBe(successStatus);


      const updatedAccountResponse = await request.get(
        accountEndpoints.byId(accountId),
        { headers: jsonHeaders }
      );

      expect(updatedAccountResponse.status()).toBe(successStatus);

      const updatedAccount = await updatedAccountResponse.json();


      expect(updatedAccount).toMatchObject({
        id: Number(accountId),
        customerId: Number(customerId),
        type: account.type,
      });

      expect(updatedAccount.balance).toBeCloseTo(
        initialBalance + Number(amount),
        2
      );

    });

  }

  for (const { name, params, expectedStatus } of invalidDepositRequests) {

    test(`Verify deposit rejects ${name}`, async ({ request }) => {

      const accountId = process.env.API_SOURCE_ACCOUNT_ID;

      const beforeResponse = await request.get(
        accountEndpoints.byId(accountId),
        { headers: jsonHeaders }
      );

      expect(beforeResponse.status()).toBe(successStatus);

      const beforeAccount = await beforeResponse.json();

      const beforeTransactionsResponse = await request.get(
        transactionsEndpoint(accountId),
        { headers: jsonHeaders }
      );

      expect(beforeTransactionsResponse.status()).toBe(successStatus);

      const beforeTransactions = await beforeTransactionsResponse.json();

      const response = await request.post(depositEndpoint, {
        params,
        headers: jsonHeaders,
      });

      expect(response.status()).toBe(expectedStatus);
      expect(response.ok()).toBe(false);

      const afterResponse = await request.get(
        accountEndpoints.byId(accountId),
        { headers: jsonHeaders }
      );

      expect(afterResponse.status()).toBe(successStatus);

      const afterAccount = await afterResponse.json();

      expect(afterAccount.balance).toBe(beforeAccount.balance);

      const afterTransactionsResponse = await request.get(
        transactionsEndpoint(accountId),
        { headers: jsonHeaders }
      );

      expect(afterTransactionsResponse.status()).toBe(successStatus);

      const afterTransactions = await afterTransactionsResponse.json();

      expect(afterTransactions).toHaveLength(beforeTransactions.length);

      expect(afterTransactions).toEqual(
        expect.arrayContaining(beforeTransactions)
      );
    });
  }
});