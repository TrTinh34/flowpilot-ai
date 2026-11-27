import { randomUUID } from 'node:crypto';
import { ApplicationError } from '../../../../shared/application/errors/application-error.js';
import { ERROR_CODES } from '../../../../shared/domain/errors/error-codes.js';
import { normalizeEmail } from '../../domain/entities/user.entity.js';
import { InvalidCredentialsError } from '../../domain/errors/auth.errors.js';
import type { AuthSessionDto, LoginUserInput } from '../dtos/auth.dtos.js';
import type { PasswordHasher } from '../ports/password-hasher.port.js';
import type { RefreshTokenRepository } from '../ports/refresh-token.repository.port.js';
import type { AccessTokenIssuer, RefreshTokenService } from '../ports/token-service.port.js';
import type { UserRepository } from '../ports/user.repository.port.js';

// A cost-12 bcrypt fixture keeps the comparison step for unknown accounts.
const DUMMY_PASSWORD_HASH = '$2b$12$ZpRRYp15G9YIZ7vnuyqEM.eEVo9OzWa0nwdw9fFXXtSP8KCDgz8Iu';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly accessTokenIssuer: AccessTokenIssuer,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(input: LoginUserInput): Promise<AuthSessionDto> {
    let user;
    let passwordMatches: boolean;
    try {
      user = await this.userRepository.findCredentialsByEmail(normalizeEmail(input.email));
      passwordMatches = await this.passwordHasher.verify(
        input.password,
        user?.passwordHash ?? DUMMY_PASSWORD_HASH,
      );
    } catch (error) {
      throw new ApplicationError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected internal error occurred',
        {
          cause: error,
        },
      );
    }

    if (!user || !passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const refreshToken = this.refreshTokenService.generateRefreshToken();
    const expiresAt = new Date(Date.now() + this.refreshTokenService.refreshTokenLifetimeMs);
    const accessToken = await this.accessTokenIssuer.issueAccessToken(user.id);

    await this.refreshTokenRepository.save({
      userId: user.id,
      familyId: randomUUID(),
      tokenHash: this.refreshTokenService.hashRefreshToken(refreshToken),
      expiresAt,
    });

    return {
      refreshToken,
      expiresAt,
      accessToken,
      expiresIn: this.accessTokenIssuer.accessTokenLifetimeSeconds,
    };
  }
}
