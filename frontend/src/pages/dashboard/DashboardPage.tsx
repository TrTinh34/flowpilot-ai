import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, CheckSquare, Clock, Columns3, FolderKanban, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardDemo } from '@/features/dashboard/components/DashboardDemo';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { listProjects } from '@/features/project/api/project.api';
import { listMyTasks } from '@/features/task/api/task.api';
import { TaskMetadata } from '@/features/task/components/TaskMetadata';
import { useShellContext } from '@/layouts/useShellContext';
import { extractApiErrorMessage } from '@/services/api-client';

export function DashboardPage() {
  const revision = useAuthStore((state) => state.sessionRevision);
  const { workspace, workspaceId } = useShellContext();
  const myTasks = useQuery({
    queryKey: ['my-tasks', revision, 0],
    queryFn: () => listMyTasks(0),
  });
  const projects = useQuery({
    queryKey: ['projects', revision, workspaceId ?? '', 0],
    queryFn: () => listProjects(workspaceId ?? '', 0),
    enabled: Boolean(workspaceId),
  });

  const assigned = myTasks.data?.data ?? [];
  const openTasks = assigned.filter(({ status }) => status !== 'DONE');
  const completedCount = assigned.length - openTasks.length;
  const due = openTasks
    .filter(({ dueDate }) => Boolean(dueDate))
    .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));
  const preview = [
    ...due,
    ...openTasks.filter((task) => !due.includes(task)),
    ...assigned.filter((task) => task.status === 'DONE'),
  ].slice(0, 5);
  const projectList = projects.data?.data ?? [];
  const activeProjectCount = projectList.filter(({ status }) => status === 'ACTIVE').length;

  return (
    <div className="w-full min-w-0 space-y-6 px-page-gutter py-6">
      <PageHeader
        title="Dashboard"
        description={workspace?.name}
        actions={
          <>
            <Button asChild variant="outline">
              {workspaceId ? (
                <Link to={`/workspaces/${workspaceId}/projects`}>Projects</Link>
              ) : (
                <Link to="/workspaces">Workspaces</Link>
              )}
            </Button>
            <Button asChild>
              <Link to="/my-tasks">Open My Tasks</Link>
            </Button>
          </>
        }
      />

      {(myTasks.isSuccess || projects.isSuccess) && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Assigned to me"
            value={assigned.length}
            hint="Current page"
            icon={ListTodo}
          />
          <StatCard
            label="Open tasks"
            value={openTasks.length}
            hint={`${due.length} with due date`}
            icon={Clock}
            toneClass="bg-[var(--color-info-bg)] text-[var(--info-text)]"
          />
          <StatCard
            label="Completed"
            value={completedCount}
            hint="Current page"
            icon={CheckCircle2}
            toneClass="bg-[var(--color-success-bg)] text-[var(--success-text)]"
          />
          <StatCard
            label="Workspace projects"
            value={projectList.length}
            hint={workspaceId ? `${activeProjectCount} active on page` : 'Select a workspace'}
            icon={FolderKanban}
          />
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section
          aria-labelledby="dashboard-my-tasks"
          className="min-w-0 rounded-[var(--radius-md)] border border-border bg-card p-4 sm:p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id="dashboard-my-tasks" className="text-section-title">
              My Tasks
            </h2>
            {myTasks.isSuccess && assigned.length > 0 && (
              <Link to="/my-tasks" className="text-xs font-medium text-action-link hover:underline">
                View all
              </Link>
            )}
          </div>
          {myTasks.isPending && (
            <div className="mt-3">
              <LoadingState label="Loading assigned tasks" variant="list" />
            </div>
          )}
          {myTasks.isError && (
            <div className="mt-3">
              <ErrorState
                title="Could not load assigned tasks"
                message={extractApiErrorMessage(myTasks.error)}
                onRetry={() => void myTasks.refetch()}
              />
            </div>
          )}
          {myTasks.isSuccess &&
            (preview.length ? (
              <ul className="mt-3 divide-y divide-border">
                {preview.map((task) => (
                  <li
                    key={task.id}
                    className="flex min-w-0 flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <Link
                      to={`/tasks/${task.id}`}
                      className="min-w-0 break-words text-sm font-medium text-foreground transition-colors hover:text-action-link hover:underline"
                    >
                      {task.title}
                    </Link>
                    <TaskMetadata task={task} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3">
                <EmptyState compact headingLevel="h3" title="No tasks assigned to you yet." />
              </div>
            ))}
        </section>

        <section
          aria-labelledby="dashboard-projects"
          className="min-w-0 rounded-[var(--radius-md)] border border-border bg-card p-4 sm:p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id="dashboard-projects" className="text-section-title">
              Workspace projects
            </h2>
            {workspaceId && projectList.length > 0 && (
              <Link
                to={`/workspaces/${workspaceId}/projects`}
                className="text-xs font-medium text-action-link hover:underline"
              >
                Browse all
              </Link>
            )}
          </div>
          {!workspaceId && (
            <div className="mt-3">
              <EmptyState
                compact
                headingLevel="h3"
                icon={FolderKanban}
                title="No workspace selected"
                description="Create or join a workspace to organize projects."
                action={
                  <Button asChild variant="outline" size="sm">
                    <Link to="/workspaces">Manage workspaces</Link>
                  </Button>
                }
              />
            </div>
          )}
          {workspaceId && projects.isPending && (
            <div className="mt-3">
              <LoadingState label="Loading workspace projects" variant="list" />
            </div>
          )}
          {workspaceId && projects.isError && (
            <div className="mt-3">
              <ErrorState
                title="Could not load workspace projects"
                message={extractApiErrorMessage(projects.error)}
                onRetry={() => void projects.refetch()}
              />
            </div>
          )}
          {workspaceId &&
            projects.isSuccess &&
            (projectList.length ? (
              <ul className="mt-3 divide-y divide-border">
                {projectList.slice(0, 5).map((project) => (
                  <li
                    key={project.id}
                    className="flex min-w-0 flex-wrap items-center justify-between gap-2 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Link
                        to={`/projects/${project.id}`}
                        className="min-w-0 break-words text-sm font-medium text-foreground transition-colors hover:text-action-link hover:underline"
                      >
                        {project.name}
                      </Link>
                      <Badge tone={project.status === 'ACTIVE' ? 'success' : 'neutral'}>
                        {project.status === 'ACTIVE' ? 'Active' : 'Archived'}
                      </Badge>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-xs">
                      <Link
                        to={`/projects/${project.id}/tasks`}
                        aria-label={`Tasks for ${project.name}`}
                        className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-2 py-1 font-medium text-action-link hover:bg-muted"
                      >
                        <CheckSquare className="size-3.5" aria-hidden="true" />
                        Tasks
                      </Link>
                      <Link
                        to={`/projects/${project.id}/board`}
                        aria-label={`Board for ${project.name}`}
                        className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-2 py-1 font-medium text-action-link hover:bg-muted"
                      >
                        <Columns3 className="size-3.5" aria-hidden="true" />
                        Board
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3">
                <EmptyState
                  compact
                  headingLevel="h3"
                  icon={FolderKanban}
                  title="No projects in this workspace yet."
                  action={
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/workspaces/${workspaceId}/projects`}>Open projects</Link>
                    </Button>
                  }
                />
              </div>
            ))}
        </section>
      </div>

      {import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true' && <DashboardDemo />}
    </div>
  );
}
