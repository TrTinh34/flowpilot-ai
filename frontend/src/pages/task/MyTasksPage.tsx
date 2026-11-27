import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { listMyTasks } from '@/features/task/api/task.api';
import { TaskLinks } from '@/features/task/components/SubtaskList';
import { extractApiErrorMessage } from '@/services/api-client';

export function MyTasksPage() {
  const revision = useAuthStore((state) => state.sessionRevision);
  const [page, setPage] = useState(0);
  const tasks = useQuery({
    queryKey: ['my-tasks', revision, page],
    queryFn: () => listMyTasks(page),
  });
  return (
    <main className="mx-auto max-w-4xl space-y-5 px-5 py-10">
      <Link to="/" className="text-action-link underline">
        Home
      </Link>
      <PageHeader title="My Tasks" />
      {tasks.isPending && <LoadingState label="Loading assigned tasks" />}
      {tasks.isError && (
        <ErrorState
          title="Could not load assigned tasks"
          message={extractApiErrorMessage(tasks.error)}
          onRetry={() => void tasks.refetch()}
        />
      )}
      {tasks.isSuccess &&
        (tasks.data.data.length ? (
          <TaskLinks tasks={tasks.data.data} />
        ) : (
          <EmptyState
            title="No assigned tasks on this page."
            description="Tasks assigned to you appear here."
          />
        ))}
      <Pagination
        page={page}
        hasNext={tasks.isSuccess && tasks.data.data.length >= tasks.data.size}
        onPageChange={setPage}
      />
    </main>
  );
}
