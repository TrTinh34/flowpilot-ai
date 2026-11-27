import type { ReactNode } from 'react';
import { cn } from '@/utils/cn.util';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'ai';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'border-border bg-muted text-muted-foreground',
  primary: 'border-action/25 bg-action/10 text-action-link',
  success:
    'border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--success-text)]',
  info: 'border-[var(--color-info-border)] bg-[var(--color-info-bg)] text-[var(--info-text)]',
  warning:
    'border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--warning-text)]',
  danger:
    'border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-error-text)]',
  ai: 'border-[var(--ai-border)] bg-[var(--ai-bg)] text-[var(--ai-text)]',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
