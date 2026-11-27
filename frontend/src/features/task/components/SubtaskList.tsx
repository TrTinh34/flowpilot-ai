import { Link } from 'react-router-dom';
import type { Task } from '../types/task.types';
import { TaskMetadata } from './TaskMetadata';

export function TaskLinks({ tasks }: { tasks: Task[] }) {
  return (
    <ul className="divide-y divide-border rounded-[var(--radius)] border border-border">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex min-w-0 flex-col gap-2 px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between"
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
  );
}
