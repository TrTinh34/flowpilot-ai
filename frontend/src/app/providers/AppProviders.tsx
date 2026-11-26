import type { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { SessionProvider } from '@/app/providers/SessionProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

/**
 * Root provider tree.
 *
 * Order matters:
 *   ErrorBoundary → QueryProvider → BrowserRouter → SessionProvider
 *
 * SessionProvider is inside BrowserRouter so it can trigger navigation
 * after session restoration (AUTH-10).
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>
          <SessionProvider>{children}</SessionProvider>
        </BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  );
}
