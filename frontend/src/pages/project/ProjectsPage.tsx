import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { Badge } from '@/components/ui/badge';
import { createProject, listProjects } from '@/features/project/api/project.api';
import { CreateProjectDialog } from '@/features/project/components/CreateProjectDialog';
import { listWorkspaceMembers } from '@/features/workspace/api/workspace.api';
import { extractApiErrorMessage } from '@/services/api-client';

export function ProjectsPage() {
  const { workspaceId = '' } = useParams();
  return <ProjectsForWorkspace key={workspaceId} workspaceId={workspaceId} />;
}

function ProjectsForWorkspace({ workspaceId }: { workspaceId: string }) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const [page, setPage] = useState(0);
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
        (projects.data.data.length ? (
          <ul className="space-y-2">
            {projects.data.data.map((project) => (
              <li
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3"
              >
                <Link
                  to={`/projects/${project.id}`}
                  className="min-w-0 break-words text-action-link underline"
                >
                  {project.name}
                </Link>
                <Badge tone={project.status === 'ACTIVE' ? 'success' : 'neutral'}>
                  {project.status === 'ARCHIVED' ? 'Archived' : 'Active'}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No projects on this page."
            description={
              canCreate ? 'Create a project to organize your workspace’s tasks.' : undefined
            }
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
