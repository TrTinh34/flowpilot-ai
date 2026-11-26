import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn.util';

interface FormErrorBannerProps {
  message: string | null | undefined;
  className?: string;
}

/**
 * Form-level API error banner.
 * Renders only when `message` is truthy.
 * Uses role="alert" so screen readers announce it immediately.
 */
export function FormErrorBanner({ message, className }: FormErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-start gap-2.5 rounded-md border px-3.5 py-3',
        'border-[var(--color-error-border)] bg-[var(--color-error-bg)]',
        className,
      )}
    >
      <AlertCircle
        className="mt-0.5 size-4 shrink-0 text-[var(--color-error-text)]"
        aria-hidden="true"
      />
      <p className="text-sm leading-snug text-[var(--color-error-text)]">{message}</p>
    </div>
  );
}
