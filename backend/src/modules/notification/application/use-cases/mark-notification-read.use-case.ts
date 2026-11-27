import { NotificationFailure } from '../../domain/notification-failure.js';
import type { NotificationRepositoryPort } from '../ports/notifications.port.js';

export class MarkNotificationRead {
  constructor(
    private readonly repository: NotificationRepositoryPort,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async execute(input: { notificationId: string; userId: string }): Promise<void> {
    const updated = await this.repository.markRead(input.notificationId, input.userId, this.now());
    if (!updated) {
      throw new NotificationFailure('not_found', 'Notification not found.');
    }
  }

  markAll(input: { userId: string }): Promise<number> {
    return this.repository.markAllRead(input.userId, this.now());
  }
}
