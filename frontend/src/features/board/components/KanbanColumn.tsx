import type { Task, TaskStatus } from '@/features/task/types/task.types';
import { cn } from '@/utils/cn.util';
import { KanbanCard } from './KanbanCard';

const STATUS_DOTS: Record<TaskStatus, string> = {
  TODO: 'bg-[var(--foreground-muted)]',
  IN_PROGRESS: 'bg-[var(--color-info)]',
  IN_REVIEW: 'bg-[var(--color-warning)]',
  DONE: 'bg-[var(--color-success)]',
};

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  canMove: (task: Task) => boolean;
  pending: boolean;
  canDrop: boolean;
  dropTarget: string | null;
  assignees?: ReadonlyMap<string, string>;
  onColumnDragOver: () => void;
  onColumnDragLeave: () => void;
  onColumnDrop: () => void;
  onCardDragOver: (taskId: string) => void;
  onCardDrag: (task: Task | null) => void;
  onCardDrop: (taskId: string) => void;
  onMove: (task: Task, target: TaskStatus, position?: number) => void;
}

export function KanbanColumn({
  status,
  label,
  tasks,
  canMove,
  pending,
  canDrop,
  dropTarget,
  assignees,
  onColumnDragOver,
  onColumnDragLeave,
  onColumnDrop,
  onCardDragOver,
  onCardDrag,
  onCardDrop,
  onMove,
}: KanbanColumnProps) {
  return (
    <section
      aria-label={label}
      className="flex min-h-64 min-w-0 flex-col rounded-[var(--radius-md)] border border-border bg-muted/60 p-3 transition-colors data-[drop-target=true]:border-action data-[drop-target=true]:ring-1 data-[drop-target=true]:ring-action"
      data-drop-target={dropTarget === status}
      onDragOver={(event) => {
        if (canDrop) {
          event.preventDefault();
          onColumnDragOver();
        }
      }}
      onDragLeave={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          onColumnDragLeave();
        }
      }}
      onDrop={(event) => {
        if (!canDrop) return;
        event.preventDefault();
        onColumnDrop();
      }}
    >
      <header className="mb-3 flex items-center justify-between gap-2 px-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={cn('size-2 shrink-0 rounded-full', STATUS_DOTS[status])}
          />
          <h2 className="truncate text-sm font-semibold text-foreground">{label}</h2>
        </div>
        <span className="rounded-full border border-border bg-card px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {tasks.length}
        </span>
      </header>
      {tasks.length === 0 ? (
        <div className="grid flex-1 place-items-center rounded-[var(--radius)] border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          No tasks
        </div>
      ) : (
        <ul className="space-y-2.5">
          {tasks.map((task, index) => (
            <KanbanCard
              key={task.id}
              task={task}
              index={index}
              count={tasks.length}
              canMove={canMove(task)}
              pending={pending}
              acceptsDrop={canDrop}
              assigneeName={task.assigneeId ? assignees?.get(task.assigneeId) : undefined}
              dropTarget={dropTarget === task.id}
              onDragOver={() => onCardDragOver(task.id)}
              onDrag={onCardDrag}
              onDrop={() => onCardDrop(task.id)}
              onMove={(target, position) => onMove(task, target, position)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
