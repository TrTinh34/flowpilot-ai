import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

it.skipIf(!process.env['TEST_DATABASE_URL'])(
  'enforces project schema constraints on PostgreSQL',
  async () => {
    await confirmTestDatabase();
    const db = new Client({ connectionString: process.env['DATABASE_URL'] });
    await db.connect();
    try {
      await db.query('BEGIN');
      const workspaceId = randomUUID();
      const projectId = randomUUID();
      const userId = randomUUID();
      await db.query('INSERT INTO workspaces (id,name,updated_at) VALUES ($1,$2,now())', [
        workspaceId,
        'Project fixture',
      ]);
      const project = await db.query(
        'INSERT INTO projects (id,workspace_id,name,updated_at) VALUES ($1,$2,$3,now()) RETURNING status',
        [projectId, workspaceId, 'Project fixture'],
      );
      expect(project.rows).toEqual([{ status: 'ACTIVE' }]);
      await db.query(
        'INSERT INTO users (id,email,password_hash,display_name,updated_at) VALUES ($1,$2,$3,$4,now())',
        [userId, `${userId}@example.test`, 'fixture-hash', 'Fixture'],
      );
      await db.query(
        "INSERT INTO workspace_members (id,workspace_id,user_id,role,updated_at) VALUES ($1,$2,$3,'MEMBER',now())",
        [randomUUID(), workspaceId, userId],
      );
      const insertMember =
        "INSERT INTO project_members (id,project_id,user_id,role,updated_at) VALUES ($1,$2,$3,'MANAGER',now())";
      await db.query(insertMember, [randomUUID(), projectId, userId]);
      const indexes = await db.query<{ indexname: string }>(
        "SELECT indexname FROM pg_indexes WHERE schemaname='public' AND tablename IN ('projects','project_members')",
      );
      expect(indexes.rows.map((row) => row.indexname)).toEqual(
        expect.arrayContaining([
          'projects_workspace_id_status_idx',
          'project_members_project_id_user_id_key',
        ]),
      );
      await db.query('SAVEPOINT probe');
      await expect(db.query(insertMember, [randomUUID(), projectId, userId])).rejects.toMatchObject(
        {
          code: '23505',
          constraint: 'project_members_project_id_user_id_key',
        },
      );
      await db.query('ROLLBACK TO SAVEPOINT probe');
      await expect(
        db.query('DELETE FROM workspaces WHERE id=$1', [workspaceId]),
      ).rejects.toMatchObject({
        code: '23503',
      });
    } finally {
      try {
        await db.query('ROLLBACK');
      } finally {
        await db.end();
      }
    }
  },
);
