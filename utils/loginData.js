import { randomBytes } from 'node:crypto';

export function getLoginCredentials() {
  const username = process.env.REGISTER_USERNAME;
  const password = process.env.REGISTER_PASSWORD;

  if (!username?.trim() || !password?.trim()) {
    throw new Error('Set REGISTER_USERNAME and REGISTER_PASSWORD to a valid test account before running login tests.');
  }

  return { username, password };
}

export function createInvalidCredentials() {
  return {
    username: `invalid${randomBytes(6).toString('hex')}`,
    password: `invalid${randomBytes(6).toString('hex')}`,
  };
}

export const loginErrors = {
  invalid: 'The username and password could not be verified.',
  required: 'Please enter a username and password.',
};

export const missingLoginCases = [
  { name: 'both fields empty', username: '', password: '' },
  { name: 'username empty', username: '', password: 'invalid-password' },
  { name: 'password empty', username: 'invalid-user', password: '' },
];

export const whitespaceCredentials = { username: '   ', password: '   ' };
