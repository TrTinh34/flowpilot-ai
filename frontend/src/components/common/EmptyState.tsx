import type { ReactNode } from 'react';
import { Inbox, type LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn.util';

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
  compact = false,
  headingLevel = 'h2',
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: LucideIcon;
  compact?: boolean;
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  return (
    <section
      className={cn(
        'flex flex-col items-start gap-2.5 rounded-[var(--radius-md)] border border-border bg-card',
        compact ? 'p-4' : 'p-6',
      )}
    >
      <span className="grid size-9 place-items-center rounded-[var(--radius)] border border-border bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <Heading className={compact ? 'text-card-title font-semibold' : 'text-section-title'}>
          {title}
        </Heading>
        {description && <p className="text-secondary">{description}</p>}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </section>
  );
}
