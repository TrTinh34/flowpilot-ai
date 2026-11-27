import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckSquare } from 'lucide-react';
import { useAuthStore } from '@/app/store/auth.store';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { listMyTasks } from '@/features/task/api/task.api';
import { TaskList } from './TaskList';
import { extractApiErrorMessage } from '@/services/api-client';

export function MyTasks() {
  const revision = useAuthStore((state) => state.sessionRevision);
  const [page, setPage] = useState(0);
  const tasks = useQuery({
    queryKey: ['my-tasks', revision, page],
    queryFn: () => listMyTasks(page),
  });
  return (
    <div className="w-full min-w-0 space-y-6 px-page-gutter py-6">
      <PageHeader title="My Tasks" description="Tasks assigned to you across your projects." />
      {tasks.isPending && <LoadingState label="Loading assigned tasks" variant="list" />}
      {tasks.isError && (
        <ErrorState
          title="Could not load assigned tasks"
          message={extractApiErrorMessage(tasks.error)}
          onRetry={() => void tasks.refetch()}
        />
      )}
      {tasks.isSuccess &&
        (tasks.data.data.length ? (
          <TaskList tasks={tasks.data.data} showProject />
        ) : (
          <EmptyState
            icon={CheckSquare}
            title="No assigned tasks on this page."
            description="Tasks assigned to you appear here."
          />
        ))}
      <Pagination
        page={page}
        hasNext={tasks.isSuccess && tasks.data.data.length >= tasks.data.size}
        onPageChange={setPage}
      />
    </div>
  );
}
