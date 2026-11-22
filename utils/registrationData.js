import { randomBytes } from 'node:crypto';
import { faker } from '@faker-js/faker';

export function createRegistrationData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const usernamePrefix = faker.internet.username({ firstName, lastName }).replace(/[^a-z0-9]/gi, '').slice(0, 5);
  const password = `T!${randomBytes(7).toString('hex')}9a`;
  // ParaBank reports overlength database fields as duplicate usernames.
  return {
    'customer.firstName': `${firstName} fresh newUser`.slice(0, 30),
    'customer.lastName': lastName.slice(0, 30),
    'customer.address.street': faker.location.streetAddress().slice(0, 45),
    'customer.address.city': faker.location.city().slice(0, 20),
    'customer.address.state': faker.location.state({ abbreviated: true }),
    'customer.address.zipCode': faker.location.zipCode('#####'),
    'customer.phoneNumber': `202-555-01${faker.string.numeric(2)}`,
    'customer.ssn': `000-00-${faker.string.numeric(4)}`,
    'customer.username': `${usernamePrefix}fresh${randomBytes(5).toString('hex')}`,
    'customer.password': password,
    repeatedPassword: password,
  };
}

export const requiredRegistrationErrors = {
  'customer.firstName': 'First name is required.',
  'customer.lastName': 'Last name is required.',
  'customer.address.street': 'Address is required.',
  'customer.address.city': 'City is required.',
  'customer.address.state': 'State is required.',
  'customer.address.zipCode': 'Zip Code is required.',
  'customer.ssn': 'Social Security Number is required.',
  'customer.username': 'Username is required.',
  'customer.password': 'Password is required.',
  repeatedPassword: 'Password confirmation is required.',
};

export const passwordMismatchSuffix = 'x';
export const passwordMismatchError = 'Passwords did not match.';
export const duplicateUsernameError = 'This username already exists.';
export const whitespaceOnly = '   ';
export const specialUsernameSuffix = '_-!';
export const specialPasswordPrefix = '!#';

export const registrationBoundaries = [
  { field: 'customer.firstName', name: 'first name', limit: 30 },
  { field: 'customer.lastName', name: 'last name', limit: 30 },
  { field: 'customer.username', name: 'username', limit: 20 },
  { field: 'customer.password', name: 'password', limit: 20 },
  { field: 'customer.address.city', name: 'city', limit: 20 },
  { field: 'customer.address.street', name: 'address', limit: 45 },
];

export const registrationLongInputs = [
  { field: 'customer.firstName', name: 'first name', length: 51 },
  { field: 'customer.lastName', name: 'last name', length: 51 },
  { field: 'customer.username', name: 'username', length: 51 },
  { field: 'customer.password', name: 'password', length: 51 },
];

export const credentialSpaceCases = [
  { field: 'customer.username', name: 'username', position: 'leading' },
  { field: 'customer.username', name: 'username', position: 'trailing' },
  { field: 'customer.password', name: 'password', position: 'leading' },
  { field: 'customer.password', name: 'password', position: 'trailing' },
];

export function withFieldLength(data, field, length) {
  const value = data[field].padEnd(length, 'a').slice(0, length);
  data[field] = value;
  if (field === 'customer.password') data.repeatedPassword = value;
  return data;
}

export function withCredentialSpace(data, field, position) {
  const credential = data[field].slice(0, 19);
  const value = position === 'leading' ? ` ${credential}` : `${credential} `;
  data[field] = value;
  if (field === 'customer.password') data.repeatedPassword = value;
  return data;
}
