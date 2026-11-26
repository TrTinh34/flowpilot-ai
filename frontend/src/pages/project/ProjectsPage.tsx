import { useState, type FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProject, listProjects } from '@/features/project/api/project.api';
import { listWorkspaceMembers } from '@/features/workspace/api/workspace.api';
import { extractApiErrorMessage } from '@/services/api-client';

export function ProjectsPage() {
  const { workspaceId = '' } = useParams();
  return <ProjectsForWorkspace key={workspaceId} workspaceId={workspaceId} />;
}

function ProjectsForWorkspace({ workspaceId }: { workspaceId: string }) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const [page, setPage] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const directory = useQuery({
    queryKey: ['workspace-members', revision, workspaceId],
    queryFn: () => listWorkspaceMembers(workspaceId),
  });
  const projects = useQuery({
    queryKey: ['projects', revision, workspaceId, page],
    queryFn: () => listProjects(workspaceId, page),
  });
  const role = directory.data?.workspace.role;

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setPending(true);
    setError('');
    try {
      const project = await createProject(workspaceId, {
        name: String(values.get('name') ?? ''),
        managerId: String(values.get('managerId') ?? ''),
      });
      await queryClient.invalidateQueries({ queryKey: ['projects', revision, workspaceId] });
      navigate(`/projects/${project.id}`);
    } catch (cause) {
      setError(extractApiErrorMessage(cause));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl space-y-5 px-5 py-10">
      <Link to={`/workspaces?workspace=${workspaceId}`} className="underline">
        Back to workspace
      </Link>
      <h1 className="text-2xl font-semibold">
        Projects{directory.data ? ` · ${directory.data.workspace.name}` : ''}
      </h1>
      {(role === 'OWNER' || role === 'ADMIN') && (
        <form className="flex flex-wrap items-end gap-3" onSubmit={(event) => void create(event)}>
          <label className="grid gap-1">
            Project name
            <Input name="name" required />
          </label>
          <label className="grid gap-1">
            Project manager
            <select name="managerId" required defaultValue="">
              <option value="" disabled>
                Select a member
              </option>
              {directory.data?.data.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.user.displayName}
                </option>
              ))}
            </select>
          </label>
          <Button disabled={pending}>Create project</Button>
        </form>
      )}
      {error && <p role="alert">{error}</p>}
      {projects.isPending && <p role="status">Loading projects…</p>}
      {projects.isError && <p role="alert">{extractApiErrorMessage(projects.error)}</p>}
      {projects.data?.data.length === 0 && <p>No projects on this page.</p>}
      <ul className="space-y-2">
        {projects.data?.data.map((project) => (
          <li
            key={project.id}
            className="flex items-center justify-between gap-3 rounded border p-3"
          >
            <Link to={`/projects/${project.id}`} className="min-w-0 break-all underline">
              {project.name}
            </Link>
            <span>{project.status === 'ARCHIVED' ? 'Archived' : 'Active'}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={!projects.data || projects.data.data.length < projects.data.size}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </main>
  );
}
