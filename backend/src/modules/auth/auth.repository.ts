import { prisma } from '../../config/prisma.js';
import { Prisma } from '../../generated/prisma/client.js';

type NewUser = { email: string; displayName: string; passwordHash: string };

export async function emailExists(email: string): Promise<boolean> {
  const [result] = await prisma.$queryRaw<[{ exists: boolean }]>`
    SELECT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = LOWER(${email}))
  `;
  return result.exists;
}

export function createUser(data: NewUser) {
  return prisma.user.create({
    data,
    select: { id: true, email: true, displayName: true, createdAt: true, updatedAt: true },
  });
}

export function isDuplicateEmail(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
    return false;
  }

  const driverError = error.meta?.driverAdapterError as
    { cause?: { constraint?: { index?: string } } } | undefined;
  return driverError?.cause?.constraint?.index === 'users_email_lower_uidx';
}
