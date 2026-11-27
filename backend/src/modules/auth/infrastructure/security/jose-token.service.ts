import { createHash, randomBytes } from 'node:crypto';
import { errors, SignJWT, jwtVerify } from 'jose';
import type {
  AccessTokenIssuer,
  AccessTokenVerifier,
  RefreshTokenService,
} from '../../application/ports/token-service.port.js';
import { UnauthorizedError } from '../../domain/errors/auth.errors.js';

const ACCESS_TOKEN_LIFETIME_SECONDS = 15 * 60;
const REFRESH_TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
const ALGORITHM = 'HS256';
const TOKEN_TYPE = 'at+jwt';
const ISSUER = 'flowpilot-ai';
const AUDIENCE = 'flowpilot-ai-api';
const UUID_PATTERN = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;

export class JoseTokenService
  implements AccessTokenIssuer, AccessTokenVerifier, RefreshTokenService
{
  public readonly accessTokenLifetimeSeconds = ACCESS_TOKEN_LIFETIME_SECONDS;
  public readonly refreshTokenLifetimeMs = REFRESH_TOKEN_LIFETIME_MS;
  private readonly signingKey: Buffer;

  constructor(jwtAccessSecret: string) {
    this.signingKey = Buffer.from(jwtAccessSecret, 'hex');
  }

  issueAccessToken(userId: string): Promise<string> {
    const issuedAt = Math.floor(Date.now() / 1000);
    return new SignJWT({})
      .setProtectedHeader({ alg: ALGORITHM, typ: TOKEN_TYPE })
      .setSubject(userId)
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setIssuedAt(issuedAt)
      .setExpirationTime(issuedAt + this.accessTokenLifetimeSeconds)
      .sign(this.signingKey);
  }

  async verifyAccessToken(token: string): Promise<{ userId: string }> {
    try {
      const { payload } = await jwtVerify(token, this.signingKey, {
        algorithms: [ALGORITHM],
        typ: TOKEN_TYPE,
        issuer: ISSUER,
        audience: AUDIENCE,
        requiredClaims: ['sub', 'iat', 'exp'],
        maxTokenAge: this.accessTokenLifetimeSeconds,
      });

      const { iat, exp, sub } = payload;
      if (
        typeof sub !== 'string' ||
        !UUID_PATTERN.test(sub) ||
        typeof iat !== 'number' ||
        typeof exp !== 'number' ||
        !Number.isSafeInteger(iat) ||
        !Number.isSafeInteger(exp) ||
        exp <= iat ||
        exp - iat > this.accessTokenLifetimeSeconds
      ) {
        throw new UnauthorizedError();
      }

      return { userId: sub };
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof errors.JOSEError) {
        throw new UnauthorizedError();
      }
      throw error;
    }
  }

  generateRefreshToken(): string {
    return randomBytes(32).toString('base64url');
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
