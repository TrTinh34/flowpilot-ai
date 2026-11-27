import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { NotificationRecord } from '../domain/notification.js';
import type {
  ListNotificationsOptions,
  NotificationRepositoryPort,
} from '../application/ports/notifications.port.js';

export class PrismaNotificationsRepository implements NotificationRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async listForUser(
    userId: string,
    options: ListNotificationsOptions,
  ): Promise<{ items: NotificationRecord[]; unreadCount: number }> {
    const where = options.unreadOnly ? { userId, readAt: null } : { userId };
    const [items, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: options.page * options.size,
        take: options.size,
      }),
      this.prisma.notification.count({
        where: { userId, readAt: null },
      }),
    ]);

    return { items, unreadCount };
  }

  async markRead(notificationId: string, userId: string, readAt: Date): Promise<boolean> {
    const updated = await this.prisma.notification.updateMany({
      where: { id: notificationId, userId, readAt: null },
      data: { readAt },
    });
    if (updated.count > 0) return true;

    const existing = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
      select: { id: true },
    });
    return existing !== null;
  }

  async markAllRead(userId: string, readAt: Date): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt },
    });
    return result.count;
  }
}
