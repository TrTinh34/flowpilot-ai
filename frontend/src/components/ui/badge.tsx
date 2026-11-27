import type { ReactNode } from 'react';
import { cn } from '@/utils/cn.util';

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success';
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium',
        tone === 'success'
          ? 'bg-[var(--color-success-bg)] text-[var(--success-text)]'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {children}
    </span>
  );
}
