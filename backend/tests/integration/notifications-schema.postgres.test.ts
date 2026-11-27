import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

it.skipIf(!process.env['TEST_DATABASE_URL'])(
  'enforces notification references, non-blank messages, and outbox idempotency',
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
      await db.query('SAVEPOINT notification_probe');
      try {
        await expect(db.query(sql, values)).rejects.toMatchObject({ code, constraint });
      } finally {
        await db.query('ROLLBACK TO SAVEPOINT notification_probe');
        await db.query('RELEASE SAVEPOINT notification_probe');
      }
    }

    try {
      await db.query('BEGIN');
      const workspace = randomUUID();
      const project = randomUUID();
      const task = randomUUID();
      const userA = randomUUID();
      const userB = randomUUID();
      const outboxId = randomUUID();
      const missing = randomUUID();

      await db.query("INSERT INTO workspaces (id,name,updated_at) VALUES ($1,'Fixture',now())", [
        workspace,
      ]);
      await db.query(
        "INSERT INTO projects (id,workspace_id,name,updated_at) VALUES ($1,$2,'Fixture',now())",
        [project, workspace],
      );
      await db.query(
        "INSERT INTO users (id,email,password_hash,display_name,updated_at) VALUES ($1,$2,'fixture','User A',now()),($3,$4,'fixture','User B',now())",
        [userA, `${userA}@example.test`, userB, `${userB}@example.test`],
      );
      await db.query(
        "INSERT INTO tasks (id,project_id,title,description,priority,position,updated_at) VALUES ($1,$2,'Fixture','','LOW',0,now())",
        [task, project],
      );
      await db.query(
        "INSERT INTO outbox_events (id,event_type,payload,updated_at) VALUES ($1,'COMMENT_MENTIONED','{}'::jsonb,now())",
        [outboxId],
      );

      const insert = `INSERT INTO notifications (id,user_id,project_id,task_id,outbox_event_id,type,message)
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING read_at, created_at`;

      const first = await db.query(insert, [
        randomUUID(),
        userA,
        project,
        task,
        outboxId,
        'TASK_MENTION',
        'Mentioned you in a comment',
      ]);
      expect(first.rows).toEqual([{ read_at: null, created_at: expect.any(Date) }]);

      // Same outbox event can target a different recipient, and direct notifications (null outbox) allow multiples.
      await db.query(insert, [
        randomUUID(),
        userB,
        project,
        task,
        outboxId,
        'TASK_MENTION',
        'Mentioned you in a comment',
      ]);
      await db.query(insert, [
        randomUUID(),
        userA,
        null,
        null,
        null,
        'INVITATION',
        'Workspace invite 1',
      ]);
      await db.query(insert, [
        randomUUID(),
        userA,
        null,
        null,
        null,
        'INVITATION',
        'Workspace invite 2',
      ]);

      await rejects(
        insert,
        [randomUUID(), userA, project, task, outboxId, 'TASK_MENTION', 'Duplicate retry'],
        '23505',
        'notifications_outbox_event_id_user_id_key',
      );
      await rejects(
        insert,
        [randomUUID(), missing, project, task, null, 'TASK_ASSIGNED', 'Assigned'],
        '23503',
        'notifications_user_id_fkey',
      );
      await rejects(
        insert,
        [randomUUID(), userA, missing, task, null, 'TASK_ASSIGNED', 'Assigned'],
        '23503',
        'notifications_project_id_fkey',
      );
      await rejects(
        insert,
        [randomUUID(), userA, project, missing, null, 'TASK_ASSIGNED', 'Assigned'],
        '23503',
        'notifications_task_id_fkey',
      );
      await rejects(
        insert,
        [randomUUID(), userA, project, task, missing, 'TASK_MENTION', 'Missing outbox'],
        '23503',
        'notifications_outbox_event_id_fkey',
      );
      await rejects(
        insert,
        [randomUUID(), userA, project, task, null, 'TASK_COMMENT', ' \t\n'],
        '23514',
        'notifications_message_not_blank',
      );
    } finally {
      await db.query('ROLLBACK');
      await db.query('COMMIT');
      await db.end();
    }
  },
);
