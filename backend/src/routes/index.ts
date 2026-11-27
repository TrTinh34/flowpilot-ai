import { Router } from 'express';
import { checkDatabaseConnection } from '../config/prisma.js';
import { authRouter } from '../modules/auth/index.js';
import { projectRouter } from '../modules/project/project.routes.js';
import { invitationRouter, workspaceRouter } from '../modules/workspace/workspace.routes.js';

const router = Router();
router.use('/api/v1/auth', authRouter);
router.use('/api/v1/workspaces', workspaceRouter);
router.use('/api/v1/projects', projectRouter);
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

export { router as rootRouter };
