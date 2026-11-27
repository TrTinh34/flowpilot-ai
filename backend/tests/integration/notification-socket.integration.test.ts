import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { io as createClient, type Socket as ClientSocket } from 'socket.io-client';
import request from 'supertest';
import { expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

function connectClient(baseUrl: string, auth: Record<string, unknown>): Promise<ClientSocket> {
  return new Promise((resolve, reject) => {
    const client = createClient(baseUrl, {
      auth,
      forceNew: true,
      reconnection: false,
      transports: ['websocket'],
    });
    const onError = (err: Error) => {
      client.close();
      reject(err);
    };
    client.once('connect', () => {
      client.off('connect_error', onError);
      resolve(client);
    });
    client.once('connect_error', onError);
  });
}

it.skipIf(!process.env['TEST_DATABASE_URL'])(
  'authenticates Socket.IO handshakes via JWT, enforces room isolation, and delivers mentions live',
  async () => {
    await confirmTestDatabase();
    const { prisma, disconnectDatabase } = await import('../../src/config/prisma.js');
    const { accessTokenIssuer, accessTokenVerifier, authenticate } =
      await import('../../src/modules/auth/index.js');
    const { createNotificationModule } = await import('../../src/modules/notification/index.js');
    const { createApp } = await import('../../src/app.js');
    const { createPrismaProjectAccessChecker, createSocketServer } =
      await import('../../src/sockets/socket.server.js');

    const httpServer = createServer();
    const socketServer = createSocketServer(httpServer, {
      accessTokenVerifier,
      canAccessProject: createPrismaProjectAccessChecker(prisma),
    });
    const app = createApp({ notificationRealtime: socketServer.notificationRealtime });
    httpServer.on('request', app);

    await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', () => resolve()));
    const { port } = httpServer.address() as AddressInfo;
    const baseUrl = `http://127.0.0.1:${port}`;

    const { processOutbox } = createNotificationModule(
      prisma,
      authenticate,
      socketServer.notificationRealtime,
    );

    const fixtureId = randomUUID();
    const userIds: string[] = [];
    const sockets: ClientSocket[] = [];
    let workspaceId: string | undefined;
    let projectId: string | undefined;

    async function createActor(name: string) {
      const user = await prisma.user.create({
        data: {
          email: `${name}.${fixtureId}@example.test`,
          displayName: name,
          passwordHash: 'fixture',
        },
      });
      userIds.push(user.id);
      return { id: user.id, token: await accessTokenIssuer.issueAccessToken(user.id) };
    }

    try {
      const author = await createActor('Author');
      const recipient = await createActor('Recipient');
      const outsider = await createActor('Outsider');

      const workspace = await prisma.workspace.create({
        data: {
          name: `Socket workspace ${fixtureId}`,
          members: {
            create: [
              { userId: author.id, role: 'MEMBER' },
              { userId: recipient.id, role: 'MEMBER' },
            ],
          },
        },
      });
      workspaceId = workspace.id;

      const project = await prisma.project.create({
        data: {
          workspaceId,
          name: 'Socket project',
          members: {
            create: [
              { userId: author.id, role: 'MANAGER' },
              { userId: recipient.id, role: 'MEMBER' },
            ],
          },
        },
      });
      projectId = project.id;

      const task = await prisma.task.create({
        data: {
          projectId,
          title: 'Wire Socket.IO',
          description: '',
          priority: 'HIGH',
          position: 0,
        },
      });

      // Reject missing or invalid JWT
      await expect(connectClient(baseUrl, {})).rejects.toThrow(/Unauthorized/i);
      await expect(connectClient(baseUrl, { token: 'invalid.jwt.token' })).rejects.toThrow(
        /Unauthorized/i,
      );

      // Connect authenticated clients
      const recipientSocket = await connectClient(baseUrl, { token: recipient.token });
      const outsiderSocket = await connectClient(baseUrl, { token: outsider.token });
      sockets.push(recipientSocket, outsiderSocket);

      // Project room authorization: outsider rejected, recipient allowed
      const outsiderJoin = await new Promise<{ ok: boolean; error?: string }>((resolve) =>
        outsiderSocket.emit('project:join', projectId, resolve),
      );
      expect(outsiderJoin).toEqual({ ok: false, error: 'FORBIDDEN' });

      const recipientJoin = await new Promise<{ ok: boolean; error?: string }>((resolve) =>
        recipientSocket.emit('project:join', projectId, resolve),
      );
      expect(recipientJoin).toEqual({ ok: true });

      // Trigger comment mention -> outbox worker -> live notification only to recipient
      let outsiderReceived = false;
      outsiderSocket.on('notification:new', () => {
        outsiderReceived = true;
      });

      const receivedPromise = new Promise<Record<string, unknown>>((resolve) => {
        recipientSocket.once('notification:new', (payload: Record<string, unknown>) =>
          resolve(payload),
        );
      });

      await request(app)
        .post(`/api/v1/tasks/${task.id}/comments`)
        .auth(author.token, { type: 'bearer' })
        .send({ body: 'Ping over socket', mentionIds: [recipient.id] })
        .expect(201);

      await processOutbox.execute(20);
      const livePayload = await receivedPromise;
      expect(livePayload).toMatchObject({
        type: 'TASK_MENTION',
        projectId,
        taskId: task.id,
        isRead: false,
      });

      // Give any stray event a brief tick to verify outsider isolation
      await new Promise((r) => setTimeout(r, 80));
      expect(outsiderReceived).toBe(false);

      // Simulating reconnect: fetching GET /notifications recovers the unread item
      const reconnectInbox = await request(app)
        .get('/api/v1/notifications?unreadOnly=true')
        .auth(recipient.token, { type: 'bearer' })
        .expect(200);
      expect(reconnectInbox.body.unreadCount).toBe(1);
      expect(reconnectInbox.body.data).toHaveLength(1);
    } finally {
      for (const s of sockets) s.close();
      await socketServer.close();
      await new Promise<void>((resolve) => httpServer.close(() => resolve()));
      await prisma.notification.deleteMany({ where: { userId: { in: userIds } } });
      if (projectId) {
        await prisma.outboxEvent.deleteMany({
          where: { payload: { path: ['projectId'], equals: projectId } },
        });
        await prisma.comment.deleteMany({ where: { task: { projectId } } });
        await prisma.task.deleteMany({ where: { projectId } });
        await prisma.projectMember.deleteMany({ where: { projectId } });
        await prisma.project.deleteMany({ where: { id: projectId } });
      }
      if (workspaceId) {
        await prisma.workspaceMember.deleteMany({ where: { workspaceId } });
        await prisma.workspace.deleteMany({ where: { id: workspaceId } });
      }
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      await disconnectDatabase();
    }
  },
);
