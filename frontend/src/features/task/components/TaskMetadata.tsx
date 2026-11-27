import { Badge } from '@/components/ui/badge';
import { taskStatusLabels, type Task } from '../types/task.types';

export function TaskMetadata({ task, showStatus = true }: { task: Task; showStatus?: boolean }) {
  const priority = task.priority.toLowerCase();
  const due = task.dueDate?.slice(0, 10);
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {showStatus && (
        <Badge tone={task.status === 'DONE' ? 'success' : 'neutral'}>
          {taskStatusLabels[task.status]}
        </Badge>
      )}
      <span
        className={
          task.priority === 'URGENT' ? 'text-[var(--color-error-text)]' : 'text-muted-foreground'
        }
      >
        Priority: <span className="capitalize">{priority}</span>
      </span>
      {due && (
        <time className="text-muted-foreground" dateTime={due}>
          Due {due}
        </time>
      )}
    </div>
  );
}
