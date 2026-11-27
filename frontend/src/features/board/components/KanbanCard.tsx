import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { Task, TaskStatus } from '@/features/task/types/task.types';
import { boardColumns } from '../types/board.types';

interface Props {
  task: Task;
  canMove: boolean;
  pending: boolean;
  index: number;
  count: number;
  onMove: (status: TaskStatus, position?: number) => void;
  onDrag: (task: Task | null) => void;
  onDrop: () => void;
  acceptsDrop: boolean;
}

export function KanbanCard({
  task,
  canMove,
  pending,
  index,
  count,
  onMove,
  onDrag,
  onDrop,
  acceptsDrop,
}: Props) {
  const enabled = canMove && !pending;
  return (
    <li
      className="space-y-2 rounded border bg-[var(--card)] p-3"
      draggable={enabled}
      onDragStart={(event) => {
        if (!enabled) return;
        event.dataTransfer.setData('text/plain', task.id);
        event.dataTransfer.effectAllowed = 'move';
        onDrag(task);
      }}
      onDragEnd={() => onDrag(null)}
      onDragOver={(event) => {
        if (acceptsDrop) event.preventDefault();
      }}
      onDrop={(event) => {
        if (!acceptsDrop) return;
        event.preventDefault();
        event.stopPropagation();
        onDrop();
      }}
    >
      <Link to={`/tasks/${task.id}`} className="block break-words font-medium underline">
        {task.title}
      </Link>
      <p className="text-xs">
        {task.priority}
        {task.dueDate ? ` · ${task.dueDate.slice(0, 10)}` : ''}
      </p>
      {canMove && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`move-${task.id}`}>
            Move {task.title} to column
          </label>
          <select
            id={`move-${task.id}`}
            value={task.status}
            disabled={pending}
            className="rounded border px-2 py-1 text-xs"
            onChange={(event) => onMove(event.currentTarget.value as TaskStatus)}
          >
            {boardColumns.map(({ status, label }) => (
              <option key={status} value={status}>
                {label}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending || index === 0}
            aria-label={`Move ${task.title} up`}
            onClick={() => onMove(task.status, index - 1)}
          >
            ↑
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending || index === count - 1}
            aria-label={`Move ${task.title} down`}
            onClick={() => onMove(task.status, index + 1)}
          >
            ↓
          </Button>
        </div>
      )}
    </li>
  );
}
