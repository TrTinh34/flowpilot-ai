import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { Input } from '@/components/ui/input';
import { ProjectCard } from './ProjectCard';
import { createProject, listProjects } from '@/features/project/api/project.api';
import { CreateProjectDialog } from '@/features/project/components/CreateProjectDialog';
import { listWorkspaceMembers } from '@/features/workspace/api/workspace.api';
import { extractApiErrorMessage } from '@/services/api-client';

export function ProjectsForWorkspace({ workspaceId }: { workspaceId: string }) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
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
  const canCreate = directory.isSuccess && (role === 'OWNER' || role === 'ADMIN');

  const pageProjects = projects.data?.data ?? [];
  const matching = pageProjects.filter(
    (project) =>
      (!status || project.status === status) &&
      project.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );

  async function create(input: { name: string; managerId: string }) {
    const project = await createProject(workspaceId, input);
    await queryClient.invalidateQueries({ queryKey: ['projects', revision, workspaceId] });
    navigate(`/projects/${project.id}`);
  }

  return (
    <div className="w-full min-w-0 space-y-5 px-page-gutter py-8">
      <Link to={`/workspaces?workspace=${workspaceId}`} className="text-action-link underline">
        Back to workspace
      </Link>
      <PageHeader
        title={directory.data ? `Projects · ${directory.data.workspace.name}` : 'Projects'}
        description="Browse projects and open their tasks or settings."
        actions={
          canCreate && <CreateProjectDialog members={directory.data.data} onCreate={create} />
        }
      />
      {directory.isError && (
        <ErrorState
          title="Could not load workspace details"
          message={extractApiErrorMessage(directory.error)}
          onRetry={() => void directory.refetch()}
        />
      )}
      {projects.isPending && <LoadingState label="Loading projects" />}
      {projects.isError && (
        <ErrorState
          title="Could not load projects"
          message={extractApiErrorMessage(projects.error)}
          onRetry={() => void projects.refetch()}
        />
      )}
      {projects.isSuccess &&
        (pageProjects.length > 0 ? (
          <section className="space-y-4" aria-label="Workspace projects">
            <div className="flex flex-wrap items-end gap-3">
              <label className="grid w-full gap-1 text-sm sm:max-w-xs">
                Search this page
                <Input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <label className="grid gap-1 text-sm">
                Project status
                <select
                  className="h-11 rounded-[var(--radius)] border border-input bg-card px-3"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="">All statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </label>
            </div>
            <p className="text-caption" aria-live="polite">
              {matching.length} of {pageProjects.length} projects on this page
            </p>
            {matching.length > 0 ? (
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {matching.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No matching projects."
                action={
                  <button
                    className="text-action-link underline"
                    onClick={() => {
                      setSearch('');
                      setStatus('');
                    }}
                  >
                    Clear filters
                  </button>
                }
              />
            )}
          </section>
        ) : (
          <EmptyState
            title="No projects on this page."
            description={canCreate ? 'Use Create project to start organizing work.' : undefined}
          />
        ))}
      <Pagination
        page={page}
        hasNext={projects.isSuccess && projects.data.data.length >= projects.data.size}
        onPageChange={setPage}
      />
    </div>
  );
}
