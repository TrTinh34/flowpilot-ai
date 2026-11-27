import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { expect, it, vi } from 'vitest';
import { MAX_ATTACHMENT_BYTES } from '../../src/modules/collaboration/domain/attachment.js';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

it.skipIf(!process.env['TEST_DATABASE_URL'])(
  'validates uploads, scopes attachment access, and signs downloads with fake storage',
  async () => {
    await confirmTestDatabase();
    const { prisma, disconnectDatabase } = await import('../../src/config/prisma.js');
    const { accessTokenIssuer } = await import('../../src/modules/auth/index.js');
    const { createApp } = await import('../../src/app.js');
    const objects = new Map<string, Uint8Array>();
    const storage = {
      put: vi.fn(async (key: string, content: Uint8Array) => {
        objects.set(key, content);
      }),
      delete: vi.fn(async (key: string) => {
        objects.delete(key);
      }),
      signDownload: vi.fn(async (key: string) => {
        if (!objects.has(key)) throw new Error('Fake object missing');
        return 'https://storage.example.test/signed';
      }),
    };
    const app = createApp({ attachmentStorage: storage });
    const userIds: string[] = [];
    let workspaceId: string | undefined;
    let projectId: string | undefined;

    async function actor() {
      const user = await prisma.user.create({
        data: {
          email: `${randomUUID()}@example.test`,
          displayName: 'Attachment fixture',
          passwordHash: 'fixture',
        },
      });
      userIds.push(user.id);
      return { id: user.id, token: await accessTokenIssuer.issueAccessToken(user.id) };
    }

    try {
      const member = await actor();
      const outsideProject = await actor();
      const outsideTenant = await actor();
      workspaceId = (
        await prisma.workspace.create({
          data: {
            name: 'Attachment fixture',
            members: {
              create: [member, outsideProject].map(({ id }) => ({ userId: id, role: 'MEMBER' })),
            },
          },
        })
      ).id;
      const project = await prisma.project.create({
        data: {
          name: 'Attachment fixture',
          workspaceId,
          members: { create: { userId: member.id, role: 'MEMBER' } },
        },
      });
      projectId = project.id;
      const task = await prisma.task.create({
        data: {
          projectId,
          title: 'Attachment fixture',
          description: '',
          position: 0,
          priority: 'LOW',
        },
      });
      const base = `/api/v1/tasks/${task.id}/attachments`;
      const send = (
        token: string,
        bytes = Buffer.from('%PDF-1.7'),
        contentType = 'application/pdf',
      ) =>
        request(app)
          .post(base)
          .auth(token, { type: 'bearer' })
          .attach('file', bytes, { filename: 'fixture.pdf', contentType });

      await request(app).post(base).expect(401);
      await send(outsideTenant.token).expect(404);
      await send(outsideProject.token).expect(403);
      await send(member.token, Buffer.from('invalid')).expect(422);
      await send(member.token, Buffer.alloc(MAX_ATTACHMENT_BYTES + 1)).expect(413);
      await request(app).post(base).auth(member.token, { type: 'bearer' }).send({}).expect(400);
      expect(storage.put).not.toHaveBeenCalled();

      const maxFile = Buffer.alloc(MAX_ATTACHMENT_BYTES);
      maxFile.write('%PDF-1.7');
      const uploaded = await send(member.token, maxFile).expect(201);
      expect(uploaded.body.data).toMatchObject({
        taskId: task.id,
        uploaderId: member.id,
        filename: 'fixture.pdf',
        sizeBytes: MAX_ATTACHMENT_BYTES,
      });
      expect(uploaded.body.data).not.toHaveProperty('objectKey');
      const attachmentId = uploaded.body.data.id as string;
      const row = await prisma.attachment.findUniqueOrThrow({ where: { id: attachmentId } });
      expect(objects.get(row.objectKey)?.byteLength).toBe(MAX_ATTACHMENT_BYTES);

      const list = await request(app).get(base).auth(member.token, { type: 'bearer' }).expect(200);
      expect(list.body.data).toEqual([uploaded.body.data]);
      await request(app).get(base).auth(outsideTenant.token, { type: 'bearer' }).expect(404);
      await request(app).get(base).auth(outsideProject.token, { type: 'bearer' }).expect(403);
      const download = `/api/v1/attachments/${attachmentId}/download`;
      await request(app).get(download).auth(outsideTenant.token, { type: 'bearer' }).expect(404);
      await request(app).get(download).auth(outsideProject.token, { type: 'bearer' }).expect(403);
      expect(storage.signDownload).not.toHaveBeenCalled();
      const signed = await request(app)
        .get(download)
        .auth(member.token, { type: 'bearer' })
        .expect(200);
      expect(signed.headers['cache-control']).toBe('no-store');
      expect(signed.body.data).toEqual({
        url: 'https://storage.example.test/signed',
        expiresIn: 300,
      });
      expect(storage.signDownload).toHaveBeenCalledExactlyOnceWith(
        row.objectKey,
        row.filename,
        300,
      );

      storage.put.mockImplementationOnce(async (key, content) => {
        objects.set(key, content);
        await prisma.project.update({ where: { id: project.id }, data: { status: 'ARCHIVED' } });
      });
      await send(member.token).expect(409);
      expect(storage.delete).toHaveBeenCalledOnce();
      expect(objects.size).toBe(1);
      expect(await prisma.attachment.count({ where: { taskId: task.id } })).toBe(1);
      await request(app).get(download).auth(member.token, { type: 'bearer' }).expect(200);
    } finally {
      try {
        if (projectId) {
          await prisma.$transaction([
            prisma.attachment.deleteMany({ where: { task: { projectId } } }),
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
