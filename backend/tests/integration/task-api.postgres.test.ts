import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

const testDatabaseUrl = process.env['TEST_DATABASE_URL'];

describe.skipIf(!testDatabaseUrl)('task and My Tasks API on PostgreSQL', () => {
  let app: ReturnType<typeof import('../../src/app.js').createApp>;
  let db: typeof import('../../src/config/prisma.js');
  const userIds: string[] = [];
  const workspaceIds: string[] = [];

  type Actor = { id: string; header: string };
  let owner: Actor;
  let manager: Actor;
  let member: Actor;
  let outsider: Actor;
  let projectId: string;
  let archivedProjectId: string;

  async function createActor(): Promise<Actor> {
    const { accessTokenIssuer } = await import('../../src/modules/auth/index.js');
    const user = await db.prisma.user.create({
      data: {
        email: `${randomUUID()}@example.test`,
        passwordHash: 'fixture-hash',
        displayName: 'Task Fixture User',
      },
    });
    userIds.push(user.id);
    return { id: user.id, header: `Bearer ${await accessTokenIssuer.issueAccessToken(user.id)}` };
  }

  beforeAll(async () => {
    await confirmTestDatabase();
    db = await import('../../src/config/prisma.js');
    app = (await import('../../src/app.js')).createApp();

    owner = await createActor();
    manager = await createActor();
    member = await createActor();
    outsider = await createActor();

    const ws = await db.prisma.workspace.create({
      data: {
        name: 'Task Test Workspace',
        members: {
          create: [
            { userId: owner.id, role: 'OWNER' },
            { userId: manager.id, role: 'MEMBER' },
            { userId: member.id, role: 'MEMBER' },
          ],
        },
      },
    });
    workspaceIds.push(ws.id);

    const activeProject = await db.prisma.project.create({
      data: {
        workspaceId: ws.id,
        name: 'Active Task Project',
        status: 'ACTIVE',
        members: {
          create: [
            { userId: manager.id, role: 'MANAGER' },
            { userId: member.id, role: 'MEMBER' },
          ],
        },
      },
    });
    projectId = activeProject.id;

    const archivedProject = await db.prisma.project.create({
      data: {
        workspaceId: ws.id,
        name: 'Archived Task Project',
        status: 'ARCHIVED',
        members: {
          create: [{ userId: manager.id, role: 'MANAGER' }],
        },
      },
    });
    archivedProjectId = archivedProject.id;
  });

  afterAll(async () => {
    try {
      await db.prisma.$transaction([
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

  it('creates tasks, 1-level subtasks, enforces assignee/RBAC/archived/version rules, and serves My Tasks', async () => {
    // Member cannot create task -> 403
    const memberCreate = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', member.header)
      .send({ title: 'Unauthorized', description: 'Nope', priority: 'LOW' });
    expect(memberCreate.status).toBe(403);

    // Outsider gets 404 (tenant isolation)
    const outsiderGet = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', outsider.header);
    expect(outsiderGet.status).toBe(404);

    // Non-project-member assignee rejected with 422
    const invalidAssignee = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', manager.header)
      .send({
        title: 'Invalid Assignee',
        description: 'Desc',
        priority: 'MEDIUM',
        assigneeId: outsider.id,
      });
    expect(invalidAssignee.status).toBe(422);

    // Manager creates parent task assigned to member
    const createParent = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', manager.header)
      .send({
        title: 'Parent Task',
        description: 'Main work',
        priority: 'HIGH',
        assigneeId: member.id,
        dueDate: '2026-12-15',
      });
    expect(createParent.status).toBe(201);
    const parentTask = createParent.body.data;
    expect(parentTask).toMatchObject({
      projectId,
      parentId: null,
      assigneeId: member.id,
      title: 'Parent Task',
      status: 'TODO',
      priority: 'HIGH',
      version: 0,
    });

    // Manager creates 1-level subtask
    const createSubtask = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', manager.header)
      .send({
        title: 'Subtask 1',
        description: 'Child work',
        priority: 'MEDIUM',
        parentId: parentTask.id,
      });
    expect(createSubtask.status).toBe(201);
    const subtask = createSubtask.body.data;
    expect(subtask.parentId).toBe(parentTask.id);

    // Nested 2nd-level subtask rejected -> 422
    const nestedSubtask = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', manager.header)
      .send({
        title: 'Nested Subtask',
        description: 'Too deep',
        priority: 'LOW',
        parentId: subtask.id,
      });
    expect(nestedSubtask.status).toBe(422);

    // List project tasks
    const listRes = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks?page=0&size=20`)
      .set('Authorization', member.header);
    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(2);

    // Get task detail includes subtasks
    const detailRes = await request(app)
      .get(`/api/v1/tasks/${parentTask.id}`)
      .set('Authorization', member.header);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.data.subtasks).toHaveLength(1);
    expect(detailRes.body.data.subtasks[0].id).toBe(subtask.id);

    // Update task increments version
    const updateRes = await request(app)
      .patch(`/api/v1/tasks/${parentTask.id}`)
      .set('Authorization', owner.header)
      .send({ version: 0, title: 'Parent Task Updated', priority: 'URGENT' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data).toMatchObject({
      id: parentTask.id,
      title: 'Parent Task Updated',
      priority: 'URGENT',
      version: 1,
    });

    // Stale version update -> 409 Conflict
    const staleUpdate = await request(app)
      .patch(`/api/v1/tasks/${parentTask.id}`)
      .set('Authorization', manager.header)
      .send({ version: 0, title: 'Stale Write' });
    expect(staleUpdate.status).toBe(409);
    expect(staleUpdate.body.code).toBe('TASK_VERSION_CONFLICT');

    // Archived project is read-only -> 409 PROJECT_ARCHIVED
    const archivedWrite = await request(app)
      .post(`/api/v1/projects/${archivedProjectId}/tasks`)
      .set('Authorization', manager.header)
      .send({ title: 'Archived Task', description: 'Nope', priority: 'LOW' });
    expect(archivedWrite.status).toBe(409);
    expect(archivedWrite.body.code).toBe('PROJECT_ARCHIVED');

    // My Tasks returns only tasks assigned to the actor
    const memberMyTasks = await request(app)
      .get('/api/v1/me/tasks')
      .set('Authorization', member.header);
    expect(memberMyTasks.status).toBe(200);
    expect(memberMyTasks.body.data).toHaveLength(1);
    expect(memberMyTasks.body.data[0].id).toBe(parentTask.id);

    const managerMyTasks = await request(app)
      .get('/api/v1/me/tasks')
      .set('Authorization', manager.header);
    expect(managerMyTasks.status).toBe(200);
    expect(managerMyTasks.body.data).toHaveLength(0);
  });
});
