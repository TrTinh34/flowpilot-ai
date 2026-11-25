import { randomBytes, randomUUID } from 'node:crypto';
import { decodeJwt, SignJWT } from 'jose';
import { expect, it } from 'vitest';
import { env } from '../../src/config/env.js';
import {
  generateRefreshToken,
  hashRefreshToken,
  issueAccessToken,
  verifyAccessToken,
} from '../../src/modules/auth/auth.tokens.js';

const userId = randomUUID();

it('issues a 15-minute access JWT and verifies the user subject', async () => {
  const token = await issueAccessToken(userId);
  const { iat, exp } = decodeJwt(token);
  expect(exp! - iat!).toBe(900);
  await expect(verifyAccessToken(token)).resolves.toEqual({ userId });
});

it.each(['signature', 'expiration', 'subject', 'type', 'audience', 'algorithm'])(
  'rejects invalid %s',
  async (invalid) => {
    const now = Math.floor(Date.now() / 1000);
    const token = await new SignJWT({})
      .setProtectedHeader({
        alg: invalid === 'algorithm' ? 'HS384' : 'HS256',
        typ: invalid === 'type' ? 'JWT' : 'at+jwt',
      })
      .setIssuer('flowpilot-ai')
      .setAudience(invalid === 'audience' ? 'other-api' : 'flowpilot-ai-api')
      .setSubject(invalid === 'subject' ? 'invalid' : userId)
      .setIssuedAt(invalid === 'expiration' ? now - 60 : now)
      .setExpirationTime(invalid === 'expiration' ? now - 1 : now + 900)
      .sign(
        invalid === 'signature' || invalid === 'algorithm'
          ? randomBytes(48)
          : Buffer.from(env.JWT_ACCESS_SECRET, 'hex'),
      );
    await expect(verifyAccessToken(token)).rejects.toThrow();
  },
);

it('generates 32-byte opaque tokens and hashes them deterministically', () => {
  const token = generateRefreshToken();
  expect(Buffer.from(token, 'base64url')).toHaveLength(32);
  expect(generateRefreshToken()).not.toBe(token);
  expect(hashRefreshToken(token)).toMatch(/^[a-f0-9]{64}$/);
  expect(hashRefreshToken(token)).toBe(hashRefreshToken(token));
  expect(hashRefreshToken(token)).not.toBe(token);
});
