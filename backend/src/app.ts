import { S3Client } from '@aws-sdk/client-s3';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { corsOptions } from './config/cors.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { S3Storage } from './integrations/storage/s3-storage.provider.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { apiRateLimiter } from './middlewares/rate-limit.middleware.js';
import { requestIdMiddleware } from './middlewares/request-id.middleware.js';
import type { AttachmentStorage } from './modules/collaboration/index.js';
import type { NotificationRealtimePort } from './modules/notification/index.js';
import { createRootRouter } from './routes/index.js';

const storage = env.S3_BUCKET
  ? new S3Storage(
      new S3Client({
        region: env.S3_REGION,
        endpoint: env.S3_ENDPOINT || undefined,
        forcePathStyle: Boolean(env.S3_ENDPOINT),
        requestChecksumCalculation: 'WHEN_REQUIRED',
        credentials:
          env.S3_ACCESS_KEY && env.S3_SECRET_KEY
            ? { accessKeyId: env.S3_ACCESS_KEY, secretAccessKey: env.S3_SECRET_KEY }
            : undefined,
      }),
      env.S3_BUCKET,
    )
  : undefined;

export function createApp(
  options: {
    attachmentStorage?: AttachmentStorage;
    notificationRealtime?: NotificationRealtimePort;
  } = {},
): Express {
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

  app.use(
    '/',
    createRootRouter(options.attachmentStorage ?? storage, options.notificationRealtime),
  );

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

export const app = createApp();
