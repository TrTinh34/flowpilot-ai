import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { expect, it, vi } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

it.skipIf(!process.env['TEST_DATABASE_URL'])(
  'processes mention outbox events into scoped notifications and marks read cleanly',
  async () => {
    await confirmTestDatabase();
    const { prisma, disconnectDatabase } = await import('../../src/config/prisma.js');
    const { accessTokenIssuer, authenticate } = await import('../../src/modules/auth/index.js');
    const { createNotificationModule } = await import('../../src/modules/notification/index.js');
    const { createApp } = await import('../../src/app.js');

    const realtime = { emitToUser: vi.fn() };
    const app = createApp({ notificationRealtime: realtime });
    const { processOutbox } = createNotificationModule(prisma, authenticate, realtime);
    const fixtureId = randomUUID();
    const userIds: string[] = [];
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
      const bystander = await createActor('Bystander');

      const workspace = await prisma.workspace.create({
        data: {
          name: `Noti workspace ${fixtureId}`,
          members: {
            create: [author, recipient, bystander].map(({ id }) => ({
              userId: id,
              role: 'MEMBER',
            })),
          },
        },
      });
      workspaceId = workspace.id;

      const project = await prisma.project.create({
        data: {
          workspaceId,
          name: 'Noti project',
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
          title: 'Deploy API',
          description: '',
          priority: 'HIGH',
          position: 0,
        },
      });

      // Unauthenticated inbox request is rejected
      await request(app).get('/api/v1/notifications').expect(401);

      // Post comment mentioning recipient -> writes OutboxEvent in the same transaction
      await request(app)
        .post(`/api/v1/tasks/${task.id}/comments`)
        .auth(author.token, { type: 'bearer' })
        .send({ body: 'Please review this task', mentionIds: [recipient.id] })
        .expect(201);

      const batch = await processOutbox.execute(20);
      expect(batch.processed).toBeGreaterThanOrEqual(1);
      expect(batch.notificationsCreated).toBeGreaterThanOrEqual(1);
      expect(realtime.emitToUser).toHaveBeenCalledWith(
        recipient.id,
        expect.objectContaining({
          type: 'TASK_MENTION',
          taskId: task.id,
          projectId,
          isRead: false,
        }),
      );

      // Polling again does not duplicate notifications
      const secondBatch = await processOutbox.execute(20);
      expect(secondBatch.notificationsCreated).toBe(0);

      // Recipient lists own notifications
      const inboxRes = await request(app)
        .get('/api/v1/notifications')
        .auth(recipient.token, { type: 'bearer' })
        .expect(200);
      expect(inboxRes.body.unreadCount).toBe(1);
      expect(inboxRes.body.data).toHaveLength(1);
      expect(inboxRes.body.data[0]).toMatchObject({
        type: 'TASK_MENTION',
        taskId: task.id,
        projectId,
        isRead: false,
      });
      expect(inboxRes.body.data[0].message).toContain('Author mentioned you in "Deploy API"');

      const notificationId = inboxRes.body.data[0].id as string;

      // Bystander has empty inbox and cannot mark recipient's notification read (404)
      const bystanderInbox = await request(app)
        .get('/api/v1/notifications')
        .auth(bystander.token, { type: 'bearer' })
        .expect(200);
      expect(bystanderInbox.body.data).toHaveLength(0);
      await request(app)
        .patch(`/api/v1/notifications/${notificationId}/read`)
        .auth(bystander.token, { type: 'bearer' })
        .expect(404);

      // Unread filter and mark-read / idempotent mark-read
      await request(app)
        .get('/api/v1/notifications?unreadOnly=true')
        .auth(recipient.token, { type: 'bearer' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
        });

      await request(app)
        .patch(`/api/v1/notifications/${notificationId}/read`)
        .auth(recipient.token, { type: 'bearer' })
        .expect(204);

      // Idempotent second read returns 204 for owner
      await request(app)
        .patch(`/api/v1/notifications/${notificationId}/read`)
        .auth(recipient.token, { type: 'bearer' })
        .expect(204);

      const afterRead = await request(app)
        .get('/api/v1/notifications?unreadOnly=true')
        .auth(recipient.token, { type: 'bearer' })
        .expect(200);
      expect(afterRead.body.unreadCount).toBe(0);
      expect(afterRead.body.data).toHaveLength(0);

      // Direct unread notifications can be cleared via /read-all
      await prisma.notification.createMany({
        data: [
          {
            id: randomUUID(),
            userId: recipient.id,
            type: 'INVITATION',
            message: 'Invite A',
          },
          {
            id: randomUUID(),
            userId: recipient.id,
            type: 'INVITATION',
            message: 'Invite B',
          },
        ],
      });
      await request(app)
        .patch('/api/v1/notifications/read-all')
        .auth(recipient.token, { type: 'bearer' })
        .expect(204);
      const afterAll = await request(app)
        .get('/api/v1/notifications')
        .auth(recipient.token, { type: 'bearer' })
        .expect(200);
      expect(afterAll.body.unreadCount).toBe(0);
    } finally {
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
