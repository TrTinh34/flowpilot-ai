import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

it.skipIf(!process.env['TEST_DATABASE_URL'])(
  'scopes comments to task access and persists valid mentions with the comment',
  async () => {
    await confirmTestDatabase();
    const { prisma, disconnectDatabase } = await import('../../src/config/prisma.js');
    const { accessTokenIssuer } = await import('../../src/modules/auth/index.js');
    const { PrismaCommentUnitOfWork } =
      await import('../../src/modules/collaboration/infrastructure/prisma-comments.js');
    const { createApp } = await import('../../src/app.js');
    const app = createApp();
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
      const member = await createActor('member');
      const manager = await createActor('manager');
      const outsideProject = await createActor('outsideProject');
      const outsideTenant = await createActor('outsideTenant');
      const workspace = await prisma.workspace.create({
        data: {
          name: 'Comment test',
          members: {
            create: [member, manager, outsideProject].map(({ id }) => ({
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
          name: 'Comment test',
          members: {
            create: [
              { userId: member.id, role: 'MEMBER' },
              { userId: manager.id, role: 'MANAGER' },
            ],
          },
        },
      });
      projectId = project.id;
      const task = await prisma.task.create({
        data: { projectId, title: 'Comment test', description: '', priority: 'LOW', position: 0 },
      });
      const path = `/api/v1/tasks/${task.id}/comments`;
      const add = (actor: { token: string }, body: string, mentionIds: string[]) =>
        request(app).post(path).auth(actor.token, { type: 'bearer' }).send({ body, mentionIds });
      const list = (actor: { token: string }, query = '') =>
        request(app)
          .get(path + query)
          .auth(actor.token, { type: 'bearer' });

      await request(app).get(path).expect(401);
      await list(outsideTenant).expect(404);
      await add(outsideTenant, 'Outside tenant', []).expect(404);
      await list(outsideProject).expect(403);
      await add(outsideProject, 'Outside project', []).expect(403);
      await add(member, '   ', []).expect(400);
      await list(member, '?size=101').expect(400);
      await add(member, 'Invalid mention', [manager.id, outsideProject.id]).expect(422);
      expect(await prisma.comment.count({ where: { taskId: task.id } })).toBe(0);

      const created = await add(member, '  Please review  ', [manager.id, manager.id]).expect(201);
      const reviewed = await add(manager, 'Reviewed', []).expect(201);
      expect(created.body.data).toMatchObject({
        taskId: task.id,
        authorId: member.id,
        authorName: 'member',
        body: 'Please review',
      });
      const firstPage = await list(member, '?size=1').expect(200);
      const secondPage = await list(member, '?size=1&page=1').expect(200);
      expect(secondPage.body).toMatchObject({ page: 1, size: 1 });
      expect(secondPage.body.data).toHaveLength(1);
      expect([firstPage.body.data[0].id, secondPage.body.data[0].id].sort()).toEqual(
        [created.body.data.id, reviewed.body.data.id].sort(),
      );

      const events = await prisma.outboxEvent.findMany({
        where: { payload: { path: ['taskId'], equals: task.id } },
      });
      expect(events).toMatchObject([
        {
          eventType: 'COMMENT_MENTIONED',
          status: 'PENDING',
          attempts: 0,
          payload: {
            commentId: created.body.data.id,
            taskId: task.id,
            projectId,
            authorId: member.id,
            recipientIds: [manager.id],
          },
        },
      ]);

      const transaction = new PrismaCommentUnitOfWork(prisma);
      const abort = new Error('Abort collaboration fixture');
      await expect(
        transaction.execute(async (writer) => {
          const comment = await writer.create({
            taskId: task.id,
            authorId: member.id,
            body: 'Rolled back',
          });
          await writer.enqueueMention({
            commentId: comment.id,
            taskId: task.id,
            projectId: project.id,
            authorId: member.id,
            recipientIds: [manager.id],
          });
          throw abort;
        }),
      ).rejects.toBe(abort);
      expect(await prisma.comment.count({ where: { taskId: task.id } })).toBe(2);
      expect(
        await prisma.outboxEvent.count({
          where: { payload: { path: ['taskId'], equals: task.id } },
        }),
      ).toBe(1);

      await prisma.project.update({ where: { id: projectId }, data: { status: 'ARCHIVED' } });
      await list(member).expect(200);
      await add(member, 'Archived project', []).expect(409);
    } finally {
      try {
        if (projectId) {
          await prisma.$transaction([
            prisma.outboxEvent.deleteMany({
              where: { payload: { path: ['projectId'], equals: projectId } },
            }),
            prisma.comment.deleteMany({ where: { task: { projectId } } }),
            prisma.task.deleteMany({ where: { projectId } }),
            prisma.projectMember.deleteMany({ where: { projectId } }),
            prisma.project.delete({ where: { id: projectId } }),
          ]);
        }
        if (workspaceId) {
          await prisma.workspaceMember.deleteMany({ where: { workspaceId } });
          await prisma.workspace.delete({ where: { id: workspaceId } });
        }
        await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      } finally {
        await disconnectDatabase();
      }
    }
  },
);
