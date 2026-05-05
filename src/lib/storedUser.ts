import type { User } from './db';

export const USER_STORAGE_KEY = 'user';

function isStoredUser(value: unknown): value is User {
  if (!value || typeof value !== 'object') return false;

  const user = value as Partial<User>;
  return (
    (user.id === undefined || typeof user.id === 'number') &&
    typeof user.login === 'string' &&
    typeof user.passwordHash === 'string' &&
    typeof user.name === 'string' &&
    typeof user.position === 'string' &&
    (user.role === 'admin' || user.role === 'user')
  );
}

export function parseStoredUser(storedUser: string | null): User | null {
  if (!storedUser) return null;

  try {
    const parsedUser: unknown = JSON.parse(storedUser);
    return isStoredUser(parsedUser) ? parsedUser : null;
  } catch {
    return null;
  }
}
