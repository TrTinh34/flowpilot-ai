import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/app/store/auth.store';
import * as api from '@/features/workspace/api/workspace.api';
import { AcceptInvitePage } from '@/pages/workspace/AcceptInvitePage';
import { WorkspaceSettingsPage } from '@/pages/workspace/WorkspaceSettingsPage';

vi.mock('@/features/workspace/api/workspace.api');
afterEach(() => {
  vi.resetAllMocks();
  useAuthStore.getState().clearAuth();
});

it('allows an owner to invite and see the local invitation link', async () => {
  const workspace = { id: 'workspace', name: 'Studio', role: 'OWNER' as const };
  useAuthStore
    .getState()
    .setAuth('fixture', 60, { id: 'owner', displayName: 'Alex', email: 'alex@example.test' });
  vi.mocked(api.listWorkspaces).mockResolvedValue({ data: [workspace], page: 0, size: 20 });
  vi.mocked(api.listWorkspaceMembers).mockResolvedValue({
    workspace,
    data: [{ userId: 'owner', user: { displayName: 'Alex' }, role: 'OWNER' }],
  });
  vi.mocked(api.sendInvitation).mockResolvedValue({
    previewUrl: 'http://localhost:5173/invitations/accept#token=fixture',
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <WorkspaceSettingsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
  const user = userEvent.setup();
  expect(await screen.findByText('Transfer ownership before leaving.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Leave workspace' })).not.toBeInTheDocument();
  await user.click(await screen.findByRole('button', { name: 'Invite member' }));
  expect(await screen.findByRole('option', { name: 'Admin' })).toBeInTheDocument();
  await user.type(await screen.findByLabelText('Invite email'), 'guest@example.test');
  await user.click(screen.getByRole('button', { name: 'Send invitation' }));
  expect(api.sendInvitation).toHaveBeenCalledWith(workspace.id, 'guest@example.test', 'MEMBER');
  expect(await screen.findByRole('link', { name: /local invitation link/i })).toHaveAttribute(
    'href',
    'http://localhost:5173/invitations/accept#token=fixture',
  );
});

it('keeps the invitation draft when the API rejects it', async () => {
  const workspace = { id: 'workspace', name: 'Studio', role: 'ADMIN' as const };
  vi.mocked(api.listWorkspaces).mockResolvedValue({ data: [workspace], page: 0, size: 20 });
  vi.mocked(api.listWorkspaceMembers).mockResolvedValue({ workspace, data: [] });
  vi.mocked(api.sendInvitation).mockRejectedValue(new Error('Invitation already pending.'));
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <WorkspaceSettingsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
  const user = userEvent.setup();
  await user.click(await screen.findByRole('button', { name: 'Invite member' }));
  const dialog = within(screen.getByRole('dialog'));
  expect(dialog.queryByRole('option', { name: 'Admin' })).not.toBeInTheDocument();
  const field = dialog.getByLabelText('Invite email');
  await user.type(field, 'guest@example.test');
  await user.click(dialog.getByRole('button', { name: 'Send invitation' }));
  expect(await dialog.findByRole('alert')).toHaveTextContent('Invitation already pending.');
  expect(field).toHaveValue('guest@example.test');
});

it('gives regular members only their own leave action and requires confirmation', async () => {
  useAuthStore
    .getState()
    .setAuth('fixture', 60, { id: 'self', displayName: 'Sam', email: 'sam@example.test' });
  const workspace = { id: 'workspace', name: 'Studio', role: 'MEMBER' as const };
  vi.mocked(api.listWorkspaces).mockResolvedValue({ data: [workspace], page: 0, size: 20 });
  vi.mocked(api.listWorkspaceMembers).mockResolvedValue({
    workspace,
    data: [
      { userId: 'self', user: { displayName: 'Sam' }, role: 'MEMBER' },
      { userId: 'owner', user: { displayName: 'Alex' }, role: 'OWNER' },
    ],
  });
  vi.mocked(api.removeWorkspaceMember).mockResolvedValue();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <WorkspaceSettingsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
  const user = userEvent.setup();
  const leave = await screen.findByRole('button', { name: 'Leave workspace' });
  expect(screen.queryByRole('button', { name: 'Invite member' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Remove member' })).not.toBeInTheDocument();
  await user.click(leave);
  await user.keyboard('{Escape}');
  expect(leave).toHaveFocus();
  expect(api.removeWorkspaceMember).not.toHaveBeenCalled();
  await user.click(leave);
  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', { name: 'Leave workspace' }),
  );
  expect(api.removeWorkspaceMember).toHaveBeenCalledWith(workspace.id, 'self');
});

it('explains that an expired invitation needs a new link', async () => {
  vi.mocked(api.acceptInvitation).mockRejectedValue({
    isAxiosError: true,
    response: {
      data: { code: 'INVALID_INVITATION', message: 'Invitation is invalid or expired.' },
    },
  });
  render(
    <MemoryRouter initialEntries={['/invitations/accept#token=fixture']}>
      <AcceptInvitePage />
    </MemoryRouter>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Accept invitation' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Ask a workspace administrator for a new link.',
  );
});

it('accepts a token from the invitation fragment and opens the joined workspace', async () => {
  vi.mocked(api.acceptInvitation).mockResolvedValue({ workspaceId: 'joined' });
  render(
    <MemoryRouter initialEntries={['/invitations/accept#token=fixture']}>
      <Routes>
        <Route path="/invitations/accept" element={<AcceptInvitePage />} />
        <Route path="/workspaces" element={<p>Joined workspace</p>} />
      </Routes>
    </MemoryRouter>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Accept invitation' }));
  expect(api.acceptInvitation).toHaveBeenCalledWith('fixture');
  expect(await screen.findByText('Joined workspace')).toBeInTheDocument();
});
