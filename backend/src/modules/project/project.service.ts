import { prisma } from '../../config/prisma.js';
import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { findMembership } from '../workspace/workspace.repository.js';
import { withWorkspaceLock } from '../workspace/workspace.service.js';
import * as repository from './project.repository.js';

function forbidden() {
  return new AppError(403, ERROR_CODES.FORBIDDEN, 'Insufficient project permissions.');
}

function notFound() {
  return new AppError(404, ERROR_CODES.NOT_FOUND, 'Project not found.');
}

async function requireWorkspaceMember(
  tx: Prisma.TransactionClient,
  workspaceId: string,
  userId: string,
) {
  if (!(await findMembership(tx, workspaceId, userId))) {
    throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Workspace member not found.');
  }
}

export function getProjects(workspaceId: string, actorId: string, page: number, size: number) {
  return withWorkspaceLock(workspaceId, actorId, async (tx, role) => ({
    data: await repository.listProjects(
      tx,
      workspaceId,
      role === 'MEMBER' ? actorId : undefined,
      page * size,
      size,
    ),
    page,
    size,
  }));
}

export function createProject(
  workspaceId: string,
  actorId: string,
  input: { name: string; managerId: string },
) {
  return withWorkspaceLock(workspaceId, actorId, async (tx, role) => {
    if (role === 'MEMBER') throw forbidden();
    await requireWorkspaceMember(tx, workspaceId, input.managerId);
    return repository.createProject(tx, workspaceId, input.name, input.managerId);
  });
}

type ProjectContext = {
  tx: Prisma.TransactionClient;
  project: NonNullable<Awaited<ReturnType<typeof repository.findProject>>>;
  workspaceManager: boolean;
};

async function withProject<T>(
  projectId: string,
  actorId: string,
  write: boolean,
  action: (context: ProjectContext) => Promise<T>,
) {
  const candidate = await repository.findVisibleProject(prisma, projectId, actorId);
  if (!candidate) throw notFound();

  return withWorkspaceLock(candidate.workspaceId, actorId, async (tx, role) => {
    const project = await repository.findProject(tx, projectId);
    if (!project) throw notFound();
    const workspaceManager = role !== 'MEMBER';
    if (!workspaceManager) {
      const membership = await repository.projectMembership(tx, projectId, actorId);
      if (!membership || (write && membership.role !== 'MANAGER')) throw forbidden();
    }
    if (write && project.status === 'ARCHIVED') {
      throw new AppError(409, ERROR_CODES.PROJECT_ARCHIVED, 'Archived projects are read-only.');
    }
    return action({ tx, project, workspaceManager });
  });
}

export function updateProject(
  projectId: string,
  actorId: string,
  input: { name: string; status: 'ACTIVE' | 'ARCHIVED' },
) {
  return withProject(projectId, actorId, true, ({ tx }) =>
    repository.updateProject(tx, projectId, input),
  );
}

export function getProjectMembers(projectId: string, actorId: string) {
  return withProject(projectId, actorId, false, async ({ tx, project, workspaceManager }) => ({
    project,
    data: await repository.listProjectMembers(tx, projectId),
    canManage:
      workspaceManager ||
      (await repository.projectMembership(tx, projectId, actorId))?.role === 'MANAGER',
    canAssignManager: workspaceManager,
  }));
}

export function addProjectMember(
  projectId: string,
  actorId: string,
  input: { userId: string; role: 'MANAGER' | 'MEMBER' },
) {
  return withProject(projectId, actorId, true, async ({ tx, project, workspaceManager }) => {
    if (!workspaceManager && input.role === 'MANAGER') throw forbidden();
    await requireWorkspaceMember(tx, project.workspaceId, input.userId);
    if (await repository.projectMembership(tx, projectId, input.userId)) {
      throw new AppError(
        409,
        ERROR_CODES.PROJECT_MEMBERSHIP_CONFLICT,
        'The user is already a project member.',
      );
    }
    return repository.addProjectMember(tx, projectId, input.userId, input.role);
  });
}
