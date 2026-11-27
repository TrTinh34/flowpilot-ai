import { AlertOctagon, ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import type { TaskPriority } from '@/features/task/types/task.types';
import { cn } from '@/utils/cn.util';

const PRIORITY_META: Record<
  TaskPriority,
  { label: string; tone: BadgeTone; icon: typeof Minus; extraClass?: string }
> = {
  LOW: { label: 'Low', tone: 'neutral', icon: ArrowDown },
  MEDIUM: { label: 'Medium', tone: 'warning', icon: Minus },
  HIGH: {
    label: 'High',
    tone: 'warning',
    icon: ArrowUp,
    extraClass:
      'border-[var(--priority-high-border)] bg-[var(--priority-high-bg)] text-[var(--priority-high-text)]',
  },
  URGENT: { label: 'Urgent', tone: 'danger', icon: AlertOctagon },
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { label, tone, icon: Icon, extraClass } = PRIORITY_META[priority];
  return (
    <Badge tone={tone} className={cn(extraClass)}>
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  );
}
