import { Calendar } from 'lucide-react';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/utils/cn.util';
import type { Task } from '../types/task.types';

export function TaskMetadata({ task, showStatus = true }: { task: Task; showStatus?: boolean }) {
  const due = task.dueDate?.slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  const overdue = Boolean(due && due < today && task.status !== 'DONE');

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {showStatus && <StatusBadge status={task.status} />}
      <PriorityBadge priority={task.priority} />
      {due && (
        <time
          dateTime={due}
          className={cn(
            'inline-flex items-center gap-1 tabular-nums',
            overdue ? 'font-medium text-[var(--color-error-text)]' : 'text-muted-foreground',
          )}
        >
          <Calendar className="size-3 shrink-0" aria-hidden="true" />
          <span>Due {due}</span>
        </time>
      )}
    </div>
  );
}
