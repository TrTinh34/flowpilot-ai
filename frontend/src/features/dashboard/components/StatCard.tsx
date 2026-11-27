import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn.util';

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  toneClass = 'text-action-link bg-muted',
}: {
  label: string;
  value: number;
  hint?: string;
  icon?: LucideIcon;
  toneClass?: string;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-card p-4">
      <div className="min-w-0 flex-1">
        <dl className="min-w-0">
          <dt className="truncate text-xs font-medium text-muted-foreground">{label}</dt>
          <dd className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </dd>
        </dl>
        {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
      {Icon && (
        <span
          aria-hidden="true"
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-[var(--radius)]',
            toneClass,
          )}
        >
          <Icon className="size-4" />
        </span>
      )}
    </div>
  );
}
