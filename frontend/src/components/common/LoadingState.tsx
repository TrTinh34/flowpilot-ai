export type LoadingVariant = 'panel' | 'list' | 'cards' | 'board' | 'detail';

export function LoadingState({
  label,
  variant = 'panel',
}: {
  label: string;
  variant?: LoadingVariant;
}) {
  return (
    <div role="status" className="min-w-0">
      <span className="sr-only">{label}</span>
      {variant === 'cards' && (
        <div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 motion-safe:animate-pulse"
          aria-hidden="true"
        >
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="space-y-3 rounded-[var(--radius-md)] border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="size-9 rounded-[var(--radius)] bg-muted" />
                <div className="h-5 w-16 rounded-full bg-muted" />
              </div>
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      )}
      {variant === 'list' && (
        <div
          className="divide-y divide-border rounded-[var(--radius-md)] border border-border bg-card motion-safe:animate-pulse"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-3 w-1/4 rounded bg-muted" />
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-muted" />
                <div className="h-5 w-14 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}
      {variant === 'board' && (
        <div
          className="grid min-w-[60rem] grid-cols-4 gap-4 motion-safe:animate-pulse"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((col) => (
            <div
              key={col}
              className="space-y-3 rounded-[var(--radius-md)] border border-border bg-muted/60 p-3"
            >
              <div className="h-4 w-24 rounded bg-card" />
              <div className="h-24 rounded-[var(--radius-md)] bg-card" />
              <div className="h-24 rounded-[var(--radius-md)] bg-card" />
            </div>
          ))}
        </div>
      )}
      {variant === 'detail' && (
        <div
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,21rem)] motion-safe:animate-pulse"
          aria-hidden="true"
        >
          <div className="space-y-4 rounded-[var(--radius-md)] border border-border bg-card p-5">
            <div className="h-6 w-2/3 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-28 w-full rounded bg-muted" />
          </div>
          <div className="space-y-3 rounded-[var(--radius-md)] border border-border bg-card p-4">
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
        </div>
      )}
      {variant === 'panel' && (
        <div
          className="space-y-3 rounded-[var(--radius-md)] border border-border bg-card p-4 motion-safe:animate-pulse"
          aria-hidden="true"
        >
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-4/5 rounded bg-muted" />
        </div>
      )}
    </div>
  );
}
