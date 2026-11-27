import type { Prisma, PrismaClient } from '../../../generated/prisma/client.js';
import { createTaskAccessRepository } from '../../task/index.js';
import type {
  AttachmentRepository,
  AttachmentUnitOfWork,
  AttachmentWriter,
} from '../application/ports/attachments.port.js';

const metadata = {
  id: true,
  taskId: true,
  uploaderId: true,
  filename: true,
  mimeType: true,
  sizeBytes: true,
  createdAt: true,
} as const;

export class PrismaAttachments implements AttachmentRepository, AttachmentWriter {
  private readonly tasks;

  constructor(private readonly db: Prisma.TransactionClient) {
    this.tasks = createTaskAccessRepository(db);
  }

  async findAccess(taskId: string, actorId: string) {
    return (await this.tasks.findTaskAccess(taskId, actorId))?.access ?? null;
  }

  lockProject(projectId: string, workspaceId: string) {
    return this.tasks.lockProject(projectId, workspaceId);
  }

  list(taskId: string, page: number, size: number) {
    return this.db.attachment.findMany({
      where: { taskId },
      select: metadata,
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      skip: page * size,
      take: size,
    });
  }

  find(id: string) {
    return this.db.attachment.findUnique({ where: { id } });
  }

  create(data: Parameters<AttachmentWriter['create']>[0]) {
    return this.db.attachment.create({ data, select: metadata });
  }
}

export class PrismaAttachmentUnitOfWork implements AttachmentUnitOfWork {
  constructor(private readonly db: PrismaClient) {}

  execute<T>(work: (writer: AttachmentWriter) => Promise<T>) {
    return this.db.$transaction((tx) => work(new PrismaAttachments(tx)), {
      isolationLevel: 'ReadCommitted',
    });
  }
}
