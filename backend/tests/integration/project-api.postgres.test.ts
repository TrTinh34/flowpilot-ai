import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

describe.skipIf(!process.env['TEST_DATABASE_URL'])('workspace project API on PostgreSQL', () => {
  let db: typeof import('../../src/config/prisma.js');
  let app: typeof import('../../src/app.js').app;
  const workspaceIds: string[] = [];
  const userIds: string[] = [];
  type Actor = { id: string; header: string };

  beforeAll(async () => {
    await confirmTestDatabase();
    db = await import('../../src/config/prisma.js');
    app = (await import('../../src/app.js')).app;
  });

  afterAll(async () => {
    if (!db) return;
    try {
      await db.prisma.$transaction([
        db.prisma.auditLog.deleteMany({ where: { workspaceId: { in: workspaceIds } } }),
        db.prisma.task.deleteMany({ where: { project: { workspaceId: { in: workspaceIds } } } }),
        db.prisma.projectMember.deleteMany({
          where: { project: { workspaceId: { in: workspaceIds } } },
        }),
        db.prisma.project.deleteMany({ where: { workspaceId: { in: workspaceIds } } }),
        db.prisma.workspaceMember.deleteMany({ where: { workspaceId: { in: workspaceIds } } }),
        db.prisma.workspace.deleteMany({ where: { id: { in: workspaceIds } } }),
        db.prisma.user.deleteMany({ where: { id: { in: userIds } } }),
      ]);
    } finally {
      await db.disconnectDatabase();
    }
  });

  async function actor(): Promise<Actor> {
    const { accessTokenIssuer } = await import('../../src/modules/auth/index.js');
    const user = await db.prisma.user.create({
      data: {
        email: `${randomUUID()}@example.test`,
        passwordHash: 'fixture-hash',
        displayName: 'Fixture',
      },
    });
    userIds.push(user.id);
    return { id: user.id, header: `Bearer ${await accessTokenIssuer.issueAccessToken(user.id)}` };
  }

  it('scopes listing, mutation and archived project membership to the workspace and role', async () => {
    const [owner, manager, member, outsider] = await Promise.all([
      actor(),
      actor(),
      actor(),
      actor(),
    ]);
    const workspace = await db.prisma.workspace.create({
      data: {
        name: 'Project API fixture',
        members: {
          create: [
            { userId: owner.id, role: 'OWNER' },
            { userId: manager.id, role: 'MEMBER' },
            { userId: member.id, role: 'MEMBER' },
          ],
        },
      },
    });
    workspaceIds.push(workspace.id);
    const collection = `/api/v1/workspaces/${workspace.id}/projects`;
    const create = (actor: Actor, managerId: string) =>
      request(app)
        .post(collection)
        .set('Authorization', actor.header)
        .send({ name: 'Roadmap', managerId });
    expect((await create(manager, manager.id)).status).toBe(403);
    expect((await create(owner, outsider.id)).status).toBe(404);
    const created = await create(owner, manager.id);
    expect(created.status).toBe(201);
    expect(created.body.data).toMatchObject({ workspaceId: workspace.id, status: 'ACTIVE' });
    const projectId: string = created.body.data.id;
    const project = `/api/v1/projects/${projectId}`;
    const members = `${project}/members`;
    const list = (actor: Actor) => request(app).get(collection).set('Authorization', actor.header);
    expect((await list(outsider)).status).toBe(404);
    expect((await list(member)).body.data).toEqual([]);
    expect((await list(manager)).body.data[0].id).toBe(projectId);

    const add = (actor: Actor, userId: string, role = 'MEMBER') =>
      request(app).post(members).set('Authorization', actor.header).send({ userId, role });
    expect((await add(manager, outsider.id)).status).toBe(404);
    expect((await add(manager, member.id, 'MANAGER')).status).toBe(403);
    expect((await add(manager, member.id)).status).toBe(201);
    expect((await add(manager, member.id)).status).toBe(409);
    const directory = await request(app).get(members).set('Authorization', member.header);
    expect(directory.status).toBe(200);
    expect(directory.body).toMatchObject({ canManage: false, canAssignManager: false });
    expect(directory.body.data).toContainEqual({
      userId: manager.id,
      role: 'MANAGER',
      user: { displayName: 'Fixture' },
    });

    const update = (actor: Actor, status: 'ACTIVE' | 'ARCHIVED') =>
      request(app)
        .patch(project)
        .set('Authorization', actor.header)
        .send({ name: 'Roadmap', status });
    expect((await update(outsider, 'ACTIVE')).status).toBe(404);
    expect((await update(member, 'ACTIVE')).status).toBe(403);
    expect((await update(manager, 'ARCHIVED')).status).toBe(200);
    expect((await update(owner, 'ACTIVE')).status).toBe(409);
    expect((await add(owner, member.id)).status).toBe(409);
    expect((await request(app).get(members).set('Authorization', manager.header)).status).toBe(200);

    const assigned = await db.prisma.task.create({
      data: {
        projectId,
        assigneeId: member.id,
        title: 'Assigned fixture',
        description: '',
        priority: 'LOW',
        position: 0,
      },
    });
    const blockedRemoval = await request(app)
      .delete(`/api/v1/workspaces/${workspace.id}/members/${member.id}`)
      .set('Authorization', owner.header);
    expect(blockedRemoval.status).toBe(409);
    expect(blockedRemoval.body.code).toBe('WORKSPACE_MEMBER_HAS_TASKS');
    await db.prisma.task.update({ where: { id: assigned.id }, data: { assigneeId: null } });
    const removal = await request(app)
      .delete(`/api/v1/workspaces/${workspace.id}/members/${member.id}`)
      .set('Authorization', owner.header);
    expect(removal.status).toBe(204);
    expect(await db.prisma.projectMember.count({ where: { projectId, userId: member.id } })).toBe(
      0,
    );
    expect((await request(app).get(members).set('Authorization', member.header)).status).toBe(404);
  });
});
