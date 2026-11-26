import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

describe.skipIf(!process.env['TEST_DATABASE_URL'])('workspace API on PostgreSQL', () => {
  let db: typeof import('../../src/config/prisma.js');
  let app: typeof import('../../src/app.js').app;
  const actorIds: string[] = [];
  const workspaceIds: string[] = [];
  let owner: Actor;
  let admin: Actor;
  let member: Actor;
  let outsider: Actor;
  type Actor = { id: string; token: string };

  async function fixture(): Promise<Actor> {
    const { issueAccessToken } = await import('../../src/modules/auth/auth.tokens.js');
    const user = await db.prisma.user.create({
      data: {
        email: `${randomUUID()}@example.test`,
        passwordHash: 'fixture-hash',
        displayName: 'Fixture',
      },
    });
    actorIds.push(user.id);
    return { id: user.id, token: await issueAccessToken(user.id) };
  }

  beforeAll(async () => {
    await confirmTestDatabase();
    db = await import('../../src/config/prisma.js');
    app = (await import('../../src/app.js')).app;

    owner = await fixture();
    admin = await fixture();
    member = await fixture();
    outsider = await fixture();
  });

  afterAll(async () => {
    if (!db) return;
    try {
      await db.prisma.$transaction([
        db.prisma.invitation.deleteMany({ where: { workspaceId: { in: workspaceIds } } }),
        db.prisma.workspaceMember.deleteMany({ where: { workspaceId: { in: workspaceIds } } }),
        db.prisma.workspace.deleteMany({ where: { id: { in: workspaceIds } } }),
        db.prisma.user.deleteMany({ where: { id: { in: actorIds } } }),
      ]);
    } finally {
      await db.disconnectDatabase();
    }
  });

  const path = '/api/v1/workspaces';
  const bearer = (actor: Actor) => `Bearer ${actor.token}`;

  it('issues an invitation and only the matching account accepts it once', async () => {
    const workspaceId = await create(owner);
    const email = (await db.prisma.user.findUniqueOrThrow({ where: { id: member.id } })).email;
    const invite = (actor: Actor) =>
      request(app)
        .post(`${path}/${workspaceId}/invitations`)
        .set('Authorization', bearer(actor))
        .send({ email: email.toUpperCase(), role: 'MEMBER' });
    expect((await invite(outsider)).status).toBe(404);
    const issued = await invite(owner);
    expect(issued.status).toBe(201);
    expect(issued.body.data).toMatchObject({ email, status: 'PENDING' });
    expect((await invite(owner)).status).toBe(409);
    const token = new URLSearchParams(new URL(issued.body.data.previewUrl).hash.slice(1)).get(
      'token',
    );
    expect(token).toBeTruthy();
    const accept = (actor: Actor) =>
      request(app)
        .post('/api/v1/invitations/accept')
        .set('Authorization', bearer(actor))
        .send({ token });
    expect((await accept(outsider)).status).toBe(403);
    const accepted = await Promise.all([accept(member), accept(member)]);
    expect(accepted.map((r) => r.status).sort()).toEqual([200, 422]);
    expect(
      await db.prisma.workspaceMember.count({ where: { workspaceId, userId: member.id } }),
    ).toBe(1);
    const stored = await db.prisma.invitation.findUniqueOrThrow({
      where: { id: issued.body.data.id },
    });
    expect(stored.status).toBe('ACCEPTED');
    expect(stored.tokenHash).not.toBe(token);
    expect(stored.expiresAt.getTime() - stored.createdAt.getTime()).toBeGreaterThan(172_790_000);
    const otherEmail = (await db.prisma.user.findUniqueOrThrow({ where: { id: outsider.id } }))
      .email;
    const second = await request(app)
      .post(`${path}/${workspaceId}/invitations`)
      .set('Authorization', bearer(owner))
      .send({ email: otherEmail, role: 'MEMBER' });
    expect(second.status).toBe(201);
    await db.prisma.invitation.update({
      where: { id: second.body.data.id },
      data: { expiresAt: new Date(0) },
    });
    const expiredToken = new URLSearchParams(
      new URL(second.body.data.previewUrl).hash.slice(1),
    ).get('token');
    const expired = await request(app)
      .post('/api/v1/invitations/accept')
      .set('Authorization', bearer(outsider))
      .send({ token: expiredToken });
    expect(expired.status).toBe(422);
    expect(
      await db.prisma.workspaceMember.count({ where: { workspaceId, userId: outsider.id } }),
    ).toBe(0);
  });

  async function create(actor: Actor) {
    const name = `Workspace ${randomUUID()}`;
    const response = await request(app)
      .post(path)
      .set('Authorization', bearer(actor))
      .send({ name: ` ${name} ` });
    expect(response.status).toBe(201);
    const id: string = response.body.data.id;
    workspaceIds.push(id);
    expect(response.body.data).toMatchObject({ id, name, role: 'OWNER' });
    return id;
  }

  async function add(workspaceId: string, userId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER') {
    await db.prisma.workspaceMember.create({ data: { workspaceId, userId, role } });
  }

  it('requires a Bearer token, creates the Owner membership and lists only actor workspaces with pagination', async () => {
    const owner = await fixture();
    expect((await request(app).get(path)).status).toBe(401);
    const first = await create(owner);
    const second = await create(owner);
    const outside = await create(outsider);
    expect(
      (
        await db.prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId: first, userId: owner.id } },
        })
      )?.role,
    ).toBe('OWNER');
    const pages = await Promise.all(
      [0, 1].map((page) =>
        request(app).get(path).query({ page, size: 1 }).set('Authorization', bearer(owner)),
      ),
    );
    for (const [index, page] of pages.entries()) {
      expect(page.status).toBe(200);
      expect(page.body).toMatchObject({ page: index, size: 1 });
      expect(page.body.data).toHaveLength(1);
    }
    const ids = pages.map((page) => page.body.data[0].id);
    expect(ids.sort()).toEqual([first, second].sort());
    expect(ids).not.toContain(outside);
    expect(
      (await request(app).get(path).query({ size: 0 }).set('Authorization', bearer(owner))).status,
    ).toBe(400);
    expect(
      (await request(app).post(path).set('Authorization', bearer(owner)).send({ name: '  ' }))
        .status,
    ).toBe(400);
  });

  it('isolates other tenants and checks the current role for member changes and transfer', async () => {
    const id = await create(owner);
    await add(id, admin.id, 'ADMIN');
    await add(id, member.id, 'MEMBER');
    const memberPath = `${path}/${id}/members/${member.id}`;
    const transferPath = `${path}/${id}/transfer`;
    expect(
      (
        await request(app)
          .patch(memberPath)
          .set('Authorization', bearer(outsider))
          .send({ role: 'ADMIN' })
      ).status,
    ).toBe(404);
    expect(
      (
        await request(app)
          .patch(memberPath)
          .set('Authorization', bearer(member))
          .send({ role: 'ADMIN' })
      ).status,
    ).toBe(403);
    expect(
      (
        await request(app)
          .post(transferPath)
          .set('Authorization', bearer(admin))
          .send({ userId: member.id })
      ).status,
    ).toBe(403);
    const promoted = await request(app)
      .patch(memberPath)
      .set('Authorization', bearer(admin))
      .send({ role: 'ADMIN' });
    expect(promoted.status).toBe(200);
    expect(promoted.body.data).toMatchObject({ userId: member.id, role: 'ADMIN' });
    expect(
      (
        await request(app)
          .delete(`${path}/${id}/members/${admin.id}`)
          .set('Authorization', bearer(member))
      ).status,
    ).toBe(204);
    expect(
      (
        await request(app)
          .patch(memberPath)
          .set('Authorization', bearer(admin))
          .send({ role: 'MEMBER' })
      ).status,
    ).toBe(404);
  });

  it('protects the last Owner and transfers ownership without changing other workspaces', async () => {
    const id = await create(owner);
    await add(id, member.id, 'MEMBER');
    const ownerPath = `${path}/${id}/members/${owner.id}`;
    expect((await request(app).delete(ownerPath).set('Authorization', bearer(owner))).status).toBe(
      409,
    );
    expect(
      (
        await request(app)
          .patch(ownerPath)
          .set('Authorization', bearer(owner))
          .send({ role: 'MEMBER' })
      ).status,
    ).toBe(409);
    expect(
      (
        await request(app)
          .patch(`${path}/${id}/members/${member.id}`)
          .set('Authorization', bearer(owner))
          .send({ role: 'OWNER' })
      ).status,
    ).toBe(400);
    const transferred = await request(app)
      .post(`${path}/${id}/transfer`)
      .set('Authorization', bearer(owner))
      .send({ userId: member.id });
    expect(transferred.status).toBe(200);
    expect(transferred.body.data).toMatchObject({ userId: member.id, role: 'OWNER' });
    const roles = await db.prisma.workspaceMember.findMany({
      where: { workspaceId: id },
      select: { userId: true, role: true },
    });
    expect(roles).toEqual(
      expect.arrayContaining([
        { userId: owner.id, role: 'ADMIN' },
        { userId: member.id, role: 'OWNER' },
      ]),
    );
    expect(
      (
        await request(app)
          .delete(`${path}/${id}/members/${member.id}`)
          .set('Authorization', bearer(owner))
      ).status,
    ).toBe(403);
  });

  it('serializes concurrent departures so the workspace retains an Owner', async () => {
    const id = await create(owner);
    await add(id, admin.id, 'OWNER');
    const results = await Promise.all(
      [owner, admin].map((actor) =>
        request(app)
          .delete(`${path}/${id}/members/${actor.id}`)
          .set('Authorization', bearer(actor)),
      ),
    );
    expect(results.map((result) => result.status).sort()).toEqual([204, 409]);
    expect(
      await db.prisma.workspaceMember.count({ where: { workspaceId: id, role: 'OWNER' } }),
    ).toBe(1);
  });
});
