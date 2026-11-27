import { Avatar } from '@/components/common/Avatar';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { WorkspaceMember, WorkspaceRole } from '@/features/workspace/api/workspace.api';

type MemberAction = 'role' | 'transfer' | 'remove';

const ROLE_TONE: Record<WorkspaceRole, BadgeTone> = {
  OWNER: 'primary',
  ADMIN: 'info',
  MEMBER: 'neutral',
};

export function WorkspaceMemberRow({
  member,
  viewerId,
  viewerRole,
  soleOwner,
  onAction,
}: {
  member: WorkspaceMember;
  viewerId?: string;
  viewerRole: WorkspaceRole;
  soleOwner: boolean;
  onAction: (action: MemberAction, member: WorkspaceMember) => Promise<void>;
}) {
  const name = member.user.displayName;
  const isSelf = member.userId === viewerId;
  const cannotLeave = isSelf && member.role === 'OWNER' && soleOwner;
  const canManageTarget = viewerRole !== 'MEMBER' && member.role !== 'OWNER';
  const leaveLabel = isSelf ? 'Leave workspace' : 'Remove member';

  return (
    <li className="flex flex-col gap-3 py-3 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={name} size="md" tone="subtle" />
        <div className="min-w-0 space-y-1">
          <p className="break-words text-sm font-semibold text-foreground">
            {name}
            {isSelf && <span className="ml-1.5 font-normal text-muted-foreground">(you)</span>}
          </p>
          <Badge tone={ROLE_TONE[member.role]}>{member.role}</Badge>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {canManageTarget && (
          <ConfirmDialog
            title={member.role === 'ADMIN' ? 'Make Member' : 'Make Admin'}
            description={`Change the workspace role for ${name}?`}
            confirmLabel={member.role === 'ADMIN' ? 'Make Member' : 'Make Admin'}
            onConfirm={() => onAction('role', member)}
            trigger={
              <Button variant="outline" size="sm" type="button">
                {member.role === 'ADMIN' ? 'Make Member' : 'Make Admin'}
              </Button>
            }
          />
        )}
        {viewerRole === 'OWNER' && member.role !== 'OWNER' && (
          <ConfirmDialog
            title="Transfer ownership"
            description={`Transfer ownership to ${name}? Your role will become Admin.`}
            confirmLabel="Transfer ownership"
            onConfirm={() => onAction('transfer', member)}
            trigger={
              <Button variant="outline" size="sm" type="button">
                Transfer ownership
              </Button>
            }
          />
        )}
        {cannotLeave && (
          <p className="text-xs text-muted-foreground">Transfer ownership before leaving.</p>
        )}
        {((isSelf && !cannotLeave) || canManageTarget) && (
          <ConfirmDialog
            title={leaveLabel}
            confirmLabel={leaveLabel}
            danger
            description={
              isSelf
                ? 'You will lose access to this workspace.'
                : `${name} will lose access to this workspace.`
            }
            onConfirm={() => onAction('remove', member)}
            trigger={
              <Button variant="outline" size="sm" type="button">
                {leaveLabel}
              </Button>
            }
          />
        )}
      </div>
    </li>
  );
}
