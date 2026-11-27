import type { Prisma, PrismaClient } from '../../../generated/prisma/client.js';
import { createTaskAccessRepository } from '../../task/index.js';
import type {
  CommentReader,
  CommentUnitOfWork,
  CommentWriter,
} from '../application/ports/comments.port.js';
import type { Comment } from '../domain/comment.js';

const commentAuthor = { author: { select: { displayName: true } } } as const;

function toComment({
  author,
  ...comment
}: Omit<Comment, 'authorName'> & {
  author: { displayName: string };
}): Comment {
  return { ...comment, authorName: author.displayName };
}

export class PrismaComments implements CommentReader, CommentWriter {
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

  async list(taskId: string, page: number, size: number) {
    const comments = await this.db.comment.findMany({
      where: { taskId },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      skip: page * size,
      take: size,
      include: commentAuthor,
    });
    return comments.map(toComment);
  }

  async findMentionMembers(projectId: string, workspaceId: string, ids: string[]) {
    const members = await this.db.projectMember.findMany({
      where: {
        projectId,
        userId: { in: ids },
        user: { workspaceMemberships: { some: { workspaceId } } },
      },
      select: { userId: true },
    });
    return members.map(({ userId }) => userId);
  }

  async create(data: Parameters<CommentWriter['create']>[0]) {
    return toComment(await this.db.comment.create({ data, include: commentAuthor }));
  }

  async enqueueMention(payload: Parameters<CommentWriter['enqueueMention']>[0]) {
    await this.db.outboxEvent.create({ data: { eventType: 'COMMENT_MENTIONED', payload } });
  }
}

export class PrismaCommentUnitOfWork implements CommentUnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  execute<T>(work: (writer: CommentWriter) => Promise<T>): Promise<T> {
    return this.prisma.$transaction((tx) => work(new PrismaComments(tx)), {
      isolationLevel: 'ReadCommitted',
    });
  }
}
