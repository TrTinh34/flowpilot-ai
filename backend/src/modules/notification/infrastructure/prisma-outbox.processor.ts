import type { Prisma, PrismaClient } from '../../../generated/prisma/client.js';
import type {
  CreateNotificationInput,
  MentionContext,
  OutboxTransactionPort,
  OutboxUnitOfWorkPort,
} from '../application/ports/notifications.port.js';
import type { NotificationRecord, OutboxEventRecord } from '../domain/notification.js';

class PrismaOutboxTransaction implements OutboxTransactionPort {
  constructor(private readonly tx: Prisma.TransactionClient) {}

  async claimNextPending(now: Date): Promise<OutboxEventRecord | null> {
    const rows = await this.tx.$queryRaw<OutboxEventRecord[]>`
      SELECT
        id,
        event_type AS "eventType",
        payload,
        status,
        attempts,
        next_attempt_at AS "nextAttemptAt",
        created_at AS "createdAt"
      FROM outbox_events
      WHERE status = 'PENDING' AND next_attempt_at <= ${now}
      ORDER BY created_at ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    `;
    return rows[0] ?? null;
  }

  async findMentionContext(commentId: string, taskId: string): Promise<MentionContext | null> {
    const comment = await this.tx.comment.findFirst({
      where: { id: commentId, taskId },
      select: {
        author: { select: { displayName: true } },
        task: { select: { title: true } },
      },
    });
    if (!comment) return null;
    return {
      authorName: comment.author.displayName,
      taskTitle: comment.task.title,
    };
  }

  createNotifications(items: CreateNotificationInput[]): Promise<NotificationRecord[]> {
    return this.tx.notification.createManyAndReturn({
      data: items,
      skipDuplicates: true,
    });
  }

  async markProcessed(outboxEventId: string): Promise<void> {
    await this.tx.outboxEvent.update({
      where: { id: outboxEventId },
      data: { status: 'PROCESSED' },
    });
  }

  async markFailed(outboxEventId: string, attempts: number): Promise<void> {
    await this.tx.outboxEvent.update({
      where: { id: outboxEventId },
      data: { status: 'FAILED', attempts },
    });
  }
}

export class PrismaOutboxUnitOfWork implements OutboxUnitOfWorkPort {
  constructor(private readonly prisma: PrismaClient) {}

  execute<T>(work: (tx: OutboxTransactionPort) => Promise<T>): Promise<T> {
    return this.prisma.$transaction((tx) => work(new PrismaOutboxTransaction(tx)), {
      isolationLevel: 'ReadCommitted',
    });
  }

  async scheduleRetry(outboxEventId: string, attempts: number, nextAttemptAt: Date): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: { id: outboxEventId },
      data: { attempts, nextAttemptAt },
    });
  }

  async markFailed(outboxEventId: string, attempts: number): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: { id: outboxEventId },
      data: { status: 'FAILED', attempts },
    });
  }
}
