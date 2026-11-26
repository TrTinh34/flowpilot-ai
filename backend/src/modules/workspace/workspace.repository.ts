import { prisma } from '../../config/prisma.js';
import type { Prisma } from '../../generated/prisma/client.js';

const publicWorkspace = { id: true, name: true, createdAt: true, updatedAt: true } as const;
const publicMembership = { workspaceId: true, userId: true, role: true } as const;

export function listWorkspaces(userId: string, skip: number, take: number) {
  return prisma.workspaceMember.findMany({
    where: { userId },
    orderBy: { workspaceId: 'asc' },
    skip,
    take,
    select: { role: true, workspace: { select: publicWorkspace } },
  });
}

export function createWorkspace(name: string, ownerId: string) {
  return prisma.workspace.create({
    data: { name, members: { create: { userId: ownerId, role: 'OWNER' } } },
    select: publicWorkspace,
  });
}

export async function lockWorkspace(tx: Prisma.TransactionClient, workspaceId: string) {
  await tx.$queryRaw`SELECT id FROM workspaces WHERE id = ${workspaceId}::uuid FOR UPDATE`;
}

export function findMembership(tx: Prisma.TransactionClient, workspaceId: string, userId: string) {
  return tx.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
    select: publicMembership,
  });
}

export function countOwners(tx: Prisma.TransactionClient, workspaceId: string) {
  return tx.workspaceMember.count({ where: { workspaceId, role: 'OWNER' } });
}

export function updateRole(
  tx: Prisma.TransactionClient,
  workspaceId: string,
  userId: string,
  role: 'OWNER' | 'ADMIN' | 'MEMBER',
) {
  return tx.workspaceMember.update({
    where: { workspaceId_userId: { workspaceId, userId } },
    data: { role },
    select: publicMembership,
  });
}

export async function deleteMembership(
  tx: Prisma.TransactionClient,
  workspaceId: string,
  userId: string,
) {
  await tx.workspaceMember.delete({ where: { workspaceId_userId: { workspaceId, userId } } });
}
