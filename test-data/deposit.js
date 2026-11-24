export const depositEndpoint = '/parabank/services/bank/deposit';
export const transactionsEndpoint = (accountId) =>
  `/parabank/services/bank/accounts/${accountId}/transactions`;

export const depositAmounts = [
  { name: 'a positive amount', amount: '1.00' },
  { name: 'the smallest cent amount', amount: '0.01' },
];

export const invalidDepositRequests = [
  {
    name: 'a non-numeric account ID',
    params: { accountId: 'invalid', amount: '1.00' },
    expectedStatus: 404,
  },
  {
    name: 'a non-numeric amount',
    params: { accountId: 0, amount: 'invalid' },
    expectedStatus: 404,
  },
  {
    name: 'an account ID above the 32-bit integer maximum',
    params: { accountId: '2147483648', amount: '1.00' },
    expectedStatus: 404,
  },
  {
    name: 'a fractional account ID',
    params: { accountId: '1.5', amount: '1.00' },
    expectedStatus: 404,
  },
  {
    name: 'an amount that is not a number',
    params: { accountId: 0, amount: 'NaN' },
    expectedStatus: 404,
  },
];

export const invalidDepositAmounts = [
  { name: 'a zero amount', amount: '0.00' },
  { name: 'a negative amount', amount: '-10.00' },
  { name: 'a negative cent amount', amount: '-0.01' },
  { name: 'more than two decimal places', amount: '1.001' },
  { name: 'an empty amount', amount: '' },
];