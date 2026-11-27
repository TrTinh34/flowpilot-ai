import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

it.skipIf(!process.env['TEST_DATABASE_URL'])(
  'enforces collaboration references, comment bodies, and attachment metadata',
  async () => {
    await confirmTestDatabase();
    const db = new Client({ connectionString: process.env['DATABASE_URL'] });
    await db.connect();

    async function rejects(
      sql: string,
      values: (string | number)[],
      code: string,
      constraint: string,
    ) {
      await db.query('SAVEPOINT collaboration_probe');
      try {
        await expect(db.query(sql, values)).rejects.toMatchObject({ code, constraint });
      } finally {
        await db.query('ROLLBACK TO SAVEPOINT collaboration_probe');
        await db.query('RELEASE SAVEPOINT collaboration_probe');
      }
    }

    try {
      await db.query('BEGIN');
      const workspace = randomUUID();
      const project = randomUUID();
      const task = randomUUID();
      const user = randomUUID();
      const missing = randomUUID();
      await db.query("INSERT INTO workspaces (id,name,updated_at) VALUES ($1,'Fixture',now())", [
        workspace,
      ]);
      await db.query(
        "INSERT INTO projects (id,workspace_id,name,updated_at) VALUES ($1,$2,'Fixture',now())",
        [project, workspace],
      );
      await db.query(
        "INSERT INTO users (id,email,password_hash,display_name,updated_at) VALUES ($1,$2,'fixture','Fixture',now())",
        [user, `${user}@example.test`],
      );
      await db.query(
        "INSERT INTO tasks (id,project_id,title,description,priority,position,updated_at) VALUES ($1,$2,'Fixture','','LOW',0,now())",
        [task, project],
      );

      const comment = `INSERT INTO comments (id,task_id,author_id,body,updated_at)
        VALUES ($1,$2,$3,$4,now()) RETURNING body, created_at`;
      const attachment = `INSERT INTO attachments (id,task_id,uploader_id,object_key,filename,mime_type,size_bytes)
        VALUES ($1,$2,$3,$4,'fixture.txt','text/plain',$5) RETURNING size_bytes, created_at`;
      const savedComment = await db.query(comment, [randomUUID(), task, user, 'A comment']);
      expect(savedComment.rows).toEqual([{ body: 'A comment', created_at: expect.any(Date) }]);

      const maxBytes = 10 * 1024 * 1024;
      const key = randomUUID();
      const savedAttachment = await db.query(attachment, [randomUUID(), task, user, key, maxBytes]);
      expect(savedAttachment.rows).toEqual([
        { size_bytes: maxBytes, created_at: expect.any(Date) },
      ]);
      await db.query(attachment, [randomUUID(), task, user, randomUUID(), 1]);

      await rejects(
        comment,
        [randomUUID(), missing, user, 'Body'],
        '23503',
        'comments_task_id_fkey',
      );
      await rejects(
        comment,
        [randomUUID(), task, missing, 'Body'],
        '23503',
        'comments_author_id_fkey',
      );
      await rejects(
        comment,
        [randomUUID(), task, user, ' \t\n'],
        '23514',
        'comments_body_not_blank',
      );
      await rejects(
        attachment,
        [randomUUID(), missing, user, randomUUID(), 1],
        '23503',
        'attachments_task_id_fkey',
      );
      await rejects(
        attachment,
        [randomUUID(), task, missing, randomUUID(), 1],
        '23503',
        'attachments_uploader_id_fkey',
      );
      await rejects(
        attachment,
        [randomUUID(), task, user, key, 1],
        '23505',
        'attachments_object_key_key',
      );
      for (const size of [0, -1, maxBytes + 1]) {
        await rejects(
          attachment,
          [randomUUID(), task, user, randomUUID(), size],
          '23514',
          'attachments_size_bytes_range',
        );
      }
      await rejects('DELETE FROM tasks WHERE id=$1', [task], '23503', 'comments_task_id_fkey');
    } finally {
      try {
        await db.query('ROLLBACK');
      } finally {
        await db.end();
      }
    }
  },
);
