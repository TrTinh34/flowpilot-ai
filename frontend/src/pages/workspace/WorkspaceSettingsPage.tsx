import { useState, type FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  changeWorkspaceRole,
  createWorkspace,
  listWorkspaceMembers,
  listWorkspaces,
  removeWorkspaceMember,
  sendInvitation,
  transferWorkspace,
} from '@/features/workspace/api/workspace.api';
import { extractApiErrorMessage } from '@/services/api-client';

export function WorkspaceSettingsPage() {
  const revision = useAuthStore((s) => s.sessionRevision);
  const viewerId = useAuthStore((s) => s.user?.id);
  const [search, setSearch] = useSearchParams();
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();
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
  const canManage = selected?.role === 'OWNER' || selected?.role === 'ADMIN';

  async function run(action: () => Promise<unknown>) {
    setPending(true);
    setError('');
    setPreview('');
    try {
      await action();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workspaces', revision] }),
        queryClient.invalidateQueries({ queryKey: ['workspace-members', revision] }),
      ]);
    } catch (cause) {
      setError(extractApiErrorMessage(cause));
    } finally {
      setPending(false);
    }
  }

  function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = String(new FormData(form).get('name') ?? '');
    void run(async () => {
      const workspace = await createWorkspace(name);
      setSearch({ workspace: workspace.id });
      form.reset();
    });
  }

  function onInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const email = String(values.get('email') ?? '');
    const role = values.get('role') === 'ADMIN' ? 'ADMIN' : 'MEMBER';
    void run(async () => {
      const invitation = await sendInvitation(workspaceId, email, role);
      setPreview(invitation.previewUrl ?? '');
      form.reset();
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-page-gutter py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Workspaces</h1>
        <Link className="underline" to="/">
          Home
        </Link>
      </header>
      <form onSubmit={onCreate} className="flex flex-wrap items-end gap-2">
        <label className="grid gap-1">
          Workspace name
          <Input name="name" required />
        </label>
        <Button disabled={pending}>Create workspace</Button>
      </form>
      {workspaces.isPending && <p role="status">Loading workspaces…</p>}
      {workspaces.isError && <p role="alert">{extractApiErrorMessage(workspaces.error)}</p>}
      {workspaces.data?.data.length === 0 && <p>No workspaces on this page.</p>}
      <div className="flex flex-wrap items-center gap-3">
        <label>
          Workspace{' '}
          <select
            aria-label="Workspace"
            value={workspaceId}
            onChange={(event) => {
              setSearch({ workspace: event.target.value });
              setPreview('');
              setError('');
            }}
          >
            {!pageSelection && workspaceId && (
              <option value={workspaceId}>{selected?.name ?? workspaceId}</option>
            )}
            {workspaces.data?.data.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
        </label>
        <Button
          type="button"
          variant="outline"
          disabled={page === 0}
          onClick={() => {
            setSearch({});
            setPage(page - 1);
          }}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!workspaces.data || workspaces.data.data.length < workspaces.data.size}
          onClick={() => {
            setSearch({});
            setPage(page + 1);
          }}
        >
          Next
        </Button>
      </div>
      {canManage && (
        <form onSubmit={onInvite} className="flex flex-wrap items-end gap-2">
          <label className="grid gap-1">
            Invite email
            <Input type="email" name="email" required />
          </label>
          <label>
            Role{' '}
            <select name="role">
              <option>MEMBER</option>
              {selected?.role === 'OWNER' && <option>ADMIN</option>}
            </select>
          </label>
          <Button disabled={pending}>Invite</Button>
        </form>
      )}
      {preview && (
        <a className="break-all underline" href={preview}>
          Copy or open the local invitation link
        </a>
      )}
      {error && <p role="alert">{error}</p>}
      {selected && (
        <Link className="underline" to={`/workspaces/${selected.id}/projects`}>
          Browse projects
        </Link>
      )}
      {workspaceId && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Members</h2>
          {members.isPending && <p role="status">Loading members…</p>}
          {members.isError && <p role="alert">{extractApiErrorMessage(members.error)}</p>}
          {members.data?.data.map((member) => (
            <div key={member.userId} className="flex flex-wrap items-center gap-3 border-b pb-3">
              <span className="min-w-0 break-all">{member.user.displayName}</span>
              <span>{member.role}</span>
              {canManage && member.role !== 'OWNER' && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() =>
                    void run(() =>
                      changeWorkspaceRole(
                        workspaceId,
                        member.userId,
                        member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN',
                      ),
                    )
                  }
                >
                  Make {member.role === 'ADMIN' ? 'Member' : 'Admin'}
                </Button>
              )}
              {selected?.role === 'OWNER' && member.role !== 'OWNER' && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() => {
                    if (window.confirm(`Transfer ownership to ${member.user.displayName}?`))
                      void run(() => transferWorkspace(workspaceId, member.userId));
                  }}
                >
                  Transfer ownership
                </Button>
              )}
              {(member.userId === viewerId || (canManage && member.role !== 'OWNER')) && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() => {
                    if (
                      window.confirm(
                        member.userId === viewerId
                          ? 'Leave this workspace?'
                          : 'Remove this member?',
                      )
                    )
                      void run(async () => {
                        await removeWorkspaceMember(workspaceId, member.userId);
                        if (member.userId === viewerId) setSearch({});
                      });
                  }}
                >
                  {member.userId === viewerId ? 'Leave workspace' : 'Remove member'}
                </Button>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
