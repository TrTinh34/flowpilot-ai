import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InitStatusPage } from '@/pages/InitStatusPage';
import { useAuthStore } from '@/app/store/auth.store';

function renderInitStatusPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <InitStatusPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('InitStatusPage', () => {
  beforeEach(() => {
    useAuthStore.setState({ status: 'unauthenticated', accessToken: null, user: null });
  });

  it('renders FlowPilot AI initialization page', () => {
    renderInitStatusPage();
    expect(screen.getByRole('heading', { name: 'FlowPilot AI' })).toBeInTheDocument();
    expect(screen.getByText('Frontend Status')).toBeInTheDocument();
    expect(screen.getByText('Backend Connection Status')).toBeInTheDocument();
    expect(screen.getByText('Database Connection Status')).toBeInTheDocument();
  });
});
