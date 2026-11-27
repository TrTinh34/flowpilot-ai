import type { NotificationRecord, NotificationType } from '../../domain/notification.js';

export interface NotificationDto {
  id: string;
  type: NotificationType;
  message: string;
  projectId: string | null;
  taskId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export function toNotificationDto(record: NotificationRecord): NotificationDto {
  return {
    id: record.id,
    type: record.type,
    message: record.message,
    projectId: record.projectId,
    taskId: record.taskId,
    isRead: record.readAt !== null,
    readAt: record.readAt ? record.readAt.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
  };
}
