import assert from 'node:assert/strict';
import { parseStoredUser } from './storedUser';

const validUser = {
  id: 1,
  login: 'ivanov',
  passwordHash: 'hashed-password',
  name: 'Иванов Иван',
  position: 'Авиатехник 1 класса',
  role: 'user',
} as const;

assert.deepEqual(parseStoredUser(JSON.stringify(validUser)), validUser);
assert.equal(parseStoredUser(null), null);
assert.equal(parseStoredUser('not json'), null);
assert.equal(parseStoredUser(JSON.stringify({ ...validUser, role: 'manager' })), null);
assert.equal(parseStoredUser(JSON.stringify({ ...validUser, login: 42 })), null);

console.log('auth tests passed');
