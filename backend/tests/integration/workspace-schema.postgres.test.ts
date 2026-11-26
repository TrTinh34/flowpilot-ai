import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

it.skipIf(!process.env['TEST_DATABASE_URL'])(
  'enforces workspace and invitation constraints in PostgreSQL',
  async () => {
    await confirmTestDatabase();
    const db = new Client({ connectionString: process.env['DATABASE_URL'] });
    await db.connect();

    async function rejectsConstraint(
      code: string,
      constraint: string,
      query: string,
      values: string[],
    ) {
      await db.query('SAVEPOINT constraint_probe');
      try {
        await expect(db.query(query, values)).rejects.toMatchObject({ code, constraint });
      } finally {
        await db.query('ROLLBACK TO SAVEPOINT constraint_probe');
        await db.query('RELEASE SAVEPOINT constraint_probe');
      }
    }

    try {
      await db.query('BEGIN');
      const workspaceId = randomUUID();
      const otherWorkspaceId = randomUUID();
      const userId = randomUUID();
      const workspaceInsert =
        'INSERT INTO workspaces (id, name, updated_at) VALUES ($1, $2, now())';
      await db.query(workspaceInsert, [workspaceId, 'Schema fixture']);
      await db.query(workspaceInsert, [otherWorkspaceId, 'Other fixture']);
      await rejectsConstraint('23514', 'workspaces_name_not_blank', workspaceInsert, [
        randomUUID(),
        '   ',
      ]);

      await db.query(
        'INSERT INTO users (id, email, password_hash, display_name, updated_at) VALUES ($1, $2, $3, $4, now())',
        [userId, `${userId}@example.test`, 'fixture-hash', 'Fixture Member'],
      );
      const memberInsert = `
      INSERT INTO workspace_members (id, workspace_id, user_id, role, updated_at)
      VALUES ($1, $2, $3, 'OWNER', now())
    `;
      await db.query(memberInsert, [randomUUID(), workspaceId, userId]);
      await rejectsConstraint('23505', 'workspace_members_workspace_id_user_id_key', memberInsert, [
        randomUUID(),
        workspaceId,
        userId,
      ]);
      await rejectsConstraint('23503', 'workspace_members_user_id_fkey', memberInsert, [
        randomUUID(),
        workspaceId,
        randomUUID(),
      ]);
      await rejectsConstraint('23503', 'workspace_members_workspace_id_fkey', memberInsert, [
        randomUUID(),
        randomUUID(),
        userId,
      ]);

      const invitationInsert = `
      INSERT INTO invitations (id, workspace_id, email, token_hash, role, expires_at, updated_at)
      VALUES ($1, $2, $3, $4, 'MEMBER', now() + interval '48 hours', now())
      RETURNING status
    `;
      const tokenHash = randomUUID();
      const invitation = await db.query(invitationInsert, [
        randomUUID(),
        workspaceId,
        'guest@example.test',
        tokenHash,
      ]);
      expect(invitation.rows).toEqual([{ status: 'PENDING' }]);
      await rejectsConstraint('23505', 'invitations_pending_uidx', invitationInsert, [
        randomUUID(),
        workspaceId,
        'GUEST@example.test',
        randomUUID(),
      ]);
      await rejectsConstraint('23505', 'invitations_token_hash_key', invitationInsert, [
        randomUUID(),
        otherWorkspaceId,
        'other@example.test',
        tokenHash,
      ]);
      await rejectsConstraint('23503', 'invitations_workspace_id_fkey', invitationInsert, [
        randomUUID(),
        randomUUID(),
        'other@example.test',
        randomUUID(),
      ]);
      await db.query(invitationInsert, [
        randomUUID(),
        otherWorkspaceId,
        'guest@example.test',
        randomUUID(),
      ]);
      await db.query("UPDATE invitations SET status = 'REVOKED' WHERE token_hash = $1", [
        tokenHash,
      ]);
      await db.query(invitationInsert, [
        randomUUID(),
        workspaceId,
        'GUEST@example.test',
        randomUUID(),
      ]);
    } finally {
      try {
        await db.query('ROLLBACK');
      } finally {
        await db.end();
      }
    }
  },
);
