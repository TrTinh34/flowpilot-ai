import type {
  NotificationRecord,
  NotificationType,
  OutboxEventRecord,
} from '../../domain/notification.js';
import type { NotificationDto } from '../dtos/notification.dto.js';

export interface ListNotificationsOptions {
  page: number;
  size: number;
  unreadOnly: boolean;
}

export interface NotificationRepositoryPort {
  listForUser(
    userId: string,
    options: ListNotificationsOptions,
  ): Promise<{ items: NotificationRecord[]; unreadCount: number }>;
  markRead(notificationId: string, userId: string, readAt: Date): Promise<boolean>;
  markAllRead(userId: string, readAt: Date): Promise<number>;
}

export interface MentionContext {
  authorName: string;
  taskTitle: string;
}

export interface CreateNotificationInput {
  id: string;
  userId: string;
  projectId: string | null;
  taskId: string | null;
  outboxEventId: string;
  type: NotificationType;
  message: string;
}

export interface OutboxTransactionPort {
  claimNextPending(now: Date): Promise<OutboxEventRecord | null>;
  findMentionContext(commentId: string, taskId: string): Promise<MentionContext | null>;
  createNotifications(items: CreateNotificationInput[]): Promise<NotificationRecord[]>;
  markProcessed(outboxEventId: string): Promise<void>;
  markFailed(outboxEventId: string, attempts: number): Promise<void>;
}

export interface OutboxUnitOfWorkPort {
  execute<T>(work: (tx: OutboxTransactionPort) => Promise<T>): Promise<T>;
  scheduleRetry(outboxEventId: string, attempts: number, nextAttemptAt: Date): Promise<void>;
  markFailed(outboxEventId: string, attempts: number): Promise<void>;
}

export interface NotificationRealtimePort {
  emitToUser(userId: string, notification: NotificationDto): Promise<void> | void;
}
