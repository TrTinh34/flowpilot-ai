import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

it.skipIf(!process.env['TEST_DATABASE_URL'])(
  'enforces task defaults and project-scoped relations',
  async () => {
    await confirmTestDatabase();
    const db = new Client({ connectionString: process.env['DATABASE_URL'] });
    await db.connect();

    async function rejects(
      query: string,
      values: (string | number | null)[],
      code: string,
      constraint: string,
    ) {
      await db.query('SAVEPOINT task_probe');
      try {
        await expect(db.query(query, values)).rejects.toMatchObject({ code, constraint });
      } finally {
        await db.query('ROLLBACK TO SAVEPOINT task_probe');
        await db.query('RELEASE SAVEPOINT task_probe');
      }
    }

    try {
      await db.query('BEGIN');
      const [workspace, project, otherProject, user, parent, child] = Array.from(
        { length: 6 },
        () => randomUUID(),
      );
      await db.query("INSERT INTO workspaces (id,name,updated_at) VALUES ($1,'Fixture',now())", [
        workspace,
      ]);
      await db.query(
        "INSERT INTO projects (id,workspace_id,name,updated_at) VALUES ($1,$3,'Fixture',now()),($2,$3,'Other',now())",
        [project, otherProject, workspace],
      );
      await db.query(
        "INSERT INTO users (id,email,password_hash,display_name,updated_at) VALUES ($1,$2,'fixture','Fixture',now())",
        [user, `${user}@example.test`],
      );
      await db.query(
        "INSERT INTO workspace_members (id,workspace_id,user_id,role,updated_at) VALUES ($1,$2,$3,'MEMBER',now())",
        [randomUUID(), workspace, user],
      );
      await db.query(
        "INSERT INTO project_members (id,project_id,user_id,role,updated_at) VALUES ($1,$2,$3,'MEMBER',now())",
        [randomUUID(), project, user],
      );
      const insert = `INSERT INTO tasks (id,project_id,parent_id,assignee_id,title,description,priority,position,updated_at)
      VALUES ($1,$2,$3,$4,'Fixture','','LOW',0,now()) RETURNING status, version`;
      const root = await db.query(insert, [parent, project, null, null]);
      expect(root.rows).toEqual([{ status: 'TODO', version: 0 }]);
      await db.query(insert, [child, project, parent, user]);
      await rejects(
        insert,
        [randomUUID(), otherProject, parent, null],
        '23503',
        'tasks_project_id_parent_id_fkey',
      );
      await rejects(
        insert,
        [randomUUID(), otherProject, null, user],
        '23503',
        'tasks_project_id_assignee_id_fkey',
      );
      const self = randomUUID();
      await rejects(insert, [self, project, self, null], '23514', 'tasks_parent_not_self');
      await rejects(
        'UPDATE tasks SET version=-1 WHERE id=$1',
        [child],
        '23514',
        'tasks_version_non_negative',
      );
      await rejects(
        'DELETE FROM project_members WHERE project_id=$1 AND user_id=$2',
        [project, user],
        '23503',
        'tasks_project_id_assignee_id_fkey',
      );
    } finally {
      try {
        await db.query('ROLLBACK');
      } finally {
        await db.end();
      }
    }
  },
);
