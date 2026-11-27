import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { Task, TaskStatus } from '@/features/task/types/task.types';
import { TaskMetadata } from '@/features/task/components/TaskMetadata';
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
  dropTarget: boolean;
  onDragOver: () => void;
  assigneeName?: string;
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
  dropTarget,
  onDragOver,
  assigneeName,
}: Props) {
  const enabled = canMove && !pending;
  const resolvedAssignee = assigneeName ?? (task.assigneeId ? 'Assigned member' : 'Unassigned');

  return (
    <li
      className="min-w-0 space-y-2.5 rounded-[var(--radius-md)] border border-border bg-card p-3 shadow-xs transition-colors duration-[var(--duration-ui)] hover:border-control-border/60 data-[drop-target=true]:border-action data-[drop-target=true]:ring-2 data-[drop-target=true]:ring-action"
      data-drop-target={dropTarget}
      draggable={enabled}
      onDragStart={(event) => {
        if (!enabled) return;
        event.dataTransfer.setData('text/plain', task.id);
        event.dataTransfer.effectAllowed = 'move';
        onDrag(task);
      }}
      onDragEnd={() => onDrag(null)}
      onDragOver={(event) => {
        if (acceptsDrop) {
          event.preventDefault();
          event.stopPropagation();
          onDragOver();
        }
      }}
      onDrop={(event) => {
        if (!acceptsDrop) return;
        event.preventDefault();
        event.stopPropagation();
        onDrop();
      }}
    >
      <div className="flex items-start gap-1.5">
        {canMove && (
          <GripVertical
            className="mt-0.5 size-3.5 shrink-0 cursor-grab text-muted-foreground"
            aria-hidden="true"
          />
        )}
        <Link
          to={`/tasks/${task.id}`}
          className="min-w-0 flex-1 break-words text-sm font-semibold leading-snug text-foreground transition-colors hover:text-action-link hover:underline"
        >
          {task.title}
        </Link>
      </div>
      <TaskMetadata task={task} showStatus={false} />
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {task.assigneeId && <Avatar name={resolvedAssignee} size="xs" />}
        <span className="min-w-0 truncate">{resolvedAssignee}</span>
      </div>
      {canMove && (
        <div className="flex flex-nowrap items-center gap-1.5 border-t border-border pt-2">
          <label className="sr-only" htmlFor={`move-${task.id}`}>
            Move {task.title} to column
          </label>
          <Select
            id={`move-${task.id}`}
            name={`move-${task.id}`}
            controlSize="sm"
            value={task.status}
            disabled={pending}
            className="min-w-0 flex-1"
            onChange={(event) => onMove(event.currentTarget.value as TaskStatus)}
          >
            {boardColumns.map(({ status, label }) => (
              <option key={status} value={status}>
                {label}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            disabled={pending || index === 0}
            aria-label={`Move ${task.title} up`}
            onClick={() => onMove(task.status, index - 1)}
          >
            <ArrowUp aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            disabled={pending || index === count - 1}
            aria-label={`Move ${task.title} down`}
            onClick={() => onMove(task.status, index + 1)}
          >
            <ArrowDown aria-hidden="true" />
          </Button>
        </div>
      )}
    </li>
  );
}
