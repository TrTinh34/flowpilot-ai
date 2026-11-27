import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/app/store/auth.store';
import { useUiStore } from '@/app/store/ui.store';
import { useWorkspaceStore } from '@/app/store/workspace.store';
import { getProjectMembers } from '@/features/project/api/project.api';
import { getTask } from '@/features/task/api/task.api';
import { listWorkspaces } from '@/features/workspace/api/workspace.api';
import { AppShellLayout } from '@/layouts/AppShellLayout';

vi.mock('@/features/workspace/api/workspace.api');
vi.mock('@/features/project/api/project.api');
vi.mock('@/features/task/api/task.api');

function Shell() {
  const navigate = useNavigate();
  return (
    <AppShellLayout>
      <button onClick={() => void navigate(-1)}>Go back</button>
      <Outlet />
    </AppShellLayout>
  );
}

function show(path: string, client = new QueryClient()) {
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
            <Route path="/my-tasks" element={<h1>Assigned tasks</h1>} />
            <Route path="/workspaces/:workspaceId/projects" element={<h1>Workspace projects</h1>} />
            <Route path="/projects/:projectId/board" element={<h1>Project board</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
  useWorkspaceStore.getState().clearActiveWorkspace();
  useUiStore.getState().setSidebarOpen(true);
  vi.mocked(listWorkspaces).mockResolvedValue({
    data: [
      { id: 'studio', name: 'Studio', role: 'OWNER' },
      { id: 'lab', name: 'Lab', role: 'MEMBER' },
    ],
    page: 0,
    size: 20,
  });
});

afterEach(() => vi.unstubAllGlobals());

it('keeps workspace breadcrumbs in sync when switching workspaces and going back', async () => {
  const user = userEvent.setup();
  show('/workspaces/studio/projects');
  const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' });
  const sidebar = within(screen.getByRole('complementary', { name: 'Sidebar' }));
  expect(await within(breadcrumb).findByRole('link', { name: 'Studio' })).toBeInTheDocument();
  await user.click(sidebar.getByRole('button', { name: /Switch workspace/i }));
  await user.click(await screen.findByRole('menuitemradio', { name: 'Lab' }));
  expect(await within(breadcrumb).findByRole('link', { name: 'Lab' })).toBeInTheDocument();
  expect(sidebar.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  expect(useWorkspaceStore.getState().activeWorkspaceId).toBe('lab');
  await user.click(screen.getByRole('button', { name: 'Go back' }));
  expect(await within(breadcrumb).findByRole('link', { name: 'Studio' })).toBeInTheDocument();
  expect(sidebar.getByRole('link', { name: 'Projects' })).toHaveAttribute(
    'href',
    '/workspaces/studio/projects',
  );
  expect(listWorkspaces).toHaveBeenCalledTimes(1);
});

it('keeps a single main landmark and exposes a working skip link and accessible collapsed rail', async () => {
  const user = userEvent.setup();
  show('/my-tasks');
  const main = screen.getByRole('main');
  await user.click(screen.getByRole('link', { name: 'Skip to content' }));
  expect(main).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
  expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  expect(screen.getByRole('link', { name: 'My Tasks' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('button', { name: /Switch workspace/i })).toBeInTheDocument();
});

it('restores drawer focus on Escape and closes on navigation without reopening on back', async () => {
  const user = userEvent.setup();
  show('/dashboard');
  const trigger = screen.getByRole('button', { name: 'Open navigation menu' });
  trigger.focus();
  await user.keyboard('{Enter}');
  let drawer = await screen.findByRole('dialog', { name: 'Navigation menu' });
  expect(within(drawer).getByRole('button', { name: 'Close navigation menu' })).toHaveFocus();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(trigger).toHaveFocus());
  await user.click(trigger);
  drawer = await screen.findByRole('dialog', { name: 'Navigation menu' });
  await user.click(within(drawer).getByRole('link', { name: 'My Tasks' }));
  expect(await screen.findByRole('heading', { name: 'Assigned tasks' })).toBeInTheDocument();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Go back' }));
  expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('uses the page-owned project cache for breadcrumbs and shortcuts without new API requests', async () => {
  const client = new QueryClient();
  client.setQueryData(['project-members', useAuthStore.getState().sessionRevision, 'release'], {
    project: { id: 'release', name: 'Release', workspaceId: 'studio', status: 'ACTIVE' },
  });
  show('/projects/release/board', client);
  const breadcrumb = within(screen.getByRole('navigation', { name: 'Breadcrumb' }));
  expect(await breadcrumb.findByRole('link', { name: 'Release' })).toBeInTheDocument();
  expect(breadcrumb.getByText('Board')).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('region', { name: 'Current project shortcuts' })).toBeInTheDocument();
  expect(getProjectMembers).not.toHaveBeenCalled();
  expect(getTask).not.toHaveBeenCalled();
});
