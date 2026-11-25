import { prisma } from '../../config/prisma.js';
import type { Prisma } from '../../generated/prisma/client.js';

type NewRefreshToken = { userId: string; familyId: string; tokenHash: string; expiresAt: Date };

export async function saveRefreshToken(
  data: NewRefreshToken,
  client: Prisma.TransactionClient = prisma,
) {
  await client.refreshToken.create({ data, select: { id: true } });
}

export function findRefreshToken(client: Prisma.TransactionClient, tokenHash: string) {
  return client.refreshToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, familyId: true, expiresAt: true, revokedAt: true },
  });
}

export async function lockRefreshFamily(client: Prisma.TransactionClient, familyId: string) {
  // Serialize all rotations and reuse checks within a family, including different generations.
  await client.$queryRaw`
    SELECT 1 FROM pg_advisory_xact_lock(hashtextextended(${familyId}, 0))
  `;
}

export async function revokeRefreshToken(
  client: Prisma.TransactionClient,
  id: string,
  revokedAt: Date,
) {
  await client.refreshToken.update({ where: { id }, data: { revokedAt }, select: { id: true } });
}

export async function revokeRefreshFamily(
  client: Prisma.TransactionClient,
  familyId: string,
  revokedAt: Date,
) {
  await client.refreshToken.updateMany({
    where: { familyId, revokedAt: null },
    data: { revokedAt },
  });
}
