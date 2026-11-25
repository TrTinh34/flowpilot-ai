import { randomUUID } from 'node:crypto';
import { logger } from '../../config/logger.js';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import type { LoginInput } from './auth.schema.js';
import { verifyLoginCredentials } from './auth.service.js';
import {
  accessTokenLifetime,
  generateRefreshToken,
  hashRefreshToken,
  issueAccessToken,
  refreshTokenLifetimeMs,
} from './auth.tokens.js';
import {
  findRefreshToken,
  lockRefreshFamily,
  revokeRefreshFamily,
  revokeRefreshToken,
  saveRefreshToken,
} from './refresh-token.repository.js';

function invalidRefreshToken() {
  return new AppError(401, ERROR_CODES.INVALID_REFRESH_TOKEN, 'Invalid or expired refresh token.');
}

export async function login(input: LoginInput) {
  const { userId } = await verifyLoginCredentials(input);
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + refreshTokenLifetimeMs);
  const accessToken = await issueAccessToken(userId);
  await saveRefreshToken({
    userId,
    familyId: randomUUID(),
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt,
  });
  return { refreshToken, expiresAt, accessToken, expiresIn: accessTokenLifetime };
}

export async function refreshSession(refreshToken: string | undefined) {
  if (!refreshToken || !/^[\w-]{43}$/.test(refreshToken)) {
    throw invalidRefreshToken();
  }
  const tokenHash = hashRefreshToken(refreshToken);
  const outcome = await prisma.$transaction(
    async (tx) => {
      const candidate = await findRefreshToken(tx, tokenHash);
      if (!candidate) return { status: 'invalid' } as const;

      await lockRefreshFamily(tx, candidate.familyId);
      const current = await findRefreshToken(tx, tokenHash);
      const now = new Date();
      if (!current || current.expiresAt <= now) return { status: 'invalid' } as const;

      if (current.revokedAt) {
        await revokeRefreshFamily(tx, current.familyId, now);
        return { status: 'reuse' } as const;
      }

      const nextToken = generateRefreshToken();
      const accessToken = await issueAccessToken(current.userId);
      await revokeRefreshToken(tx, current.id, now);
      await saveRefreshToken(
        {
          userId: current.userId,
          familyId: current.familyId,
          tokenHash: hashRefreshToken(nextToken),
          expiresAt: current.expiresAt,
        },
        tx,
      );
      return {
        status: 'rotated',
        session: {
          refreshToken: nextToken,
          expiresAt: current.expiresAt,
          accessToken,
          expiresIn: accessTokenLifetime,
        },
      } as const;
    },
    { isolationLevel: 'ReadCommitted' },
  );

  if (outcome.status === 'rotated') return outcome.session;
  if (outcome.status === 'reuse')
    logger.warn({ event: 'refresh_token_reuse' }, 'Refresh token family revoked');
  throw invalidRefreshToken();
}
