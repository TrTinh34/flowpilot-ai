import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it } from 'vitest';
import { useAuthStore } from '@/app/store/auth.store';
import { ProfilePage } from '@/pages/settings/ProfilePage';

afterEach(() => {
  cleanup();
  useAuthStore.getState().clearAuth();
});

it('renders read-only user account details without duplication or fake edit controls', () => {
  useAuthStore.getState().setAuth('tok', 60, {
    id: 'user-1',
    displayName: 'Morgan Taylor',
    email: 'morgan.taylor.long.address@flowpilot.example.test',
  });
  render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
  expect(screen.getAllByText('Morgan Taylor')).toHaveLength(1);
  expect(screen.getAllByText('morgan.taylor.long.address@flowpilot.example.test')).toHaveLength(1);
  expect(screen.getByRole('link', { name: 'Workspace settings' })).toHaveAttribute(
    'href',
    '/workspaces',
  );
  expect(screen.getByRole('link', { name: 'My Tasks' })).toHaveAttribute('href', '/my-tasks');
  expect(screen.queryByText(/future release/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /edit|password|2fa/i })).not.toBeInTheDocument();
});
