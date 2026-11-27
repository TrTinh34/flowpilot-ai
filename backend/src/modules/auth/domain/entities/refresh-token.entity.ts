export interface RefreshTokenRecord {
  id: string;
  userId: string;
  familyId: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

const REFRESH_TOKEN_PATTERN = /^[\w-]{43}$/;

export function isValidRefreshTokenFormat(token: string | undefined): token is string {
  return typeof token === 'string' && REFRESH_TOKEN_PATTERN.test(token);
}

export function isRefreshTokenExpired(
  record: Pick<RefreshTokenRecord, 'expiresAt'>,
  now: Date,
): boolean {
  return record.expiresAt <= now;
}

export function isRefreshTokenRevoked(record: Pick<RefreshTokenRecord, 'revokedAt'>): boolean {
  return record.revokedAt !== null;
}
