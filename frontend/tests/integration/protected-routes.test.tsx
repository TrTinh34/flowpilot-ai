import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from '@/app/router/ProtectedRoute';
import { useAuthStore } from '@/app/store/auth.store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resetStore(overrides?: Partial<ReturnType<typeof useAuthStore.getState>>) {
  useAuthStore.setState({
    accessToken: null,
    expiresAt: null,
    user: null,
    status: 'unauthenticated',
    ...overrides,
  });
}

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

/** Render helpers that set up MemoryRouter + QueryClientProvider */
function renderProtected(initialPath = '/dashboard') {
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function renderPublicOnly(initialPath = '/login') {
  return render(
    <QueryClientProvider client={makeQueryClient()}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<PublicOnlyRoute redirectTo="/dashboard" />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

// ─── ProtectedRoute ───────────────────────────────────────────────────────────

describe('ProtectedRoute', () => {
  beforeEach(() => resetStore());

  it('shows spinner while session is restoring (idle status)', () => {
    resetStore({ status: 'idle' });
    renderProtected();
    expect(screen.getByRole('status', { name: /restoring/i })).toBeInTheDocument();
  });

  it('shows spinner while session is restoring (restoring status)', () => {
    resetStore({ status: 'restoring' });
    renderProtected();
    expect(screen.getByRole('status', { name: /restoring/i })).toBeInTheDocument();
  });

  it('redirects to /login when unauthenticated', () => {
    resetStore({ status: 'unauthenticated' });
    renderProtected();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    resetStore({ status: 'authenticated', accessToken: 'tok_abc' });
    renderProtected();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('transitions from restoring to authenticated and renders children', async () => {
    resetStore({ status: 'restoring' });
    renderProtected();

    // Initially shows spinner
    expect(screen.getByRole('status', { name: /restoring/i })).toBeInTheDocument();

    // Simulate session restore completing
    useAuthStore.setState({ status: 'authenticated', accessToken: 'tok_abc' });

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    expect(screen.queryByRole('status', { name: /restoring/i })).not.toBeInTheDocument();
  });

  it('transitions from restoring to unauthenticated and redirects to /login', async () => {
    resetStore({ status: 'restoring' });
    renderProtected();

    expect(screen.getByRole('status', { name: /restoring/i })).toBeInTheDocument();

    // Simulate restore failure
    useAuthStore.setState({ status: 'unauthenticated', accessToken: null });

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });
});

// ─── PublicOnlyRoute ──────────────────────────────────────────────────────────

describe('PublicOnlyRoute', () => {
  beforeEach(() => resetStore());

  it('renders public content when unauthenticated', () => {
    resetStore({ status: 'unauthenticated' });
    renderPublicOnly();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to /dashboard when already authenticated', () => {
    resetStore({ status: 'authenticated', accessToken: 'tok_abc' });
    renderPublicOnly();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('shows spinner while restoring (does not prematurely redirect)', () => {
    resetStore({ status: 'restoring' });
    renderPublicOnly();
    expect(screen.getByRole('status', { name: /restoring/i })).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});

// ─── useLogout (behavior test via store) ─────────────────────────────────────

describe('logout behavior (store level)', () => {
  it('clearAuth transitions status to unauthenticated', () => {
    useAuthStore.setState({ status: 'authenticated', accessToken: 'tok', expiresAt: Date.now() + 90000, user: null });
    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState().status).toBe('unauthenticated');
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});

// Suppress console.error from React about act() — expected in some async tests
vi.spyOn(console, 'error').mockImplementation(() => {});
