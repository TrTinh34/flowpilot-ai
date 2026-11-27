import { Router, type RequestHandler } from 'express';
import type { ListNotifications } from '../application/use-cases/list-notifications.use-case.js';
import type { MarkNotificationRead } from '../application/use-cases/mark-notification-read.use-case.js';
import {
  listNotificationsQuerySchema,
  notificationIdParamsSchema,
} from './notification.schemas.js';
import {
  parseNotificationRequest,
  presentNotificationFailure,
  requireNotificationActor,
} from './notification-http.js';

export function createNotificationRouter(
  listNotifications: ListNotifications,
  markNotificationRead: MarkNotificationRead,
  authenticate: RequestHandler,
) {
  const router = Router();

  router.get('/', authenticate, async (req, res) => {
    try {
      const userId = requireNotificationActor(req);
      const query = parseNotificationRequest(listNotificationsQuerySchema, req.query);
      res.json(await listNotifications.execute({ userId, ...query }));
    } catch (error) {
      presentNotificationFailure(error);
    }
  });

  router.patch('/read-all', authenticate, async (req, res) => {
    try {
      const userId = requireNotificationActor(req);
      await markNotificationRead.markAll({ userId });
      res.status(204).send();
    } catch (error) {
      presentNotificationFailure(error);
    }
  });

  router.patch('/:notificationId/read', authenticate, async (req, res) => {
    try {
      const userId = requireNotificationActor(req);
      const { notificationId } = parseNotificationRequest(notificationIdParamsSchema, req.params);
      await markNotificationRead.execute({ notificationId, userId });
      res.status(204).send();
    } catch (error) {
      presentNotificationFailure(error);
    }
  });

  return router;
}
