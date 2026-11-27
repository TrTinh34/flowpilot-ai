import { Link } from 'react-router-dom';
import type { Task } from '../types/task.types';

export function TaskLinks({ tasks }: { tasks: Task[] }) {
  return (
    <ul className="grid gap-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded border p-3"
        >
          <Link to={`/tasks/${task.id}`} className="break-all font-medium underline">
            {task.title}
          </Link>
          <span className="text-sm">
            {task.status.replaceAll('_', ' ')} · {task.priority}
            {task.dueDate ? ` · ${task.dueDate.slice(0, 10)}` : ''}
          </span>
        </li>
      ))}
    </ul>
  );
}
