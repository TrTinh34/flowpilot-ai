import { useRef, useState, type FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FieldLabel } from '@/components/ui/field-label';
import { Input } from '@/components/ui/input';
import { addProjectMember, getProjectMembers, updateProject } from '../api/project.api';
import { listWorkspaceMembers } from '@/features/workspace/api/workspace.api';
import { extractApiErrorMessage } from '@/services/api-client';

const selectClass = 'h-11 min-w-0 rounded-[var(--radius)] border border-input bg-card px-3 text-sm';

export function ProjectSettings({ projectId }: { projectId: string }) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const client = useQueryClient();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<'save' | 'archive' | 'member', string>>>({});
  const [archiveOpen, setArchiveOpen] = useState(false);
  const nameForm = useRef<HTMLFormElement>(null);
  const busy = useRef(false);
  const detail = useQuery({
    queryKey: ['project-members', revision, projectId],
    queryFn: () => getProjectMembers(projectId),
  });
  const project = detail.data?.project;
  const canWrite = detail.isSuccess && detail.data.canManage && project?.status === 'ACTIVE';
  const workspaceId = project?.workspaceId ?? '';
  const directory = useQuery({
    queryKey: ['workspace-members', revision, workspaceId],
    queryFn: () => listWorkspaceMembers(workspaceId),
    enabled: canWrite && Boolean(workspaceId),
  });
  const options = directory.data?.data.filter(
    (member) => !detail.data?.data.some((existing) => existing.userId === member.userId),
  );

  async function run(kind: 'save' | 'archive' | 'member', action: () => Promise<unknown>) {
    if (busy.current || !canWrite) return;
    busy.current = true;
    setPending(true);
    setErrors((current) => ({ ...current, [kind]: undefined }));
    try {
      await action();
      await Promise.all([
        client.invalidateQueries({ queryKey: ['project-members', revision, projectId] }),
        client.invalidateQueries({ queryKey: ['projects', revision, workspaceId] }),
      ]);
      if (kind === 'archive') setArchiveOpen(false);
    } catch (cause) {
      setErrors((current) => ({ ...current, [kind]: extractApiErrorMessage(cause) }));
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  function save(status: 'ACTIVE' | 'ARCHIVED') {
    const form = nameForm.current;
    if (!form?.reportValidity()) return;
    const name = String(new FormData(form).get('name') ?? '');
    void run(status === 'ARCHIVED' ? 'archive' : 'save', () =>
      updateProject(projectId, { name, status }),
    );
  }

  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    void run('member', async () => {
      await addProjectMember(projectId, {
        userId: String(values.get('userId') ?? ''),
        role:
          detail.data?.canAssignManager && values.get('role') === 'MANAGER' ? 'MANAGER' : 'MEMBER',
      });
      form.reset();
    });
  }

  return (
    <div className="w-full min-w-0 space-y-5 px-page-gutter py-8">
      <Link
        to={workspaceId ? `/workspaces/${workspaceId}/projects` : '/workspaces'}
        className="text-action-link underline"
      >
        Back to projects
      </Link>
      <PageHeader
        title={project?.name ?? 'Project settings'}
        description={project?.status === 'ARCHIVED' ? 'Archived · read-only' : undefined}
        actions={
          project && (
            <>
              <Button asChild variant="outline">
                <Link to={`/projects/${project.id}/tasks`}>Project tasks</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={`/projects/${project.id}/board`}>Open board</Link>
              </Button>
            </>
          )
        }
      />
      {detail.isPending && <LoadingState label="Loading project" />}
      {detail.isError && (
        <ErrorState
          title="Could not load project"
          message={extractApiErrorMessage(detail.error)}
          onRetry={() => void detail.refetch()}
        />
      )}
      {project && detail.isSuccess && (
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
          <section className="min-w-0 space-y-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 sm:p-5">
            <h2 className="text-section-title">Project members</h2>
            {detail.data.data.length ? (
              <ul className="divide-y divide-border">
                {detail.data.data.map((member) => (
                  <li
                    key={member.userId}
                    className="flex min-w-0 flex-wrap items-center gap-3 py-3"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-muted font-semibold text-action-link"
                    >
                      {member.user.displayName[0]?.toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1 break-words">{member.user.displayName}</span>
                    <Badge tone={member.role === 'MANAGER' ? 'success' : 'neutral'}>
                      {member.role === 'MANAGER' ? 'Manager' : 'Member'}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No project members." />
            )}
            {canWrite && (
              <form
                className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
                onSubmit={add}
              >
                <label className="grid min-w-0 gap-1 text-sm">
                  Workspace member
                  <select className={selectClass} name="userId" required defaultValue="">
                    <option value="" disabled>
                      Select a member
                    </option>
                    {options?.map((member) => (
                      <option key={member.userId} value={member.userId}>
                        {member.user.displayName}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-sm">
                  Role
                  <select className={selectClass} name="role">
                    <option value="MEMBER">Member</option>
                    {detail.data.canAssignManager && <option value="MANAGER">Manager</option>}
                  </select>
                </label>
                <Button type="submit" disabled={pending || !options?.length}>
                  Add member
                </Button>
              </form>
            )}
            {directory.isError && (
              <ErrorState
                title="Could not load available members"
                message={extractApiErrorMessage(directory.error)}
                onRetry={() => void directory.refetch()}
              />
            )}
            <FormErrorBanner message={errors.member} />
          </section>
          <section className="min-w-0 space-y-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 sm:p-5">
            <h2 className="text-section-title">Project details</h2>
            <Badge tone={project.status === 'ACTIVE' ? 'success' : 'neutral'}>
              {project.status === 'ACTIVE' ? 'Active' : 'Archived'}
            </Badge>
            {canWrite && (
              <>
                <form
                  key={project.name}
                  ref={nameForm}
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    save('ACTIVE');
                  }}
                >
                  <FieldLabel label="Project name" htmlFor="project-name">
                    <Input id="project-name" name="name" defaultValue={project.name} required />
                  </FieldLabel>
                  <FormErrorBanner message={errors.save} />
                  <Button type="submit" disabled={pending}>
                    Save changes
                  </Button>
                </form>
                <div className="border-t border-border pt-3">
                  <Dialog
                    title="Archive project"
                    description="The project will become read-only. The current project name will be saved."
                    open={archiveOpen}
                    busy={pending}
                    onOpenChange={(open) => {
                      if (open && !nameForm.current?.reportValidity()) return;
                      setArchiveOpen(open);
                      setErrors((current) => ({ ...current, archive: undefined }));
                    }}
                    trigger={
                      <Button type="button" variant="outline" disabled={pending}>
                        Archive project
                      </Button>
                    }
                  >
                    <div className="mt-4 space-y-3">
                      <FormErrorBanner message={errors.archive} />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={pending}
                          onClick={() => setArchiveOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          disabled={pending}
                          onClick={() => save('ARCHIVED')}
                        >
                          {pending ? 'Archiving…' : 'Archive project'}
                        </Button>
                      </div>
                    </div>
                  </Dialog>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
