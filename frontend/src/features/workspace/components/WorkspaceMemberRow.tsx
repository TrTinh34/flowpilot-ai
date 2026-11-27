import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';
import type { WorkspaceMember, WorkspaceRole } from '@/features/workspace/api/workspace.api';
import { extractApiErrorMessage } from '@/services/api-client';

type MemberAction = 'role' | 'transfer' | 'remove';

function ConfirmAction({
  label,
  description,
  danger,
  onConfirm,
}: {
  label: string;
  description: string;
  danger?: boolean;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  function changeOpen(next: boolean) {
    setOpen(next);
    if (!next) setError('');
  }
  async function confirm() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError('');
    try {
      await onConfirm();
      changeOpen(false);
    } catch (cause) {
      setError(extractApiErrorMessage(cause));
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <Dialog
      title={label}
      description={description}
      open={open}
      onOpenChange={changeOpen}
      busy={pending}
      trigger={
        <Button variant="outline" size="sm" type="button">
          {label}
        </Button>
      }
    >
      <div className="mt-4 space-y-3">
        <FormErrorBanner message={error} />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => changeOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={danger ? 'destructive' : 'default'}
            disabled={pending}
            onClick={() => void confirm()}
          >
            {pending ? 'Saving…' : label}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

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
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-muted font-semibold text-action-link"
        >
          {name[0]?.toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold">
            {name}
            {isSelf && <span className="ml-1 font-normal text-muted-foreground">(you)</span>}
          </p>
          <Badge tone={member.role === 'OWNER' ? 'success' : 'neutral'}>{member.role}</Badge>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {canManageTarget && (
          <ConfirmAction
            label={member.role === 'ADMIN' ? 'Make Member' : 'Make Admin'}
            description={`Change the workspace role for ${name}?`}
            onConfirm={() => onAction('role', member)}
          />
        )}
        {viewerRole === 'OWNER' && member.role !== 'OWNER' && (
          <ConfirmAction
            label="Transfer ownership"
            description={`Transfer ownership to ${name}? Your role will become Admin.`}
            onConfirm={() => onAction('transfer', member)}
          />
        )}
        {cannotLeave && <p className="text-secondary">Transfer ownership before leaving.</p>}
        {((isSelf && !cannotLeave) || canManageTarget) && (
          <ConfirmAction
            label={leaveLabel}
            danger
            description={
              isSelf
                ? 'You will lose access to this workspace.'
                : `${name} will lose access to this workspace.`
            }
            onConfirm={() => onAction('remove', member)}
          />
        )}
      </div>
    </li>
  );
}
