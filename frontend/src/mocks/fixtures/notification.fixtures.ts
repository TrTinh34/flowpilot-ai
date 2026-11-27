export type NotificationType = 'TASK_ASSIGNED' | 'TASK_COMMENT' | 'TASK_MENTION' | 'INVITATION';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  taskId?: string;
  isRead: boolean;
  createdAt: string;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'TASK_ASSIGNED',
    message: 'Alice assigned you to "Set up CI pipeline"',
    taskId: 'mock-task-1',
    isRead: false,
    createdAt: '2026-11-27T10:00:00Z',
  },
  {
    id: 'n2',
    type: 'TASK_COMMENT',
    message: 'Bob commented on "User auth API"',
    taskId: 'mock-task-2',
    isRead: false,
    createdAt: '2026-11-27T09:30:00Z',
  },
  {
    id: 'n3',
    type: 'TASK_MENTION',
    message: 'Charlie mentioned you in "Database schema"',
    taskId: 'mock-task-3',
    isRead: true,
    createdAt: '2026-11-26T18:00:00Z',
  },
  {
    id: 'n4',
    type: 'TASK_ASSIGNED',
    message: 'Alice assigned you to "Write API tests"',
    taskId: 'mock-task-4',
    isRead: true,
    createdAt: '2026-11-26T15:00:00Z',
  },
];
