import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { corsOptions } from './config/cors.js';
import { logger } from './config/logger.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { apiRateLimiter } from './middlewares/rate-limit.middleware.js';
import { requestIdMiddleware } from './middlewares/request-id.middleware.js';
import { rootRouter } from './routes/index.js';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(requestIdMiddleware);
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => req.requestId ?? 'unknown',
      customProps: (req) => ({ requestId: req.requestId }),
    }),
  );
  app.use(apiRateLimiter);

  app.use('/', rootRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

export const app = createApp();
