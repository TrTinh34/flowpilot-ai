import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import type { PrismaClient } from '../../generated/prisma/client.js';
import type { NotificationRealtimePort } from './application/ports/notifications.port.js';
import { ListNotifications } from './application/use-cases/list-notifications.use-case.js';
import { MarkNotificationRead } from './application/use-cases/mark-notification-read.use-case.js';
import { ProcessOutboxEvents } from './application/use-cases/process-outbox.use-case.js';
import { PrismaNotificationsRepository } from './infrastructure/prisma-notifications.repository.js';
import { PrismaOutboxUnitOfWork } from './infrastructure/prisma-outbox.processor.js';
import { createNotificationRouter } from './presentation/notification.routes.js';

export function createNotificationModule(
  db: PrismaClient,
  authenticate: RequestHandler,
  realtime?: NotificationRealtimePort,
) {
  const repository = new PrismaNotificationsRepository(db);
  const notificationRouter = createNotificationRouter(
    new ListNotifications(repository),
    new MarkNotificationRead(repository),
    authenticate,
  );
  const processOutbox = new ProcessOutboxEvents(
    new PrismaOutboxUnitOfWork(db),
    randomUUID,
    realtime,
  );

  return { notificationRouter, processOutbox };
}
