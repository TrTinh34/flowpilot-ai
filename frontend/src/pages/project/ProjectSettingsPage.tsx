import { useState, type FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  addProjectMember,
  getProjectMembers,
  updateProject,
  type Project,
} from '@/features/project/api/project.api';
import { listWorkspaceMembers } from '@/features/workspace/api/workspace.api';
import { extractApiErrorMessage } from '@/services/api-client';

export function ProjectSettingsPage() {
  const { projectId = '' } = useParams();
  return <ProjectSettings key={projectId} projectId={projectId} />;
}

function ProjectSettings({ projectId }: { projectId: string }) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const detail = useQuery({
    queryKey: ['project-members', revision, projectId],
    queryFn: () => getProjectMembers(projectId),
  });
  const project = detail.data?.project;
  const canWrite = Boolean(detail.data?.canManage && project?.status === 'ACTIVE');
  const workspaceId = project?.workspaceId ?? '';
  const directory = useQuery({
    queryKey: ['workspace-members', revision, workspaceId],
    queryFn: () => listWorkspaceMembers(workspaceId),
    enabled: canWrite && Boolean(workspaceId),
  });
  const options = directory.data?.data.filter(
    (member) => !detail.data?.data.some((existing) => existing.userId === member.userId),
  );

  async function run(action: () => Promise<unknown>) {
    setPending(true);
    setError('');
    try {
      await action();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['project-members', revision, projectId] }),
        queryClient.invalidateQueries({ queryKey: ['projects', revision, workspaceId] }),
      ]);
    } catch (cause) {
      setError(extractApiErrorMessage(cause));
    } finally {
      setPending(false);
    }
  }

  function save(event: FormEvent<HTMLFormElement>, status: Project['status']) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const name = String(values.get('name') ?? '');
    if (status === 'ARCHIVED' && !window.confirm('Archive this project? It will become read-only.'))
      return;
    void run(() => updateProject(projectId, { name, status }));
  }

  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    void run(async () => {
      await addProjectMember(projectId, {
        userId: String(values.get('userId') ?? ''),
        role: values.get('role') === 'MANAGER' ? 'MANAGER' : 'MEMBER',
      });
      form.reset();
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-page-gutter py-8">
      <Link
        to={workspaceId ? `/workspaces/${workspaceId}/projects` : '/workspaces'}
        className="underline"
      >
        Back to projects
      </Link>
      <h1 className="text-2xl font-semibold">{project?.name ?? 'Project settings'}</h1>
      {project && (
        <Link to={`/projects/${project.id}/tasks`} className="underline">
          Project tasks
        </Link>
      )}
      {detail.isPending && <p role="status">Loading project…</p>}
      {detail.isError && <p role="alert">{extractApiErrorMessage(detail.error)}</p>}
      {project?.status === 'ARCHIVED' && <p>Archived · read-only</p>}
      {project && canWrite && (
        <form
          key={project.name}
          className="flex flex-wrap items-end gap-2"
          onSubmit={(event) => {
            const submitter = (event.nativeEvent as SubmitEvent).submitter;
            save(event, submitter?.getAttribute('value') === 'ARCHIVED' ? 'ARCHIVED' : 'ACTIVE');
          }}
        >
          <label className="grid gap-1">
            Project name
            <Input name="name" defaultValue={project.name} required />
          </label>
          <Button disabled={pending}>Save changes</Button>
          <Button type="submit" value="ARCHIVED" variant="outline" disabled={pending}>
            Archive project
          </Button>
        </form>
      )}
      {detail.data && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Project members</h2>
          {detail.data.data.length === 0 && <p>No project members.</p>}
          <ul className="space-y-2">
            {detail.data.data.map((member) => (
              <li key={member.userId} className="break-all">
                {member.user.displayName} · {member.role}
              </li>
            ))}
          </ul>
          {canWrite && (
            <form className="flex flex-wrap items-end gap-3" onSubmit={add}>
              <label className="grid gap-1">
                Workspace member
                <select name="userId" required defaultValue="">
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
              <label>
                Role{' '}
                <select name="role">
                  <option>MEMBER</option>
                  {detail.data.canAssignManager && <option>MANAGER</option>}
                </select>
              </label>
              <Button disabled={pending || !options?.length}>Add member</Button>
            </form>
          )}
          {directory.isError && <p role="alert">{extractApiErrorMessage(directory.error)}</p>}
          {error && <p role="alert">{error}</p>}
        </section>
      )}
    </div>
  );
}
