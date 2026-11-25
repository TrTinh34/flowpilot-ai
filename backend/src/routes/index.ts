import { Router } from 'express';
import { checkDatabaseConnection } from '../config/prisma.js';
import { authRouter } from '../modules/auth/auth.routes.js';

const router = Router();
router.use('/api/v1/auth', authRouter);

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
