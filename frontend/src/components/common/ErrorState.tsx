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
      <div role="alert" className="space-y-1 text-[var(--color-error-text)]">
        <h2 className="font-semibold">{title}</h2>
        <p className="break-words text-sm">{message}</p>
      </div>
      {onRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </section>
  );
}
