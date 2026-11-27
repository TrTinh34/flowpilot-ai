import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { DashboardDemo } from '@/features/dashboard/components/DashboardDemo';
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
  const assigned = myTasks.data?.data ?? [];
  const due = assigned
    .filter(({ status, dueDate }) => status !== 'DONE' && dueDate)
    .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));
  const preview = [...due, ...assigned.filter((task) => !due.includes(task))].slice(0, 5);

  return (
    <div className="w-full min-w-0 space-y-8 px-page-gutter py-8">
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
      <section
        aria-labelledby="dashboard-my-tasks"
        className={
          myTasks.isSuccess && preview.length
            ? 'min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5'
            : 'min-w-0'
        }
      >
        <h2 id="dashboard-my-tasks" className="text-section-title">
          My Tasks
        </h2>
        {myTasks.isPending && (
          <div className="mt-3">
            <LoadingState label="Loading assigned tasks" />
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
                  className="flex min-w-0 flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <Link
                    to={`/tasks/${task.id}`}
                    className="min-w-0 break-words font-semibold text-action-link hover:underline"
                  >
                    {task.title}
                  </Link>
                  <TaskMetadata task={task} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3">
              <EmptyState title="No tasks assigned to you yet." />
            </div>
          ))}
      </section>
      {import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true' && <DashboardDemo />}
    </div>
  );
}
