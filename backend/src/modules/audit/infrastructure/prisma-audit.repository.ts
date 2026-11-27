import { randomUUID } from 'node:crypto';
import type { Prisma, PrismaClient } from '../../../generated/prisma/client.js';
import type {
  AuditLogReaderPort,
  AuditLoggerPort,
  AuditProjectAccess,
} from '../application/ports/audit.port.js';
import type { AuditLogInput, AuditLogRecord } from '../domain/audit-log.js';

function sanitizeMetadata(metadata: Record<string, unknown> | undefined): Prisma.InputJsonValue {
  if (!metadata) return {};
  return metadata as Prisma.InputJsonValue;
}

export class PrismaAuditLogger implements AuditLoggerPort {
  constructor(private readonly db: Prisma.TransactionClient | PrismaClient) {}

  async record(entry: AuditLogInput): Promise<void> {
    await this.db.auditLog.create({
      data: {
        id: randomUUID(),
        workspaceId: entry.workspaceId,
        projectId: entry.projectId,
        actorId: entry.actorId,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId,
        metadata: sanitizeMetadata(entry.metadata),
      },
    });
  }
}

export class PrismaAuditReader implements AuditLogReaderPort {
  constructor(private readonly db: PrismaClient) {}

  async findProjectAccess(projectId: string, actorId: string): Promise<AuditProjectAccess | null> {
    const project = await this.db.project.findFirst({
      where: {
        id: projectId,
        workspace: { members: { some: { userId: actorId } } },
      },
      select: {
        workspaceId: true,
        workspace: {
          select: {
            members: { where: { userId: actorId }, select: { role: true }, take: 1 },
          },
        },
        members: { where: { userId: actorId }, select: { role: true }, take: 1 },
      },
    });

    if (!project) return null;
    const workspaceRole = project.workspace.members[0]?.role;
    const projectRole = project.members[0]?.role;

    if (workspaceRole === 'OWNER' || workspaceRole === 'ADMIN') {
      return { workspaceId: project.workspaceId, canReadAudit: true };
    }
    if (!projectRole) {
      return { workspaceId: project.workspaceId, canReadAudit: false };
    }
    return {
      workspaceId: project.workspaceId,
      canReadAudit: projectRole === 'MANAGER',
    };
  }

  async listByProject(projectId: string, page: number, size: number): Promise<AuditLogRecord[]> {
    const rows = await this.db.auditLog.findMany({
      where: { projectId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: page * size,
      take: size,
      include: { actor: { select: { displayName: true } } },
    });

    return rows.map(({ actor, metadata, ...rest }) => ({
      ...rest,
      actorName: actor.displayName,
      metadata:
        metadata && typeof metadata === 'object' && !Array.isArray(metadata)
          ? (metadata as Record<string, unknown>)
          : {},
    }));
  }
}
