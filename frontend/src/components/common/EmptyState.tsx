import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <section className="grid justify-items-start gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
      <Inbox className="size-5 text-muted-foreground" aria-hidden="true" />
      <h2 className="text-section-title">{title}</h2>
      {description && <p className="text-secondary">{description}</p>}
      {action}
    </section>
  );
}
