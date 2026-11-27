import { CheckCircle2, Circle, CircleDot, Clock } from 'lucide-react';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { taskStatusLabels, type TaskStatus } from '@/features/task/types/task.types';

const STATUS_META: Record<TaskStatus, { tone: BadgeTone; icon: typeof Circle }> = {
  TODO: { tone: 'neutral', icon: Circle },
  IN_PROGRESS: { tone: 'info', icon: CircleDot },
  IN_REVIEW: { tone: 'warning', icon: Clock },
  DONE: { tone: 'success', icon: CheckCircle2 },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { tone, icon: Icon } = STATUS_META[status];
  return (
    <Badge tone={tone}>
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      <span>{taskStatusLabels[status]}</span>
    </Badge>
  );
}
