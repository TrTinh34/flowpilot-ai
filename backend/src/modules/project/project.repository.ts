import type { Prisma } from '../../generated/prisma/client.js';

const projectFields = {
  id: true,
  workspaceId: true,
  name: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function findVisibleProject(tx: Prisma.TransactionClient, id: string, userId: string) {
  return tx.project.findFirst({
    where: { id, workspace: { members: { some: { userId } } } },
    select: { workspaceId: true },
  });
}

export function listProjects(
  tx: Prisma.TransactionClient,
  workspaceId: string,
  memberId: string | undefined,
  skip: number,
  take: number,
) {
  return tx.project.findMany({
    where: { workspaceId, ...(memberId ? { members: { some: { userId: memberId } } } : {}) },
    orderBy: { id: 'asc' },
    skip,
    take,
    select: projectFields,
  });
}

export function createProject(
  tx: Prisma.TransactionClient,
  workspaceId: string,
  name: string,
  managerId: string,
) {
  return tx.project.create({
    data: { workspaceId, name, members: { create: { userId: managerId, role: 'MANAGER' } } },
    select: projectFields,
  });
}

export async function findProject(tx: Prisma.TransactionClient, id: string) {
  return tx.project.findUnique({ where: { id }, select: projectFields });
}

export function projectMembership(tx: Prisma.TransactionClient, projectId: string, userId: string) {
  return tx.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
    select: { role: true },
  });
}

export function updateProject(
  tx: Prisma.TransactionClient,
  id: string,
  input: { name: string; status: 'ACTIVE' | 'ARCHIVED' },
) {
  return tx.project.update({ where: { id }, data: input, select: projectFields });
}

export function listProjectMembers(tx: Prisma.TransactionClient, projectId: string) {
  return tx.projectMember.findMany({
    where: { projectId },
    orderBy: { userId: 'asc' },
    select: { userId: true, role: true, user: { select: { displayName: true } } },
  });
}

export function addProjectMember(
  tx: Prisma.TransactionClient,
  projectId: string,
  userId: string,
  role: 'MANAGER' | 'MEMBER',
) {
  return tx.projectMember.create({
    data: { projectId, userId, role },
    select: { projectId: true, userId: true, role: true },
  });
}
