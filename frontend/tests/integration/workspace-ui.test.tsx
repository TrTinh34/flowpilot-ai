import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import * as api from '@/features/workspace/api/workspace.api';
import { AcceptInvitePage } from '@/pages/workspace/AcceptInvitePage';
import { WorkspaceSettingsPage } from '@/pages/workspace/WorkspaceSettingsPage';

vi.mock('@/features/workspace/api/workspace.api');

it('allows an owner to invite and see the local invitation link', async () => {
  const workspace = { id: 'workspace', name: 'Studio', role: 'OWNER' as const };
  vi.mocked(api.listWorkspaces).mockResolvedValue({ data: [workspace], page: 0, size: 20 });
  vi.mocked(api.listWorkspaceMembers).mockResolvedValue({ workspace, data: [] });
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
  await user.type(await screen.findByLabelText('Invite email'), 'guest@example.test');
  await user.click(screen.getByRole('button', { name: 'Invite' }));
  expect(api.sendInvitation).toHaveBeenCalledWith(workspace.id, 'guest@example.test', 'MEMBER');
  expect(await screen.findByRole('link', { name: /local invitation link/i })).toHaveAttribute(
    'href',
    'http://localhost:5173/invitations/accept#token=fixture',
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
