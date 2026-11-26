import { prisma } from '../../config/prisma.js';
import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import type { Prisma } from '../../generated/prisma/client.js';
import * as repository from './workspace.repository.js';

function forbidden() {
  return new AppError(403, ERROR_CODES.FORBIDDEN, 'Insufficient workspace permissions.');
}

function workspaceNotFound() {
  return new AppError(404, ERROR_CODES.NOT_FOUND, 'Workspace not found.');
}

function membershipNotFound() {
  return new AppError(404, ERROR_CODES.NOT_FOUND, 'Workspace member not found.');
}

export async function withWorkspaceLock<T>(
  workspaceId: string,
  actorId: string,
  change: (tx: Prisma.TransactionClient, actorRole: 'OWNER' | 'ADMIN' | 'MEMBER') => Promise<T>,
): Promise<T> {
  return prisma.$transaction(
    async (tx) => {
      // Check visibility before taking a lock, then recheck authorization after waiting.
      if (!(await repository.findMembership(tx, workspaceId, actorId))) throw workspaceNotFound();
      await repository.lockWorkspace(tx, workspaceId);
      const actor = await repository.findMembership(tx, workspaceId, actorId);
      if (!actor) throw workspaceNotFound();
      return change(tx, actor.role);
    },
    { isolationLevel: 'ReadCommitted' },
  );
}

async function protectLastOwner(tx: Prisma.TransactionClient, workspaceId: string, role: string) {
  if (role === 'OWNER' && (await repository.countOwners(tx, workspaceId)) <= 1) {
    throw new AppError(
      409,
      ERROR_CODES.LAST_WORKSPACE_OWNER,
      'The last workspace owner cannot be removed or demoted.',
    );
  }
}

export async function getWorkspaces(actorId: string, page: number, size: number) {
  const memberships = await repository.listWorkspaces(actorId, page * size, size);
  return { data: memberships.map(({ role, workspace }) => ({ ...workspace, role })), page, size };
}

export async function getWorkspaceMembers(workspaceId: string, actorId: string) {
  const membership = await repository.listVisibleMembers(workspaceId, actorId);
  if (!membership) throw workspaceNotFound();
  const { members, ...workspace } = membership.workspace;
  return { data: members, workspace: { ...workspace, role: membership.role } };
}

export async function createWorkspace(actorId: string, name: string) {
  return { ...(await repository.createWorkspace(name, actorId)), role: 'OWNER' as const };
}

export function changeMemberRole(
  workspaceId: string,
  actorId: string,
  userId: string,
  role: 'ADMIN' | 'MEMBER',
) {
  return withWorkspaceLock(workspaceId, actorId, async (tx, actorRole) => {
    if (actorRole === 'MEMBER') throw forbidden();
    const target = await repository.findMembership(tx, workspaceId, userId);
    if (!target) throw membershipNotFound();
    if (target.role === 'OWNER' && actorRole !== 'OWNER') throw forbidden();
    await protectLastOwner(tx, workspaceId, target.role);
    return repository.updateRole(tx, workspaceId, userId, role);
  });
}

export function removeMember(workspaceId: string, actorId: string, userId: string) {
  return withWorkspaceLock(workspaceId, actorId, async (tx, actorRole) => {
    if (actorRole === 'MEMBER' && actorId !== userId) throw forbidden();
    const target = await repository.findMembership(tx, workspaceId, userId);
    if (!target) throw membershipNotFound();
    if (target.role === 'OWNER' && actorRole !== 'OWNER') throw forbidden();
    await protectLastOwner(tx, workspaceId, target.role);
    await repository.deleteMembership(tx, workspaceId, userId);
  });
}

export function transferOwnership(workspaceId: string, actorId: string, userId: string) {
  return withWorkspaceLock(workspaceId, actorId, async (tx, actorRole) => {
    if (actorRole !== 'OWNER') throw forbidden();
    const target = await repository.findMembership(tx, workspaceId, userId);
    if (!target) throw membershipNotFound();
    if (actorId === userId) return target;
    const owner = await repository.updateRole(tx, workspaceId, userId, 'OWNER');
    await repository.updateRole(tx, workspaceId, actorId, 'ADMIN');
    return owner;
  });
}
