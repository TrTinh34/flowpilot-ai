export type NotificationType = 'TASK_ASSIGNED' | 'TASK_COMMENT' | 'TASK_MENTION' | 'INVITATION';

export interface NotificationRecord {
  id: string;
  userId: string;
  projectId: string | null;
  taskId: string | null;
  outboxEventId: string | null;
  type: NotificationType;
  message: string;
  readAt: Date | null;
  createdAt: Date;
}

export interface OutboxEventRecord {
  id: string;
  eventType: string;
  payload: unknown;
  status: string;
  attempts: number;
  nextAttemptAt: Date;
  createdAt: Date;
}

export function isNotificationRead(notification: Pick<NotificationRecord, 'readAt'>): boolean {
  return notification.readAt !== null;
}
