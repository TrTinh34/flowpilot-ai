import {
  isRefreshTokenExpired,
  isRefreshTokenRevoked,
  isValidRefreshTokenFormat,
} from '../../domain/entities/refresh-token.entity.js';
import { InvalidRefreshTokenError } from '../../domain/errors/auth.errors.js';
import type { AuthSessionDto } from '../dtos/auth.dtos.js';
import type { AuthLogger } from '../ports/auth-logger.port.js';
import type { AuthUnitOfWork } from '../ports/auth-unit-of-work.port.js';
import type { AccessTokenIssuer, RefreshTokenService } from '../ports/token-service.port.js';

export class RefreshSessionUseCase {
  constructor(
    private readonly unitOfWork: AuthUnitOfWork,
    private readonly accessTokenIssuer: AccessTokenIssuer,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly authLogger: AuthLogger,
  ) {}

  async execute(refreshToken: string | undefined): Promise<AuthSessionDto> {
    if (!isValidRefreshTokenFormat(refreshToken)) {
      throw new InvalidRefreshTokenError();
    }

    const tokenHash = this.refreshTokenService.hashRefreshToken(refreshToken);
    const outcome = await this.unitOfWork.execute(async ({ refreshTokens }) => {
      const candidate = await refreshTokens.findByTokenHash(tokenHash);
      if (!candidate) {
        return { status: 'invalid' } as const;
      }

      await refreshTokens.lockFamily(candidate.familyId);
      const current = await refreshTokens.findByTokenHash(tokenHash);
      const now = new Date();
      if (!current || isRefreshTokenExpired(current, now)) {
        return { status: 'invalid' } as const;
      }

      if (isRefreshTokenRevoked(current)) {
        await refreshTokens.revokeFamily(current.familyId, now);
        return { status: 'reuse' } as const;
      }

      const nextToken = this.refreshTokenService.generateRefreshToken();
      const accessToken = await this.accessTokenIssuer.issueAccessToken(current.userId);
      await refreshTokens.revokeToken(current.id, now);
      await refreshTokens.save({
        userId: current.userId,
        familyId: current.familyId,
        tokenHash: this.refreshTokenService.hashRefreshToken(nextToken),
        expiresAt: current.expiresAt,
      });

      return {
        status: 'rotated',
        session: {
          refreshToken: nextToken,
          expiresAt: current.expiresAt,
          accessToken,
          expiresIn: this.accessTokenIssuer.accessTokenLifetimeSeconds,
        },
      } as const;
    });

    if (outcome.status === 'rotated') {
      return outcome.session;
    }

    if (outcome.status === 'reuse') {
      this.authLogger.warnRefreshTokenReuse();
    }

    throw new InvalidRefreshTokenError();
  }
}
