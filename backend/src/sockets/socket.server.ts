import type { Server as HttpServer } from 'node:http';
import type { Logger } from 'pino';
import { Server } from 'socket.io';
import { isAllowedOrigin } from '../config/cors.js';
import type { PrismaClient } from '../generated/prisma/client.js';
import type { AccessTokenVerifier } from '../modules/auth/index.js';
import type { NotificationDto, NotificationRealtimePort } from '../modules/notification/index.js';
import { createSocketAuthMiddleware } from './socket-auth.middleware.js';
import {
  type ProjectAccessChecker,
  projectRoom,
  registerSocketRoomHandlers,
  userRoom,
} from './socket-rooms.handler.js';

export function createPrismaProjectAccessChecker(db: PrismaClient): ProjectAccessChecker {
  return async (projectId: string, userId: string): Promise<boolean> => {
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { members: { some: { userId } } },
          { workspace: { members: { some: { userId, role: { in: ['OWNER', 'ADMIN'] } } } } },
        ],
      },
      select: { id: true },
    });
    return project !== null;
  };
}

export interface SocketServerHandle {
  io: Server;
  notificationRealtime: NotificationRealtimePort;
  emitToProject: (projectId: string, event: string, payload: unknown) => void;
  close: () => Promise<void>;
}

export function createSocketServer(
  httpServer: HttpServer,
  deps: {
    accessTokenVerifier: AccessTokenVerifier;
    canAccessProject: ProjectAccessChecker;
    logger?: Pick<Logger, 'info' | 'warn' | 'error'>;
  },
): SocketServerHandle {
  const io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin || isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Origin not allowed by CORS'));
      },
      credentials: true,
    },
  });

  io.use(createSocketAuthMiddleware(deps.accessTokenVerifier));

  io.on('connection', (socket) => {
    void registerSocketRoomHandlers(socket, deps.canAccessProject).catch((error) => {
      deps.logger?.error({ err: error, socketId: socket.id }, 'Socket room setup failed');
      socket.disconnect(true);
    });
  });

  const notificationRealtime: NotificationRealtimePort = {
    emitToUser(userId: string, notification: NotificationDto) {
      io.to(userRoom(userId)).emit('notification:new', notification);
    },
  };

  return {
    io,
    notificationRealtime,
    emitToProject(projectId: string, event: string, payload: unknown) {
      io.to(projectRoom(projectId)).emit(event, payload);
    },
    close() {
      return new Promise<void>((resolve) => {
        void io.close(() => resolve());
      });
    },
  };
}
