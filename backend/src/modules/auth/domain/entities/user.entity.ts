export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredentials {
  id: string;
  passwordHash: string;
}

/**
 * Normalizes an email address for case-insensitive lookup and persistence.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
