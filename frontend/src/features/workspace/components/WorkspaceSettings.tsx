import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field-label';
import { WorkspaceFormDialog } from '@/features/workspace/components/WorkspaceFormDialog';
import { WorkspaceMemberRow } from '@/features/workspace/components/WorkspaceMemberRow';
import {
  changeWorkspaceRole,
  createWorkspace,
  listWorkspaceMembers,
  listWorkspaces,
  removeWorkspaceMember,
  sendInvitation,
  transferWorkspace,
  type WorkspaceMember,
} from '@/features/workspace/api/workspace.api';
import { extractApiErrorMessage } from '@/services/api-client';

export function WorkspaceSettings() {
  const revision = useAuthStore((state) => state.sessionRevision);
  const viewerId = useAuthStore((state) => state.user?.id);
  const location = useLocation();
  const [search, setSearch] = useSearchParams();
  const [page, setPage] = useState(0);
  const [invitation, setInvitation] = useState<{ workspaceId: string; previewUrl?: string }>();
  const client = useQueryClient();
  const workspaces = useQuery({
    queryKey: ['workspaces', revision, page],
    queryFn: () => listWorkspaces(page),
  });
  const workspaceId = search.get('workspace') ?? workspaces.data?.data[0]?.id ?? '';
  const pageSelection = workspaces.data?.data.find((workspace) => workspace.id === workspaceId);
  const members = useQuery({
    queryKey: ['workspace-members', revision, workspaceId],
    queryFn: () => listWorkspaceMembers(workspaceId),
    enabled: Boolean(workspaceId),
  });
  const selected = members.data?.workspace ?? pageSelection;
  const role = members.isSuccess ? members.data.workspace.role : undefined;
  const canInvite = role === 'OWNER' || role === 'ADMIN';
  const soleOwner = members.data?.data.filter((member) => member.role === 'OWNER').length === 1;
  const createRequested = search.get('create') === '1';

  async function refreshWorkspace() {
    await Promise.all([
      client.invalidateQueries({ queryKey: ['workspaces', revision] }),
      client.invalidateQueries({ queryKey: ['workspace-members', revision, workspaceId] }),
    ]);
  }

  async function create(name: string) {
    const workspace = await createWorkspace(name);
    await client.invalidateQueries({ queryKey: ['workspaces', revision] });
    setSearch({ workspace: workspace.id });
  }

  async function invite(email: string, inviteRole: 'ADMIN' | 'MEMBER') {
    const result = await sendInvitation(workspaceId, email, inviteRole);
    setInvitation({ workspaceId, previewUrl: result.previewUrl });
  }

  async function manage(action: 'role' | 'transfer' | 'remove', member: WorkspaceMember) {
    if (action === 'role') {
      await changeWorkspaceRole(
        workspaceId,
        member.userId,
        member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN',
      );
    } else if (action === 'transfer') {
      await transferWorkspace(workspaceId, member.userId);
    } else {
      await removeWorkspaceMember(workspaceId, member.userId);
      if (member.userId === viewerId) setSearch({});
    }
    await refreshWorkspace();
  }

  return (
    <div className="w-full min-w-0 space-y-6 px-page-gutter py-8">
      <PageHeader
        title="Workspace settings"
        description="Manage workspace access and membership."
        actions={
          <WorkspaceFormDialog
            key={createRequested ? location.key : 'create'}
            kind="create"
            initiallyOpen={createRequested}
            onSubmit={create}
          />
        }
      />
      <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(13rem,18rem)_minmax(0,1fr)]">
        <section className="space-y-4 rounded-[var(--radius-md)] border border-border bg-card p-4">
          <h2 className="text-section-title">Workspaces</h2>
          {workspaces.isPending && <LoadingState label="Loading workspaces" />}
          {workspaces.isError && (
            <ErrorState
              title="Could not load workspaces"
              message={extractApiErrorMessage(workspaces.error)}
              onRetry={() => void workspaces.refetch()}
            />
          )}
          {workspaces.isSuccess && !workspaceId && (
            <EmptyState title="No workspaces on this page." />
          )}
          {workspaceId && (
            <FieldLabel htmlFor="workspace-selection" label="Workspace">
              <select
                id="workspace-selection"
                value={workspaceId}
                onChange={(event) => {
                  setSearch({ workspace: event.target.value });
                  setInvitation(undefined);
                }}
                className="h-11 w-full min-w-0 rounded-[var(--radius)] border border-input bg-card px-3 text-sm"
              >
                {!pageSelection && (
                  <option value={workspaceId}>{selected?.name ?? 'Selected workspace'}</option>
                )}
                {workspaces.data?.data.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </FieldLabel>
          )}
          <Pagination
            page={page}
            hasNext={workspaces.isSuccess && workspaces.data.data.length >= workspaces.data.size}
            onPageChange={(next) => {
              setSearch({});
              setInvitation(undefined);
              setPage(next);
            }}
          />
          {selected && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/workspaces/${selected.id}/projects`}>Browse projects</Link>
            </Button>
          )}
        </section>

        {workspaceId && (
          <div className="min-w-0 space-y-5">
            <section className="space-y-4 rounded-[var(--radius-md)] border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <h2 className="text-section-title">Members</h2>
                  {selected && <p className="text-secondary break-words">{selected.name}</p>}
                </div>
                {role && <Badge tone={role === 'OWNER' ? 'success' : 'neutral'}>{role}</Badge>}
              </div>
              {members.isPending && <LoadingState label="Loading members" />}
              {members.isError && (
                <ErrorState
                  title="Could not load members"
                  message={extractApiErrorMessage(members.error)}
                  onRetry={() => void members.refetch()}
                />
              )}
              {role &&
                (members.data?.data.length ? (
                  <ul className="divide-y divide-border rounded-[var(--radius-md)] border border-border">
                    {members.data.data.map((member) => (
                      <WorkspaceMemberRow
                        key={workspaceId + ':' + member.userId}
                        member={member}
                        viewerId={viewerId}
                        viewerRole={role}
                        soleOwner={soleOwner}
                        onAction={manage}
                      />
                    ))}
                  </ul>
                ) : (
                  <EmptyState title="No members found." />
                ))}
            </section>
            {canInvite && (
              <section className="space-y-3 rounded-[var(--radius-md)] border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-section-title">Invitations</h2>
                    <p className="text-secondary">Invite teammates to this workspace.</p>
                  </div>
                  <WorkspaceFormDialog
                    key={workspaceId}
                    kind="invite"
                    canInviteAdmin={role === 'OWNER'}
                    onSubmit={invite}
                  />
                </div>
                {invitation?.workspaceId === workspaceId && (
                  <div className="space-y-1 text-sm">
                    <p role="status" className="text-[var(--success-text)]">
                      Invitation created.
                    </p>
                    {invitation.previewUrl && (
                      <a
                        className="break-all text-action-link underline"
                        href={invitation.previewUrl}
                      >
                        Open the local invitation link
                      </a>
                    )}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
