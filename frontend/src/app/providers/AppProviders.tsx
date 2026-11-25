import type { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  );
}
