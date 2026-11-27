import { randomUUID } from 'node:crypto';
import { expect, it, vi } from 'vitest';
import { env } from '../../src/config/env.js';
import type { AuthUnitOfWork } from '../../src/modules/auth/application/ports/auth-unit-of-work.port.js';
import type { RefreshTokenRepository } from '../../src/modules/auth/application/ports/refresh-token.repository.port.js';
import { LogoutUseCase } from '../../src/modules/auth/application/use-cases/logout.use-case.js';
import { JoseTokenService } from '../../src/modules/auth/infrastructure/security/jose-token.service.js';

it('waits for the unit-of-work transaction to finish before resolving', async () => {
  const familyId = randomUUID();
  const tokenService = new JoseTokenService(env.JWT_ACCESS_SECRET);

  const refreshTokens: RefreshTokenRepository = {
    save: vi.fn(),
    findByTokenHash: vi.fn().mockResolvedValue({
      id: randomUUID(),
      userId: randomUUID(),
      familyId,
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
    }),
    lockFamily: vi.fn(),
    revokeToken: vi.fn(),
    revokeFamily: vi.fn(),
  };

  let releaseCommit!: () => void;
  const commit = new Promise<void>((resolve) => {
    releaseCommit = resolve;
  });
  let finishCallback!: () => void;
  const callbackFinished = new Promise<void>((resolve) => {
    finishCallback = resolve;
  });

  const unitOfWork: AuthUnitOfWork = {
    execute: vi.fn(async (work) => {
      const result = await work({ refreshTokens });
      finishCallback();
      await commit;
      return result;
    }),
  };

  const useCase = new LogoutUseCase(unitOfWork, tokenService);
  const completed = vi.fn();
  const result = useCase.execute(tokenService.generateRefreshToken()).then(completed);

  await Promise.race([result, callbackFinished]);
  try {
    expect(completed).not.toHaveBeenCalled();
    expect(unitOfWork.execute).toHaveBeenCalledOnce();
    expect(refreshTokens.lockFamily).toHaveBeenCalledBefore(vi.mocked(refreshTokens.revokeFamily));
    expect(refreshTokens.revokeFamily).toHaveBeenCalledWith(familyId, expect.any(Date));
  } finally {
    releaseCommit();
    await result;
  }
  expect(completed).toHaveBeenCalledOnce();
});
