import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { disconnectDatabase } from './config/prisma.js';

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'FlowPilot AI backend server started');
});

server.on('error', (error: NodeJS.ErrnoException) => {
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

  server.close(async (closeError) => {
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
