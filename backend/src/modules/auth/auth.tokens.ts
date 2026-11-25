import { createHash, randomBytes } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { env } from '../../config/env.js';

export const accessTokenLifetime = 15 * 60;
export const refreshTokenLifetimeMs = 7 * 24 * 60 * 60 * 1000;

const signingKey = Buffer.from(env.JWT_ACCESS_SECRET, 'hex');
const algorithm = 'HS256';
const tokenType = 'at+jwt';
const issuer = 'flowpilot-ai';
const audience = 'flowpilot-ai-api';
const uuid = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;

export function issueAccessToken(userId: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  return new SignJWT({})
    .setProtectedHeader({ alg: algorithm, typ: tokenType })
    .setSubject(userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + accessTokenLifetime)
    .sign(signingKey);
}

export async function verifyAccessToken(token: string): Promise<{ userId: string }> {
  const { payload } = await jwtVerify(token, signingKey, {
    algorithms: [algorithm],
    typ: tokenType,
    issuer,
    audience,
    requiredClaims: ['sub', 'iat', 'exp'],
    maxTokenAge: accessTokenLifetime,
  });
  const { iat, exp, sub } = payload;
  if (
    typeof sub !== 'string' ||
    !uuid.test(sub) ||
    typeof iat !== 'number' ||
    typeof exp !== 'number' ||
    !Number.isSafeInteger(iat) ||
    !Number.isSafeInteger(exp) ||
    exp <= iat ||
    exp - iat > accessTokenLifetime
  ) {
    throw new Error('Invalid access token claims');
  }
  return { userId: sub };
}

export function generateRefreshToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
