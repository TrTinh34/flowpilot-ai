import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { getProjectMembers } from '@/features/project/api/project.api';
import * as api from '@/features/task/api/task.api';
import { TaskDetailPage } from '@/pages/task/TaskDetailPage';
import type { TaskDetail } from '@/features/task/types/task.types';
import { MyTasksPage } from '@/pages/task/MyTasksPage';
import { ProjectTasksPage } from '@/pages/task/ProjectTasksPage';

vi.mock('@/features/task/api/task.api');
vi.mock('@/features/project/api/project.api');

const task: TaskDetail = {
  id: 'task',
  projectId: 'project',
  parentId: null,
  assigneeId: 'member',
  title: 'Plan release',
  description: '',
  priority: 'HIGH',
  status: 'TODO',
  dueDate: '2026-12-04T00:00:00.000Z',
  position: 0,
  version: 2,
  subtasks: [],
};

function show(path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/projects/:projectId/tasks" element={<ProjectTasksPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(api.getTask).mockResolvedValue(task);
  vi.mocked(getProjectMembers).mockResolvedValue({
    project: { id: 'project', workspaceId: 'workspace', name: 'Studio', status: 'ACTIVE' },
    data: [{ userId: 'member', role: 'MEMBER', user: { displayName: 'Alex' } }],
    canManage: true,
    canAssignManager: true,
  });
});

it('creates a project task and navigates to its detail', async () => {
  vi.mocked(api.listProjectTasks).mockResolvedValue({ data: [], page: 0, size: 20 });
  vi.mocked(api.createTask).mockResolvedValue(task);
  show('/projects/project/tasks');
  const user = userEvent.setup();
  await user.click(await screen.findByRole('button', { name: 'Create task' }));
  const dialog = within(await screen.findByRole('dialog'));
  await user.type(dialog.getByLabelText('Task title'), 'Plan release');
  await user.selectOptions(dialog.getByLabelText('Assignee'), 'member');
  await user.click(dialog.getByRole('button', { name: 'Create task' }));
  expect(api.createTask).toHaveBeenCalledWith(
    'project',
    expect.objectContaining({
      title: 'Plan release',
      assigneeId: 'member',
      priority: 'MEDIUM',
    }),
  );
  expect(await screen.findByRole('heading', { name: 'Plan release' })).toBeInTheDocument();
});

it('sends the original version, stops on conflict, and reloads before saving again', async () => {
  vi.mocked(api.updateTask).mockRejectedValueOnce({
    isAxiosError: true,
    response: { status: 409, data: { code: 'TASK_VERSION_CONFLICT' } },
  });
  show('/tasks/task');
  const user = userEvent.setup();
  const save = await screen.findByRole('button', { name: 'Save task' });
  await user.click(save);
  expect(api.updateTask).toHaveBeenCalledWith(
    'task',
    expect.objectContaining({
      version: 2,
      dueDate: '2026-12-04',
      assigneeId: 'member',
      priority: 'HIGH',
    }),
  );
  expect(await screen.findByRole('alert')).toHaveTextContent('Reload the latest version');
  expect(save).toBeDisabled();
  vi.mocked(api.getTask).mockResolvedValue({ ...task, title: 'Updated elsewhere', version: 3 });
  await user.click(screen.getByRole('button', { name: 'Reload task' }));
  expect(await screen.findByRole('heading', { name: 'Updated elsewhere' })).toBeInTheDocument();
  vi.mocked(api.updateTask).mockResolvedValue({ ...task, version: 4 });
  await user.click(screen.getByRole('button', { name: 'Save task' }));
  expect(api.updateTask).toHaveBeenLastCalledWith('task', expect.objectContaining({ version: 3 }));
});

it('creates a subtask with the route task as parent', async () => {
  vi.mocked(api.createTask).mockResolvedValue({ ...task, id: 'child', parentId: task.id });
  show('/tasks/task');
  const section = (await screen.findByRole('heading', { name: 'Subtasks' })).closest('section')!;
  const user = userEvent.setup();
  const form = within(section);
  await user.click(await form.findByRole('button', { name: 'New subtask' }));
  await user.type(await form.findByLabelText('Task title'), 'Review draft');
  await user.click(form.getByRole('button', { name: 'Add subtask' }));
  expect(api.createTask).toHaveBeenCalledWith(
    'project',
    expect.objectContaining({
      title: 'Review draft',
      parentId: 'task',
    }),
  );
});

it('shows assigned task links and supports an empty My Tasks page', async () => {
  vi.mocked(api.listMyTasks)
    .mockResolvedValueOnce({ data: [task], page: 0, size: 1 })
    .mockResolvedValueOnce({ data: [], page: 1, size: 1 });
  show('/my-tasks');
  expect(await screen.findByRole('link', { name: task.title })).toHaveAttribute(
    'href',
    '/tasks/task',
  );
  await userEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(await screen.findByText('No assigned tasks on this page.')).toBeInTheDocument();
});

it('reports forbidden task access without showing an edit form', async () => {
  vi.mocked(api.getTask).mockRejectedValueOnce({
    isAxiosError: true,
    response: { status: 403, data: { message: 'Insufficient task permissions.' } },
  });
  show('/tasks/task');
  expect(await screen.findByRole('alert')).toHaveTextContent('Insufficient task permissions.');
  expect(screen.queryByRole('button', { name: 'Save task' })).not.toBeInTheDocument();
});

it('filters assigned tasks within the loaded page and renders status and priority as text', async () => {
  vi.mocked(api.listMyTasks).mockResolvedValue({
    data: [
      task,
      {
        ...task,
        id: 'other',
        title: 'Close milestone',
        priority: 'LOW',
        status: 'DONE',
        dueDate: null,
      },
    ],
    page: 0,
    size: 20,
  });
  show('/my-tasks');
  const user = userEvent.setup();
  expect(await screen.findByRole('link', { name: 'Plan release' })).toBeInTheDocument();
  const list = within(screen.getByRole('region', { name: 'Task list' }));
  await user.selectOptions(list.getByLabelText('Status'), 'DONE');
  expect(list.getByText('1 of 2 tasks on this page')).toBeInTheDocument();
  expect(list.getByRole('link', { name: 'Close milestone' })).toBeInTheDocument();
  expect(list.queryByRole('link', { name: 'Plan release' })).not.toBeInTheDocument();
  await user.selectOptions(list.getByLabelText('Priority'), 'HIGH');
  expect(list.getByText('No matching tasks.')).toBeInTheDocument();
  await user.click(list.getByRole('button', { name: 'Clear filters' }));
  expect(list.getByText('Due 2026-12-04')).toBeInTheDocument();
  expect(api.listMyTasks).toHaveBeenCalledTimes(1);
});
