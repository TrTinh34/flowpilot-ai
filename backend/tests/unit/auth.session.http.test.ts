import { randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';
import { beforeEach, expect, it, vi } from 'vitest';
import { env } from '../../src/config/env.js';
import { errorMiddleware } from '../../src/middlewares/error.middleware.js';
import { requestIdMiddleware } from '../../src/middlewares/request-id.middleware.js';
import type { AuthLogger } from '../../src/modules/auth/application/ports/auth-logger.port.js';
import type { AuthUnitOfWork } from '../../src/modules/auth/application/ports/auth-unit-of-work.port.js';
import type { PasswordHasher } from '../../src/modules/auth/application/ports/password-hasher.port.js';
import type { RefreshTokenRepository } from '../../src/modules/auth/application/ports/refresh-token.repository.port.js';
import type { UserRepository } from '../../src/modules/auth/application/ports/user.repository.port.js';
import { GetCurrentUserUseCase } from '../../src/modules/auth/application/use-cases/get-current-user.use-case.js';
import { LoginUserUseCase } from '../../src/modules/auth/application/use-cases/login-user.use-case.js';
import { LogoutUseCase } from '../../src/modules/auth/application/use-cases/logout.use-case.js';
import { RefreshSessionUseCase } from '../../src/modules/auth/application/use-cases/refresh-session.use-case.js';
import { RegisterUserUseCase } from '../../src/modules/auth/application/use-cases/register-user.use-case.js';
import { JoseTokenService } from '../../src/modules/auth/infrastructure/security/jose-token.service.js';
import { AuthController } from '../../src/modules/auth/presentation/controllers/auth.controller.js';
import { createAuthenticateMiddleware } from '../../src/modules/auth/presentation/middlewares/authenticate.middleware.js';
import { createAuthRouter } from '../../src/modules/auth/presentation/routes/auth.routes.js';

const tokenService = new JoseTokenService(env.JWT_ACCESS_SECRET);
const loginPath = '/api/v1/auth/login';
const refreshPath = '/api/v1/auth/refresh';
const logoutPath = '/api/v1/auth/logout';
const input = { email: 'fixture@example.test', password: 'fixture-password' };
const userId = randomUUID();
const refreshToken = tokenService.generateRefreshToken();
const record = {
  id: randomUUID(),
  userId,
  familyId: randomUUID(),
  expiresAt: new Date(Date.now() + 60_000),
  revokedAt: null,
};

let userRepository: UserRepository;
let passwordHasher: PasswordHasher;
let refreshTokenRepository: RefreshTokenRepository;
let unitOfWork: AuthUnitOfWork;
let authLogger: AuthLogger;
let app: express.Express;

const refresh = (token = refreshToken) =>
  request(app).post(refreshPath).set('Cookie', `refresh_token=${token}`);

const logout = () => request(app).post(logoutPath).set('Cookie', `refresh_token=${refreshToken}`);

beforeEach(() => {
  vi.resetAllMocks();

  userRepository = {
    emailExists: vi.fn(),
    create: vi.fn(),
    findCredentialsByEmail: vi.fn().mockResolvedValue({ id: userId, passwordHash: 'hashed' }),
    findPublicById: vi.fn(),
  };

  passwordHasher = {
    hash: vi.fn(),
    verify: vi.fn().mockResolvedValue(true),
  };

  refreshTokenRepository = {
    save: vi.fn().mockResolvedValue(undefined),
    findByTokenHash: vi.fn().mockResolvedValue(record),
    lockFamily: vi.fn().mockResolvedValue(undefined),
    revokeToken: vi.fn().mockResolvedValue(undefined),
    revokeFamily: vi.fn().mockResolvedValue(undefined),
  };

  unitOfWork = {
    execute: vi.fn((work) => work({ refreshTokens: refreshTokenRepository })),
  };

  authLogger = {
    warnRefreshTokenReuse: vi.fn(),
  };

  const controller = new AuthController(
    new RegisterUserUseCase(userRepository, passwordHasher),
    new LoginUserUseCase(
      userRepository,
      passwordHasher,
      tokenService,
      tokenService,
      refreshTokenRepository,
    ),
    new RefreshSessionUseCase(unitOfWork, tokenService, tokenService, authLogger),
    new LogoutUseCase(unitOfWork, tokenService),
    new GetCurrentUserUseCase(userRepository),
    false,
  );

  app = express();
  app.use(requestIdMiddleware);
  app.use(express.json());
  app.use('/api/v1/auth', createAuthRouter(controller, createAuthenticateMiddleware(tokenService)));
  app.use(errorMiddleware);
});

it('delivers login tokens through JSON and cookie and saves only the refresh hash', async () => {
  const res = await request(app).post(loginPath).send(input);
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ accessToken: expect.any(String), expiresIn: 900 });
  await expect(tokenService.verifyAccessToken(res.body.accessToken)).resolves.toEqual({ userId });
  const cookie = res.headers['set-cookie'][0];
  expect(cookie).toMatch(/^refresh_token=[\w-]{43};/);
  expect(cookie).toContain('HttpOnly');
  expect(cookie).toContain('SameSite=Lax');
  expect(cookie).toContain('Path=/api/v1/auth');
  expect(res.headers['cache-control']).toBe('no-store');
  expect(refreshTokenRepository.save).toHaveBeenCalledExactlyOnceWith({
    familyId: expect.any(String),
    userId,
    tokenHash: tokenService.hashRefreshToken(cookie.split(';')[0].slice('refresh_token='.length)),
    expiresAt: expect.any(Date),
  });
});

it('rejects invalid login without writing a refresh record', async () => {
  vi.mocked(passwordHasher.verify).mockResolvedValue(false);
  const res = await request(app).post(loginPath).send(input);
  expect(res.status).toBe(401);
  expect(res.body.code).toBe('INVALID_CREDENTIALS');
  expect(refreshTokenRepository.save).not.toHaveBeenCalled();
  expect(res.headers['set-cookie']).toBeUndefined();
});

it('returns a generic failure and withholds the cookie when persistence fails', async () => {
  vi.mocked(refreshTokenRepository.save).mockRejectedValue(
    new Error('private database diagnostics'),
  );
  const res = await request(app).post(loginPath).send(input);
  expect(res.status).toBe(500);
  expect(res.body).toEqual({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected internal error occurred',
    requestId: expect.any(String),
  });
  expect(res.headers['set-cookie']).toBeUndefined();
});

it('rotates within the family and preserves absolute expiry', async () => {
  const res = await refresh();
  expect(res.status).toBe(200);
  expect(refreshTokenRepository.revokeToken).toHaveBeenCalledWith(record.id, expect.any(Date));
  expect(refreshTokenRepository.save).toHaveBeenCalledWith({
    userId,
    familyId: record.familyId,
    expiresAt: record.expiresAt,
    tokenHash: expect.any(String),
  });
});

it('returns 401 after committing the reuse outcome', async () => {
  vi.mocked(refreshTokenRepository.findByTokenHash).mockResolvedValue({
    ...record,
    revokedAt: new Date(),
  });
  const res = await refresh();
  expect(res.status).toBe(401);
  expect(refreshTokenRepository.revokeFamily).toHaveBeenCalledWith(
    record.familyId,
    expect.any(Date),
  );
  expect(authLogger.warnRefreshTokenReuse).toHaveBeenCalledOnce();
  expect(refreshTokenRepository.save).not.toHaveBeenCalled();
});

it.each(['expired', 'unknown', 'malformed', 'missing'])(
  'rejects a %s refresh token',
  async (scenario) => {
    if (scenario === 'expired') {
      vi.mocked(refreshTokenRepository.findByTokenHash).mockResolvedValue({
        ...record,
        expiresAt: new Date(0),
      });
    }
    if (scenario === 'unknown') {
      vi.mocked(refreshTokenRepository.findByTokenHash).mockResolvedValue(null);
    }
    const res = await (scenario === 'missing'
      ? request(app).post(refreshPath)
      : refresh(scenario === 'malformed' ? 'invalid' : refreshToken));
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_REFRESH_TOKEN');
    expect(refreshTokenRepository.save).not.toHaveBeenCalled();
  },
);

it('rejects an untrusted browser request before the transaction', async () => {
  const res = await refresh().set('Sec-Fetch-Site', 'cross-site');
  expect(res.status).toBe(403);
  expect(unitOfWork.execute).not.toHaveBeenCalled();
});

it('returns a generic 500 for failed refresh transaction', async () => {
  vi.mocked(unitOfWork.execute).mockRejectedValue(new Error('private transaction details'));
  const res = await refresh();
  expect(res.status).toBe(500);
  expect(res.body.message).toBe('An unexpected internal error occurred');
  expect(res.headers['set-cookie']).toBeUndefined();
});

it('revokes the family identified by the cookie and expires the matching cookie', async () => {
  const res = await logout().send({ familyId: randomUUID() });
  expect(res.status).toBe(204);
  expect(res.text).toBe('');
  expect(res.headers['cache-control']).toBe('no-store');
  expect(res.headers['set-cookie'][0]).toMatch(
    /^refresh_token=; Path=\/api\/v1\/auth; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax$/,
  );
  expect(refreshTokenRepository.findByTokenHash).toHaveBeenCalledWith(
    tokenService.hashRefreshToken(refreshToken),
  );
  expect(refreshTokenRepository.lockFamily).toHaveBeenCalledBefore(
    vi.mocked(refreshTokenRepository.revokeFamily),
  );
  expect(refreshTokenRepository.revokeFamily).toHaveBeenCalledExactlyOnceWith(
    record.familyId,
    expect.any(Date),
  );
  expect(refreshTokenRepository.save).not.toHaveBeenCalled();
});

it('accepts repeated logout with a known revoked token that has not expired', async () => {
  vi.mocked(refreshTokenRepository.findByTokenHash).mockResolvedValue({
    ...record,
    revokedAt: new Date(),
  });
  expect((await logout()).status).toBe(204);
  expect((await logout()).status).toBe(204);
  expect(refreshTokenRepository.revokeFamily).toHaveBeenCalledTimes(2);
});

it.each(['missing', 'malformed', 'unknown', 'expired'])(
  'returns 401 for a %s logout cookie',
  async (scenario) => {
    if (scenario === 'unknown') vi.mocked(refreshTokenRepository.findByTokenHash).mockResolvedValue(null);
    if (scenario === 'expired') {
      vi.mocked(refreshTokenRepository.findByTokenHash).mockResolvedValue({
        ...record,
        expiresAt: new Date(0),
      });
    }
    const response = await (scenario === 'missing'
      ? request(app).post(logoutPath)
      : scenario === 'malformed'
        ? request(app).post(logoutPath).set('Cookie', 'refresh_token=invalid')
        : logout());
    expect(response.status).toBe(401);
    expect(response.body.code).toBe('INVALID_REFRESH_TOKEN');
    expect(refreshTokenRepository.revokeFamily).not.toHaveBeenCalled();
  },
);

it('rejects untrusted browser logout before accessing PostgreSQL', async () => {
  const response = await logout().set('Sec-Fetch-Site', 'cross-site');
  expect(response.status).toBe(403);
  expect(unitOfWork.execute).not.toHaveBeenCalled();
});

it.each(['repository', 'commit'])(
  'preserves the cookie and returns a generic 500 on %s failure',
  async (failure) => {
    const privateError = new Error('private database diagnostics');
    if (failure === 'repository') {
      vi.mocked(refreshTokenRepository.revokeFamily).mockRejectedValue(privateError);
    } else {
      vi.mocked(unitOfWork.execute).mockImplementation(async (work) => {
        await work({ refreshTokens: refreshTokenRepository });
        throw privateError;
      });
    }
    const response = await logout();
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected internal error occurred',
      requestId: expect.any(String),
    });
    expect(response.headers['set-cookie']).toBeUndefined();
  },
);
