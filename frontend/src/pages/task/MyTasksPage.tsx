import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { Button } from '@/components/ui/button';
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
      <Link to="/" className="underline">
        Home
      </Link>
      <h1 className="text-2xl font-semibold">My Tasks</h1>
      {tasks.isPending && <p role="status">Loading tasks…</p>}
      {tasks.isError && <p role="alert">{extractApiErrorMessage(tasks.error)}</p>}
      {tasks.data &&
        (tasks.data.data.length ? (
          <TaskLinks tasks={tasks.data.data} />
        ) : (
          <p>No assigned tasks on this page.</p>
        ))}
      <div className="flex gap-2">
        <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={!tasks.data || tasks.data.data.length < tasks.data.size}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </main>
  );
}
