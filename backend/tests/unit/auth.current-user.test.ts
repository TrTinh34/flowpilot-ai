import { randomUUID } from 'node:crypto';
import { beforeEach, expect, it, vi } from 'vitest';
import type { UserRepository } from '../../src/modules/auth/application/ports/user.repository.port.js';
import { GetCurrentUserUseCase } from '../../src/modules/auth/application/use-cases/get-current-user.use-case.js';
import { UserNotFoundError } from '../../src/modules/auth/domain/errors/auth.errors.js';
import { ApplicationError } from '../../src/shared/application/errors/application-error.js';

const user = {
  id: randomUUID(),
  email: 'user@example.test',
  displayName: 'Fixture User',
  createdAt: new Date(),
  updatedAt: new Date(),
};

let userRepository: UserRepository;
let useCase: GetCurrentUserUseCase;

beforeEach(() => {
  userRepository = {
    emailExists: vi.fn(),
    create: vi.fn(),
    findCredentialsByEmail: vi.fn(),
    findPublicById: vi.fn(),
  };
  useCase = new GetCurrentUserUseCase(userRepository);
});

it('looks up the subject by ID and returns only public profile fields', async () => {
  vi.mocked(userRepository.findPublicById).mockResolvedValueOnce(user);
  await expect(useCase.execute(user.id)).resolves.toEqual(user);
  expect(userRepository.findPublicById).toHaveBeenCalledWith(user.id);
});

it('reports a missing profile as UserNotFoundError', async () => {
  vi.mocked(userRepository.findPublicById).mockResolvedValueOnce(null);
  await expect(useCase.execute(user.id)).rejects.toBeInstanceOf(UserNotFoundError);
});

it('uses a safe ApplicationError for a repository failure', async () => {
  vi.mocked(userRepository.findPublicById).mockRejectedValueOnce(
    new Error('private DB diagnostic'),
  );
  const error = await useCase.execute(user.id).catch((e) => e);
  expect(error).toBeInstanceOf(ApplicationError);
  expect(error).toMatchObject({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected internal error occurred',
  });
});
