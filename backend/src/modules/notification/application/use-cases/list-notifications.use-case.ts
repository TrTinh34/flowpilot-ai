import { toNotificationDto } from '../dtos/notification.dto.js';
import type { NotificationRepositoryPort } from '../ports/notifications.port.js';

export class ListNotifications {
  constructor(private readonly repository: NotificationRepositoryPort) {}

  async execute(input: { userId: string; page: number; size: number; unreadOnly: boolean }) {
    const { items, unreadCount } = await this.repository.listForUser(input.userId, {
      page: input.page,
      size: input.size,
      unreadOnly: input.unreadOnly,
    });
    return {
      data: items.map(toNotificationDto),
      page: input.page,
      size: input.size,
      unreadCount,
    };
  }
}
