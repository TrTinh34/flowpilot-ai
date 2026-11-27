import { toNotificationDto, type NotificationDto } from '../dtos/notification.dto.js';
import type { OutboxEventRecord } from '../../domain/notification.js';
import type {
  CreateNotificationInput,
  NotificationRealtimePort,
  OutboxTransactionPort,
  OutboxUnitOfWorkPort,
} from '../ports/notifications.port.js';

const MAX_ATTEMPTS = 5;

interface MentionPayload {
  commentId: string;
  taskId: string;
  projectId: string;
  authorId: string;
  recipientIds: string[];
}

function parseMentionPayload(payload: unknown): MentionPayload | null {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as Record<string, unknown>;
  if (
    typeof record['commentId'] !== 'string' ||
    typeof record['taskId'] !== 'string' ||
    typeof record['projectId'] !== 'string' ||
    typeof record['authorId'] !== 'string' ||
    !Array.isArray(record['recipientIds'])
  ) {
    return null;
  }
  const recipientIds = [
    ...new Set(
      record['recipientIds']
        .filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
        .map((id) => id.toLowerCase()),
    ),
  ];
  return {
    commentId: record['commentId'],
    taskId: record['taskId'],
    projectId: record['projectId'],
    authorId: record['authorId'],
    recipientIds,
  };
}

type OutboxEventHandler = (
  tx: OutboxTransactionPort,
  event: OutboxEventRecord,
  newId: () => string,
) => Promise<{ created: CreateNotificationInput[] } | 'invalid_payload'>;

const eventHandlers: Record<string, OutboxEventHandler> = {
  COMMENT_MENTIONED: async (tx, event, newId) => {
    const payload = parseMentionPayload(event.payload);
    if (!payload) return 'invalid_payload';
    if (payload.recipientIds.length === 0) return { created: [] };

    const context = await tx.findMentionContext(payload.commentId, payload.taskId);
    const message = context
      ? `${context.authorName} mentioned you in "${context.taskTitle}"`
      : 'Someone mentioned you in a task comment.';

    return {
      created: payload.recipientIds.map((userId) => ({
        id: newId(),
        userId,
        projectId: payload.projectId,
        taskId: payload.taskId,
        outboxEventId: event.id,
        type: 'TASK_MENTION',
        message,
      })),
    };
  },
};

export interface ProcessOutboxResult {
  processed: number;
  failed: number;
  retried: number;
  notificationsCreated: number;
}

export class ProcessOutboxEvents {
  constructor(
    private readonly unitOfWork: OutboxUnitOfWorkPort,
    private readonly newId: () => string,
    private readonly realtime?: NotificationRealtimePort,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async execute(batchSize = 20): Promise<ProcessOutboxResult> {
    const summary: ProcessOutboxResult = {
      processed: 0,
      failed: 0,
      retried: 0,
      notificationsCreated: 0,
    };

    for (let index = 0; index < batchSize; index += 1) {
      const outcome = await this.processSingle();
      if (outcome === 'empty') break;
      if (outcome.status === 'processed') {
        summary.processed += 1;
        summary.notificationsCreated += outcome.emitted.length;
        for (const dto of outcome.emitted) {
          await this.realtime?.emitToUser(dto.userId, dto.notification);
        }
      } else if (outcome.status === 'retried') {
        summary.retried += 1;
      } else {
        summary.failed += 1;
      }
    }

    return summary;
  }

  private async processSingle(): Promise<
    | 'empty'
    | { status: 'processed'; emitted: Array<{ userId: string; notification: NotificationDto }> }
    | { status: 'retried' | 'failed' }
  > {
    let claimed: OutboxEventRecord | null = null;
    try {
      return await this.unitOfWork.execute(async (tx) => {
        const event = await tx.claimNextPending(this.now());
        if (!event) return 'empty';
        claimed = event;

        const handler = eventHandlers[event.eventType];
        if (!handler) {
          await tx.markFailed(event.id, event.attempts + 1);
          return { status: 'failed' };
        }

        const handled = await handler(tx, event, this.newId);
        if (handled === 'invalid_payload') {
          await tx.markFailed(event.id, event.attempts + 1);
          return { status: 'failed' };
        }

        const inserted =
          handled.created.length > 0 ? await tx.createNotifications(handled.created) : [];
        await tx.markProcessed(event.id);
        return {
          status: 'processed',
          emitted: inserted.map((item) => ({
            userId: item.userId,
            notification: toNotificationDto(item),
          })),
        };
      });
    } catch {
      if (!claimed) {
        throw new Error('Failed while claiming outbox event.');
      }
      const nextAttempts = (claimed as OutboxEventRecord).attempts + 1;
      const eventId = (claimed as OutboxEventRecord).id;
      if (nextAttempts >= MAX_ATTEMPTS) {
        await this.unitOfWork.markFailed(eventId, nextAttempts);
        return { status: 'failed' };
      }
      const delayMs = Math.min(60, 2 ** nextAttempts) * 1000;
      const nextAttemptAt = new Date(this.now().getTime() + delayMs);
      await this.unitOfWork.scheduleRetry(eventId, nextAttempts, nextAttemptAt);
      return { status: 'retried' };
    }
  }
}
