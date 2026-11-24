export const accountEndpoints = {
  create: '/parabank/services/bank/createAccount',
  byId: (id) => `/parabank/services/bank/accounts/${id}`,
  byCustomer: (id) => `/parabank/services/bank/customers/${id}/accounts`,
};

export const checkingAccount = {
  requestType: 0,
  responseType: 'CHECKING',
};

export const jsonHeaders = { Accept: 'application/json' };
export const successStatus = 200;

export const invalidAccountRequests = [
  {
    name: 'a non-numeric customer ID',
    params: { customerId: 'invalid', newAccountType: 0, fromAccountId: 0 },
    expectedStatus: 404,
  },
  {
    name: 'a non-numeric account type',
    params: { customerId: 0, newAccountType: 'invalid', fromAccountId: 0 },
    expectedStatus: 404,
  },
  {
    name: 'a non-numeric source account ID',
    params: { customerId: 0, newAccountType: 0, fromAccountId: 'invalid' },
    expectedStatus: 404,
  },
  {
    name: 'a customer ID above the 32-bit integer maximum',
    params: { customerId: '2147483648', newAccountType: 0, fromAccountId: 0 },
    expectedStatus: 404,
  },
  {
    name: 'a fractional customer ID',
    params: { customerId: '1.5', newAccountType: 0, fromAccountId: 0 },
    expectedStatus: 404,
  },
];
