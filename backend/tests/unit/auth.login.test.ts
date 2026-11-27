import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { env } from '../../src/config/env.js';
import type { RefreshTokenRepository } from '../../src/modules/auth/application/ports/refresh-token.repository.port.js';
import type { UserRepository } from '../../src/modules/auth/application/ports/user.repository.port.js';
import { LoginUserUseCase } from '../../src/modules/auth/application/use-cases/login-user.use-case.js';
import { InvalidCredentialsError } from '../../src/modules/auth/domain/errors/auth.errors.js';
import { BcryptPasswordHasher } from '../../src/modules/auth/infrastructure/security/bcrypt-password-hasher.js';
import { JoseTokenService } from '../../src/modules/auth/infrastructure/security/jose-token.service.js';
import { loginSchema } from '../../src/modules/auth/presentation/schemas/auth.schemas.js';

const input = { email: ' User@Example.test ', password: ' fixture password ' };
let passwordHash: string;
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JoseTokenService(env.JWT_ACCESS_SECRET);

let userRepository: UserRepository;
let refreshTokenRepository: RefreshTokenRepository;
let useCase: LoginUserUseCase;

describe('login validation', () => {
  it('trims surrounding email whitespace and preserves the password verbatim', () => {
    expect(loginSchema.parse(input)).toEqual({
      email: 'User@Example.test',
      password: input.password,
    });
  });

  it.each([
    null,
    { password: input.password },
    { email: input.email },
    { ...input, email: 'invalid' },
    { ...input, password: 123 },
    { ...input, password: '' },
    { ...input, password: 'é'.repeat(37) },
    { ...input, role: 'OWNER' },
  ])('rejects invalid credentials input %#', (body) => {
    expect(loginSchema.safeParse(body).success).toBe(false);
  });
});

describe('LoginUserUseCase', () => {
  beforeAll(async () => {
    passwordHash = await passwordHasher.hash(input.password);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    userRepository = {
      emailExists: vi.fn(),
      create: vi.fn(),
      findCredentialsByEmail: vi.fn().mockResolvedValue({ id: '11111111-1111-4111-8111-111111111111', passwordHash }),
      findPublicById: vi.fn(),
    };
    refreshTokenRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      findByTokenHash: vi.fn(),
      lockFamily: vi.fn(),
      revokeToken: vi.fn(),
      revokeFamily: vi.fn(),
    };
    useCase = new LoginUserUseCase(
      userRepository,
      passwordHasher,
      tokenService,
      tokenService,
      refreshTokenRepository,
    );
  });

  it('looks up normalized email, verifies the original password and issues session tokens', async () => {
    const verifySpy = vi.spyOn(passwordHasher, 'verify');
    const result = await useCase.execute(loginSchema.parse(input));

    expect(userRepository.findCredentialsByEmail).toHaveBeenCalledWith('user@example.test');
    expect(verifySpy).toHaveBeenCalledWith(input.password, passwordHash);
    expect(result.expiresIn).toBe(900);
    expect(result.refreshToken).toMatch(/^[\w-]{43}$/);
    await expect(tokenService.verifyAccessToken(result.accessToken)).resolves.toEqual({
      userId: '11111111-1111-4111-8111-111111111111',
    });
    expect(refreshTokenRepository.save).toHaveBeenCalledOnce();
  });

  it.each(['missing user', 'wrong password'])(
    'uses identical credentials errors for %s',
    async (scenario) => {
      const verifySpy = vi.spyOn(passwordHasher, 'verify');
      if (scenario === 'missing user') {
        vi.mocked(userRepository.findCredentialsByEmail).mockResolvedValue(null);
      }
      await expect(useCase.execute({ ...input, password: 'wrong' })).rejects.toBeInstanceOf(
        InvalidCredentialsError,
      );
      expect(verifySpy).toHaveBeenCalledExactlyOnceWith(
        'wrong',
        expect.stringMatching(/^\$2b\$12\$/),
      );
      expect(refreshTokenRepository.save).not.toHaveBeenCalled();
    },
  );

  it('returns a safe error if the repository fails', async () => {
    const verifySpy = vi.spyOn(passwordHasher, 'verify');
    vi.mocked(userRepository.findCredentialsByEmail).mockRejectedValue(
      new Error('private PostgreSQL diagnostics'),
    );
    await expect(useCase.execute(input)).rejects.toMatchObject({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected internal error occurred',
    });
    expect(verifySpy).not.toHaveBeenCalled();
  });
});
