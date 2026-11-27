export function LoadingState({ label }: { label: string }) {
  return (
    <div
      role="status"
      className="space-y-3 rounded-[var(--radius-md)] border border-border bg-card p-4"
    >
      <span className="sr-only">{label}</span>
      <div className="space-y-3 motion-safe:animate-pulse" aria-hidden="true">
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-4/5 rounded bg-muted" />
      </div>
    </div>
  );
}
