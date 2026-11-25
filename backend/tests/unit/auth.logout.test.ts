import { randomUUID } from 'node:crypto';
import { expect, it, vi } from 'vitest';
import { logoutSession } from '../../src/modules/auth/auth.session.js';
import { generateRefreshToken } from '../../src/modules/auth/auth.tokens.js';
import {
  findRefreshToken,
  lockRefreshFamily,
  revokeRefreshFamily,
} from '../../src/modules/auth/refresh-token.repository.js';

const { transaction, tx } = vi.hoisted(() => ({ transaction: vi.fn(), tx: {} }));
vi.mock('../../src/config/prisma.js', () => ({ prisma: { $transaction: transaction } }));
vi.mock('../../src/modules/auth/refresh-token.repository.js', () => ({
  findRefreshToken: vi.fn(),
  lockRefreshFamily: vi.fn(),
  revokeRefreshFamily: vi.fn(),
}));

it('uses ReadCommitted and waits for the transaction to finish before resolving', async () => {
  const familyId = randomUUID();
  vi.mocked(findRefreshToken).mockResolvedValue({
    id: randomUUID(),
    userId: randomUUID(),
    familyId,
    expiresAt: new Date(Date.now() + 60_000),
    revokedAt: null,
  });
  let releaseCommit!: () => void;
  const commit = new Promise<void>((resolve) => {
    releaseCommit = resolve;
  });
  let finishCallback!: () => void;
  const callbackFinished = new Promise<void>((resolve) => {
    finishCallback = resolve;
  });
  transaction.mockImplementationOnce(async (callback: (client: typeof tx) => Promise<unknown>) => {
    const result = await callback(tx);
    finishCallback();
    await commit;
    return result;
  });

  const completed = vi.fn();
  const result = logoutSession(generateRefreshToken()).then(completed);
  await Promise.race([result, callbackFinished]);
  try {
    expect(completed).not.toHaveBeenCalled();
    expect(transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: 'ReadCommitted',
    });
    expect(lockRefreshFamily).toHaveBeenCalledBefore(vi.mocked(revokeRefreshFamily));
    expect(revokeRefreshFamily).toHaveBeenCalledWith(tx, familyId, expect.any(Date));
  } finally {
    releaseCommit();
    await result;
  }
  expect(completed).toHaveBeenCalledOnce();
});
