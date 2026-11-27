import { Router } from 'express';
import { checkDatabaseConnection, prisma } from '../config/prisma.js';
import { authenticate, authRouter } from '../modules/auth/index.js';
import {
  createCollaborationModule,
  type AttachmentStorage,
} from '../modules/collaboration/index.js';
import { projectRouter } from '../modules/project/project.routes.js';
import { myTasksRouter, projectTasksRouter, taskRouter } from '../modules/task/index.js';
import { invitationRouter, workspaceRouter } from '../modules/workspace/workspace.routes.js';

export function createRootRouter(storage?: AttachmentStorage) {
  const router = Router();
  const { commentRouter, taskAttachmentsRouter, attachmentDownloadRouter } =
    createCollaborationModule(prisma, authenticate, storage);
  router.use('/api/v1/auth', authRouter);
  router.use('/api/v1/workspaces', workspaceRouter);
  router.use('/api/v1/projects/:projectId/tasks', projectTasksRouter);
  router.use('/api/v1/projects', projectRouter);
  router.use('/api/v1/tasks/:taskId/comments', commentRouter);
  router.use('/api/v1/tasks/:taskId/attachments', taskAttachmentsRouter);
  router.use('/api/v1/attachments', attachmentDownloadRouter);
  router.use('/api/v1/tasks', taskRouter);
  router.use('/api/v1/me/tasks', myTasksRouter);
  router.use('/api/v1/invitations', invitationRouter);

  router.get('/health', async (_req, res) => {
    const dbUp = await checkDatabaseConnection();

    if (!dbUp) {
      res.status(503).json({
        status: 'degraded',
        services: {
          api: 'up',
          database: 'down',
        },
      });
      return;
    }

    res.status(200).json({
      status: 'ok',
      services: {
        api: 'up',
        database: 'up',
      },
    });
  });

  return router;
}
