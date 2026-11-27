import { apiClient } from '@/services/api-client';
import type { NotificationPage } from '../types/notification.types';

export async function listNotifications(
  page = 0,
  size = 20,
  unreadOnly = false,
): Promise<NotificationPage> {
  const { data } = await apiClient.get<NotificationPage>('/notifications', {
    params: { page, size, unreadOnly },
  });
  return data;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await apiClient.patch(`/notifications/${notificationId}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all');
}
