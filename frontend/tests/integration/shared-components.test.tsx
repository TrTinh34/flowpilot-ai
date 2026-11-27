import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { createProject, listProjects } from '@/features/project/api/project.api';
import { listMyTasks } from '@/features/task/api/task.api';
import { listWorkspaceMembers } from '@/features/workspace/api/workspace.api';
import { ProjectsPage } from '@/pages/project/ProjectsPage';
import { MyTasksPage } from '@/pages/task/MyTasksPage';

vi.mock('@/features/project/api/project.api');
vi.mock('@/features/task/api/task.api');
vi.mock('@/features/workspace/api/workspace.api');

const workspace = { id: 'workspace', name: 'Studio', role: 'OWNER' as const };
const manager = { userId: 'manager', role: 'MEMBER' as const, user: { displayName: 'Alex' } };

function show(path: string, element: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/workspaces/:workspaceId/projects" element={element} />
          <Route path="/my-tasks" element={element} />
          <Route path="/projects/:projectId" element={<h1>Project details</h1>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(listWorkspaceMembers).mockResolvedValue({ workspace, data: [manager] });
  vi.mocked(listProjects).mockResolvedValue({ data: [], page: 0, size: 20 });
});

it('opens the project dialog by keyboard and restores focus on Escape', async () => {
  const user = userEvent.setup();
  show('/workspaces/workspace/projects', <ProjectsPage />);
  const trigger = await screen.findByRole('button', { name: 'Create project' });
  trigger.focus();
  await user.keyboard('{Enter}');
  const dialog = await screen.findByRole('dialog', { name: 'Create project' });
  expect(within(dialog).getByRole('textbox', { name: 'Project name' })).toHaveFocus();
  await user.tab({ shift: true });
  expect(within(dialog).getByRole('button', { name: 'Close dialog' })).toHaveFocus();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(trigger).toHaveFocus());
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('guards repeated submits and preserves the draft when project creation fails', async () => {
  const user = userEvent.setup();
  let rejectCreate!: (reason: Error) => void;
  vi.mocked(createProject).mockReturnValueOnce(
    new Promise((_, reject) => {
      rejectCreate = reject;
    }),
  );
  vi.mocked(createProject).mockResolvedValueOnce({
    id: 'new-project',
    name: 'Release plan',
    workspaceId: workspace.id,
    status: 'ACTIVE',
  });
  show('/workspaces/workspace/projects', <ProjectsPage />);
  await user.click(await screen.findByRole('button', { name: 'Create project' }));
  const dialog = within(await screen.findByRole('dialog'));
  const input = dialog.getByRole('textbox', { name: 'Project name' });
  const select = dialog.getByRole('combobox', { name: 'Project manager' });
  await user.type(input, 'Release plan');
  await user.selectOptions(select, manager.userId);
  await user.click(dialog.getByRole('button', { name: 'Create project' }));
  const busy = dialog.getByRole('button', { name: 'Creating…' });
  expect(busy).toBeDisabled();
  fireEvent.submit(busy.closest('form')!);
  await user.keyboard('{Escape}');
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(createProject).toHaveBeenCalledTimes(1);
  rejectCreate(new Error('Project could not be saved.'));
  expect(await dialog.findByRole('alert')).toHaveTextContent('Project could not be saved.');
  expect(input).toHaveValue('Release plan');
  expect(select).toHaveValue(manager.userId);
  await user.click(dialog.getByRole('button', { name: 'Create project' }));
  expect(await screen.findByRole('heading', { name: 'Project details' })).toBeInTheDocument();
  expect(createProject).toHaveBeenLastCalledWith(workspace.id, {
    name: 'Release plan',
    managerId: manager.userId,
  });
});

it('keeps loading, API failure, and empty tasks separate and retries the actual query', async () => {
  const user = userEvent.setup();
  vi.mocked(listMyTasks).mockRejectedValueOnce(new Error('Internal error'));
  vi.mocked(listMyTasks).mockResolvedValueOnce({ data: [], page: 0, size: 20 });
  show('/my-tasks', <MyTasksPage />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading assigned tasks');
  expect(await screen.findByRole('alert')).toHaveTextContent('Internal error');
  expect(screen.queryByText('No assigned tasks on this page.')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Retry' }));
  expect(
    await screen.findByRole('heading', { name: 'No assigned tasks on this page.' }),
  ).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument();
  expect(vi.mocked(listMyTasks).mock.calls).toEqual([[0], [0]]);
});

it('shows project status in text and hides Create project for members', async () => {
  vi.mocked(listWorkspaceMembers).mockResolvedValue({
    workspace: { ...workspace, role: 'MEMBER' },
    data: [],
  });
  vi.mocked(listProjects).mockResolvedValue({
    data: [{ id: 'existing', name: 'Launch', workspaceId: workspace.id, status: 'ARCHIVED' }],
    page: 0,
    size: 20,
  });
  show('/workspaces/workspace/projects', <ProjectsPage />);
  const card = (await screen.findByRole('link', { name: 'Launch' })).closest('li')!;
  expect(within(card).getByText('Archived')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Projects · Studio' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Create project' })).not.toBeInTheDocument();
});
