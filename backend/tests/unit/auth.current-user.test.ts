import { randomUUID } from 'node:crypto';
import { expect, it, vi } from 'vitest';
import { getCurrentUser } from '../../src/modules/auth/auth.service.js';

const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));
vi.mock('../../src/config/prisma.js', () => ({
  prisma: { user: { findUnique } },
}));

const user = {
  id: randomUUID(),
  email: 'user@example.test',
  displayName: 'Fixture User',
  createdAt: new Date(),
  updatedAt: new Date(),
};

it('looks up the subject by ID and requests only public profile fields', async () => {
  findUnique.mockResolvedValueOnce(user);
  await expect(getCurrentUser(user.id)).resolves.toEqual(user);
  expect(findUnique).toHaveBeenLastCalledWith({
    where: { id: user.id },
    select: { id: true, email: true, displayName: true, createdAt: true, updatedAt: true },
  });
});

it('reports a missing profile as an internal not-found result', async () => {
  findUnique.mockResolvedValueOnce(null);
  await expect(getCurrentUser(user.id)).rejects.toMatchObject({
    statusCode: 404,
    code: 'NOT_FOUND',
  });
});

it('uses a safe 500 for a repository failure', async () => {
  findUnique.mockRejectedValueOnce(new Error('private DB diagnostic'));
  await expect(getCurrentUser(user.id)).rejects.toMatchObject({
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected internal error occurred',
  });
});
