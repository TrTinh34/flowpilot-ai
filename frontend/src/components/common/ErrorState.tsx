import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <section className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] p-4">
      <div role="alert" className="flex items-start gap-2.5 text-[var(--color-error-text)]">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0 space-y-1">
          <h2 className="font-semibold leading-snug">{title}</h2>
          <p className="break-words text-sm">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </section>
  );
}
