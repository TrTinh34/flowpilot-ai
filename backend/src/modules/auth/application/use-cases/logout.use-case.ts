import {
  isRefreshTokenExpired,
  isValidRefreshTokenFormat,
} from '../../domain/entities/refresh-token.entity.js';
import { InvalidRefreshTokenError } from '../../domain/errors/auth.errors.js';
import type { AuthUnitOfWork } from '../ports/auth-unit-of-work.port.js';
import type { RefreshTokenService } from '../ports/token-service.port.js';

export class LogoutUseCase {
  constructor(
    private readonly unitOfWork: AuthUnitOfWork,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(refreshToken: string | undefined): Promise<void> {
    if (!isValidRefreshTokenFormat(refreshToken)) {
      throw new InvalidRefreshTokenError();
    }

    const tokenHash = this.refreshTokenService.hashRefreshToken(refreshToken);
    const revoked = await this.unitOfWork.execute(async ({ refreshTokens }) => {
      const candidate = await refreshTokens.findByTokenHash(tokenHash);
      if (!candidate) {
        return false;
      }

      await refreshTokens.lockFamily(candidate.familyId);
      const now = new Date();
      if (isRefreshTokenExpired(candidate, now)) {
        return false;
      }

      // A rotated token can still identify the family for revocation.
      await refreshTokens.revokeFamily(candidate.familyId, now);
      return true;
    });

    if (!revoked) {
      throw new InvalidRefreshTokenError();
    }
  }
}
