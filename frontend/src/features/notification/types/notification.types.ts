export type NotificationType = 'TASK_ASSIGNED' | 'TASK_COMMENT' | 'TASK_MENTION' | 'INVITATION';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  projectId?: string | null;
  taskId?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationPage {
  data: NotificationItem[];
  page: number;
  size: number;
  unreadCount: number;
}
