import { createHash, randomBytes } from 'node:crypto';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import { fakeEmailProvider } from '../../integrations/email/fake-email.provider.js';
import { findMembership, lockWorkspace } from './workspace.repository.js';
import { withWorkspaceLock } from './workspace.service.js';

const inviteLifetimeMs = 48 * 60 * 60 * 1000;
const hash = (token: string) => createHash('sha256').update(token).digest('hex');

function invalidInvitation() {
  return new AppError(422, ERROR_CODES.INVALID_INVITATION, 'Invitation is invalid or expired.');
}

function conflict() {
  return new AppError(
    409,
    ERROR_CODES.INVITATION_CONFLICT,
    'An invitation or membership already exists.',
  );
}

export async function inviteMember(
  workspaceId: string,
  actorId: string,
  input: { email: string; role: 'ADMIN' | 'MEMBER' },
) {
  const email = input.email.toLowerCase();
  const token = randomBytes(32).toString('base64url');
  const invitation = await withWorkspaceLock(workspaceId, actorId, async (tx, role) => {
    if (role === 'MEMBER' || (role === 'ADMIN' && input.role === 'ADMIN')) {
      throw new AppError(403, ERROR_CODES.FORBIDDEN, 'Insufficient workspace permissions.');
    }
    fakeEmailProvider.assertAvailable();
    const now = new Date();
    const pending = await tx.$queryRaw<{ id: string; expiresAt: Date }[]>`
      SELECT id, expires_at AS "expiresAt" FROM invitations
      WHERE workspace_id = ${workspaceId}::uuid AND LOWER(email) = LOWER(${email}) AND status = 'PENDING'
    `;
    if (pending[0]?.expiresAt > now) throw conflict();
    if (pending[0]) {
      await tx.invitation.update({ where: { id: pending[0].id }, data: { status: 'EXPIRED' } });
    }
    const existing = await tx.$queryRaw<{ id: string }[]>`
      SELECT wm.id FROM workspace_members wm JOIN users u ON u.id = wm.user_id
      WHERE wm.workspace_id = ${workspaceId}::uuid AND LOWER(u.email) = LOWER(${email})
    `;
    if (existing.length) throw conflict();
    return tx.invitation.create({
      data: {
        workspaceId,
        email,
        role: input.role,
        tokenHash: hash(token),
        expiresAt: new Date(now.getTime() + inviteLifetimeMs),
      },
      select: {
        id: true,
        workspaceId: true,
        email: true,
        role: true,
        status: true,
        expiresAt: true,
      },
    });
  });
  const delivery = await fakeEmailProvider.sendWorkspaceInvitation({ email, token });
  return { ...invitation, previewUrl: delivery.previewUrl };
}

export async function acceptInvitation(actorId: string, token: string) {
  const tokenHash = hash(token);
  return prisma.$transaction(
    async (tx) => {
      const candidate = await tx.invitation.findUnique({
        where: { tokenHash },
        select: { workspaceId: true },
      });
      if (!candidate) throw invalidInvitation();
      await lockWorkspace(tx, candidate.workspaceId);
      const invitation = await tx.invitation.findUnique({ where: { tokenHash } });
      if (!invitation || invitation.status !== 'PENDING' || invitation.expiresAt <= new Date()) {
        throw invalidInvitation();
      }
      const user = await tx.user.findUnique({ where: { id: actorId }, select: { email: true } });
      if (!user || user.email.toLowerCase() !== invitation.email.toLowerCase()) {
        throw new AppError(403, ERROR_CODES.FORBIDDEN, 'Invitation is assigned to another email.');
      }
      if (await findMembership(tx, invitation.workspaceId, actorId)) throw conflict();
      const membership = await tx.workspaceMember.create({
        data: { workspaceId: invitation.workspaceId, userId: actorId, role: invitation.role },
        select: { workspaceId: true, userId: true, role: true },
      });
      await tx.invitation.update({ where: { id: invitation.id }, data: { status: 'ACCEPTED' } });
      return membership;
    },
    { isolationLevel: 'ReadCommitted' },
  );
}
