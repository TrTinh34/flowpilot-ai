import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import request from 'supertest';
import { expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

it.skipIf(!process.env['TEST_DATABASE_URL'])(
  'enforces audit_logs constraints and records atomic audit entries on project and task mutations',
  async () => {
    await confirmTestDatabase();
    const db = new Client({ connectionString: process.env['DATABASE_URL'] });
    await db.connect();

    async function rejects(
      sql: string,
      values: (string | null)[],
      code: string,
      constraint: string,
    ) {
      await db.query('SAVEPOINT audit_probe');
      try {
        await expect(db.query(sql, values)).rejects.toMatchObject({ code, constraint });
      } finally {
        await db.query('ROLLBACK TO SAVEPOINT audit_probe');
        await db.query('RELEASE SAVEPOINT audit_probe');
      }
    }

    try {
      await db.query('BEGIN');
      const workspace = randomUUID();
      const actor = randomUUID();
      const missing = randomUUID();
      await db.query("INSERT INTO workspaces (id,name,updated_at) VALUES ($1,'Fixture',now())", [
        workspace,
      ]);
      await db.query(
        "INSERT INTO users (id,email,password_hash,display_name,updated_at) VALUES ($1,$2,'fixture','Actor',now())",
        [actor, `${actor}@example.test`],
      );

      const insert = `INSERT INTO audit_logs (id,workspace_id,project_id,actor_id,action,target_type,target_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING metadata, created_at`;
      const ok = await db.query(insert, [
        randomUUID(),
        workspace,
        null,
        actor,
        'PROJECT_CREATED',
        'PROJECT',
        randomUUID(),
      ]);
      expect(ok.rows).toEqual([{ metadata: {}, created_at: expect.any(Date) }]);

      await rejects(
        insert,
        [randomUUID(), missing, null, actor, 'PROJECT_CREATED', 'PROJECT', randomUUID()],
        '23503',
        'audit_logs_workspace_id_fkey',
      );
      await rejects(
        insert,
        [randomUUID(), workspace, missing, actor, 'PROJECT_CREATED', 'PROJECT', randomUUID()],
        '23503',
        'audit_logs_project_id_fkey',
      );
      await rejects(
        insert,
        [randomUUID(), workspace, null, missing, 'PROJECT_CREATED', 'PROJECT', randomUUID()],
        '23503',
        'audit_logs_actor_id_fkey',
      );
      await rejects(
        insert,
        [randomUUID(), workspace, null, actor, '   ', 'PROJECT', randomUUID()],
        '23514',
        'audit_logs_action_not_blank',
      );
      await rejects(
        insert,
        [randomUUID(), workspace, null, actor, 'PROJECT_CREATED', '\t\n', randomUUID()],
        '23514',
        'audit_logs_target_type_not_blank',
      );
    } finally {
      await db.query('ROLLBACK');
      await db.query('COMMIT');
      await db.end();
    }

    // Verify transactional audit creation via real API routes and rollback on conflict
    const { prisma, disconnectDatabase } = await import('../../src/config/prisma.js');
    const { accessTokenIssuer } = await import('../../src/modules/auth/index.js');
    const { createApp } = await import('../../src/app.js');
    const app = createApp();
    const fixtureId = randomUUID();
    const userIds: string[] = [];
    let workspaceId: string | undefined;

    try {
      const owner = await prisma.user.create({
        data: {
          email: `owner.${fixtureId}@example.test`,
          displayName: 'Audit Owner',
          passwordHash: 'fixture',
        },
      });
      userIds.push(owner.id);
      const token = await accessTokenIssuer.issueAccessToken(owner.id);

      const wsRes = await request(app)
        .post('/api/v1/workspaces')
        .auth(token, { type: 'bearer' })
        .send({ name: `Audit WS ${fixtureId}` })
        .expect(201);
      workspaceId = wsRes.body.data.id as string;

      const projRes = await request(app)
        .post(`/api/v1/workspaces/${workspaceId}/projects`)
        .auth(token, { type: 'bearer' })
        .send({ name: 'Audit Proj', managerId: owner.id })
        .expect(201);
      const projectId = projRes.body.data.id as string;

      const taskRes = await request(app)
        .post(`/api/v1/projects/${projectId}/tasks`)
        .auth(token, { type: 'bearer' })
        .send({ title: 'Audit Task', description: '', priority: 'HIGH' })
        .expect(201);
      const taskId = taskRes.body.data.id as string;

      // Conflicting move must fail with 409 and write zero TASK_MOVED audit rows
      await request(app)
        .patch(`/api/v1/tasks/${taskId}/move`)
        .auth(token, { type: 'bearer' })
        .send({ status: 'DONE', position: 0, version: 99 })
        .expect(409);

      await request(app)
        .patch(`/api/v1/tasks/${taskId}/move`)
        .auth(token, { type: 'bearer' })
        .send({ status: 'IN_PROGRESS', position: 0, version: 0 })
        .expect(200);

      const logs = await prisma.auditLog.findMany({
        where: { projectId },
        orderBy: [{ createdAt: 'asc' }],
      });
      expect(logs.map((l) => l.action)).toEqual(['PROJECT_CREATED', 'TASK_CREATED', 'TASK_MOVED']);
    } finally {
      if (workspaceId) {
        await prisma.auditLog.deleteMany({ where: { workspaceId } });
        await prisma.task.deleteMany({ where: { project: { workspaceId } } });
        await prisma.projectMember.deleteMany({ where: { project: { workspaceId } } });
        await prisma.project.deleteMany({ where: { workspaceId } });
        await prisma.workspaceMember.deleteMany({ where: { workspaceId } });
        await prisma.workspace.deleteMany({ where: { id: workspaceId } });
      }
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      await disconnectDatabase();
    }
  },
);
