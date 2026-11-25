import { useQuery } from '@tanstack/react-query';
import { extractApiErrorMessage, fetchBackendHealth } from '@/services/api-client';

export function InitStatusPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['backend-health'],
    queryFn: fetchBackendHealth,
    retry: false,
  });

  const backendConnectionStatus = isLoading
    ? 'Loading'
    : isError
      ? 'Connection Failed'
      : 'Connected';

  const databaseConnectionStatus = isLoading
    ? 'Loading'
    : isError
      ? 'Unavailable'
      : data?.services.database === 'up'
        ? 'Connected (up)'
        : 'Connection Failed (down)';

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-12">
      <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs">
        <h1 className="text-2xl font-bold tracking-tight">FlowPilot AI</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Development Environment Initialization Check
        </p>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-md bg-[var(--muted)] px-4 py-3">
            <dt className="font-medium">Frontend Status</dt>
            <dd className="font-semibold">Ready</dd>
          </div>

          <div className="flex items-center justify-between rounded-md bg-[var(--muted)] px-4 py-3">
            <dt className="font-medium">Backend Connection Status</dt>
            <dd className="font-semibold">{backendConnectionStatus}</dd>
          </div>

          <div className="flex items-center justify-between rounded-md bg-[var(--muted)] px-4 py-3">
            <dt className="font-medium">Database Connection Status</dt>
            <dd className="font-semibold">{databaseConnectionStatus}</dd>
          </div>
        </dl>

        {isError ? (
          <p className="mt-4 text-xs text-red-600">{extractApiErrorMessage(error)}</p>
        ) : null}

        <div className="mt-6">
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] disabled:opacity-50"
          >
            {isFetching ? 'Checking...' : 'Re-check Health'}
          </button>
        </div>
      </section>
    </main>
  );
}
