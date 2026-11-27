import { createServer } from 'node:http';
import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { disconnectDatabase, prisma } from './config/prisma.js';
import { JobRunner } from './jobs/job-runner.js';
import { createOutboxWorker } from './jobs/outbox.worker.js';
import { accessTokenVerifier, authenticate } from './modules/auth/index.js';
import { createNotificationModule } from './modules/notification/index.js';
import { createPrismaProjectAccessChecker, createSocketServer } from './sockets/socket.server.js';

const httpServer = createServer(app);
const socketServer = createSocketServer(httpServer, {
  accessTokenVerifier,
  canAccessProject: createPrismaProjectAccessChecker(prisma),
  logger,
});

const { processOutbox } = createNotificationModule(
  prisma,
  authenticate,
  socketServer.notificationRealtime,
);
const jobRunner = new JobRunner([createOutboxWorker(processOutbox, logger)]);

httpServer.listen(env.PORT, () => {
  jobRunner.start();
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'FlowPilot AI backend server started');
});

httpServer.on('error', (error: NodeJS.ErrnoException) => {
  logger.error({ err: error }, 'Failed to start HTTP server');
  process.exitCode = 1;
});

let isShuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  logger.info({ signal }, 'Graceful shutdown initiated');

  await jobRunner.stop();
  await socketServer.close();

  httpServer.close(async (closeError) => {
    if (closeError) {
      logger.error({ err: closeError }, 'Error while closing HTTP server');
      process.exitCode = 1;
    }

    try {
      await disconnectDatabase();
      logger.info('Database connections closed');
    } catch (dbError) {
      logger.error({ err: dbError }, 'Error while disconnecting database');
      process.exitCode = 1;
    } finally {
      process.exit();
    }
  });
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
