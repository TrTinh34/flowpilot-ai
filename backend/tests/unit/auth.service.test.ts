import { compare } from 'bcryptjs';
import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { errorMiddleware } from '../../src/middlewares/error.middleware.js';
import { requestIdMiddleware } from '../../src/middlewares/request-id.middleware.js';
import type { UserRepository } from '../../src/modules/auth/application/ports/user.repository.port.js';
import { GetCurrentUserUseCase } from '../../src/modules/auth/application/use-cases/get-current-user.use-case.js';
import { LoginUserUseCase } from '../../src/modules/auth/application/use-cases/login-user.use-case.js';
import { LogoutUseCase } from '../../src/modules/auth/application/use-cases/logout.use-case.js';
import { RefreshSessionUseCase } from '../../src/modules/auth/application/use-cases/refresh-session.use-case.js';
import { RegisterUserUseCase } from '../../src/modules/auth/application/use-cases/register-user.use-case.js';
import { EmailAlreadyExistsError } from '../../src/modules/auth/domain/errors/auth.errors.js';
import { BcryptPasswordHasher } from '../../src/modules/auth/infrastructure/security/bcrypt-password-hasher.js';
import { AuthController } from '../../src/modules/auth/presentation/controllers/auth.controller.js';
import { createAuthRouter } from '../../src/modules/auth/presentation/routes/auth.routes.js';

const input = { email: ' Test@Example.com ', password: ' test-password ', displayName: 'Test' };
const user = {
  id: 'test-id',
  email: 'test@example.com',
  displayName: 'Test',
  createdAt: new Date(),
  updatedAt: new Date(),
};

let userRepository: UserRepository;
let useCase: RegisterUserUseCase;

describe('RegisterUserUseCase', () => {
  beforeEach(() => {
    userRepository = {
      emailExists: vi.fn().mockResolvedValue(false),
      create: vi.fn().mockResolvedValue(user),
      findCredentialsByEmail: vi.fn(),
      findPublicById: vi.fn(),
    };
    useCase = new RegisterUserUseCase(userRepository, new BcryptPasswordHasher());
  });

  it('normalizes email, hashes the original password and returns the selected user', async () => {
    const result = await useCase.execute(input);
    expect(userRepository.emailExists).toHaveBeenCalledWith(user.email);
    const [write] = vi.mocked(userRepository.create).mock.calls[0];
    expect(write).toMatchObject({ email: user.email, displayName: user.displayName });
    expect(write.passwordHash).not.toBe(input.password);
    expect(await compare(input.password, write.passwordHash)).toBe(true);
    expect(result).toEqual(user);
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('rejects an existing email before creating the user', async () => {
    vi.mocked(userRepository.emailExists).mockResolvedValue(true);
    await expect(useCase.execute(input)).rejects.toBeInstanceOf(EmailAlreadyExistsError);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('propagates EmailAlreadyExistsError on unique violation and preserves other repository errors', async () => {
    vi.mocked(userRepository.create).mockRejectedValueOnce(new EmailAlreadyExistsError());
    await expect(useCase.execute(input)).rejects.toMatchObject({ code: 'EMAIL_ALREADY_EXISTS' });

    const unavailable = new Error('Database unavailable');
    vi.mocked(userRepository.emailExists).mockRejectedValueOnce(unavailable);
    await expect(useCase.execute(input)).rejects.toBe(unavailable);
  });

  it('returns a generic HTTP 500 when the repository fails', async () => {
    vi.mocked(userRepository.emailExists).mockRejectedValue(
      new Error('Private database diagnostics'),
    );
    const controller = new AuthController(
      useCase,
      {} as LoginUserUseCase,
      {} as RefreshSessionUseCase,
      {} as LogoutUseCase,
      {} as GetCurrentUserUseCase,
      false,
    );
    const app = express();
    app.use(requestIdMiddleware);
    app.use(express.json());
    app.use('/api/v1/auth', createAuthRouter(controller, (_req, _res, next) => next()));
    app.use(errorMiddleware);

    const res = await request(app).post('/api/v1/auth/register').send(input);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected internal error occurred',
      requestId: res.headers['x-request-id'],
    });
  });
});
