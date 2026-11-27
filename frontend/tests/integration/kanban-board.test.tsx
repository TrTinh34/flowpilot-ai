import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/app/store/auth.store';
import { loadBoardTasks, moveBoardTask } from '@/features/board/api/board.api';
import { getProjectMembers } from '@/features/project/api/project.api';
import type { Task } from '@/features/task/types/task.types';
import { ProjectBoardPage } from '@/pages/task/ProjectBoardPage';

vi.mock('@/features/board/api/board.api');
vi.mock('@/features/project/api/project.api');

const first: Task = {
  id: 'first',
  projectId: 'project',
  parentId: null,
  assigneeId: 'viewer',
  title: 'First task',
  description: '',
  priority: 'HIGH',
  status: 'TODO',
  dueDate: null,
  position: 0,
  version: 3,
};
const second: Task = {
  ...first,
  id: 'second',
  title: 'Second task',
  position: 1,
  assigneeId: null,
};
const project = {
  id: 'project',
  workspaceId: 'workspace',
  name: 'Studio',
  status: 'ACTIVE' as const,
};

function show() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/projects/project/board']}>
        <Routes>
          <Route path="/projects/:projectId/board" element={<ProjectBoardPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  useAuthStore.setState({
    user: { id: 'viewer', email: 'fixture@example.test', displayName: 'Fixture' },
  });
  vi.mocked(loadBoardTasks).mockResolvedValue([first, second]);
  vi.mocked(getProjectMembers).mockResolvedValue({
    project,
    data: [],
    canManage: true,
    canAssignManager: true,
  });
  vi.mocked(moveBoardTask).mockResolvedValue(first);
});

it('moves across columns through the labeled keyboard control and reflects server state', async () => {
  const moved: Task = { ...first, status: 'IN_PROGRESS', version: 4 };
  vi.mocked(loadBoardTasks)
    .mockResolvedValueOnce([first, second])
    .mockResolvedValue([moved, second]);
  show();
  await userEvent.selectOptions(
    await screen.findByLabelText('Move First task to column'),
    'IN_PROGRESS',
  );
  expect(moveBoardTask).toHaveBeenCalledWith({
    taskId: 'first',
    status: 'IN_PROGRESS',
    position: 0,
    version: 3,
  });
  await waitFor(() =>
    expect(
      within(screen.getByRole('region', { name: 'In progress' })).getByText('First task'),
    ).toBeVisible(),
  );
});

it('reorders a card before another card via drag and drop', async () => {
  show();
  const card = (await screen.findByRole('link', { name: 'Second task' })).closest('li')!;
  const target = screen.getByRole('link', { name: 'First task' }).closest('li')!;
  const dataTransfer = { setData: vi.fn() };
  fireEvent.dragStart(card, { dataTransfer });
  fireEvent.dragOver(target, { dataTransfer });
  fireEvent.drop(target, { dataTransfer });
  await waitFor(() =>
    expect(moveBoardTask).toHaveBeenCalledWith({
      taskId: 'second',
      status: 'TODO',
      position: 0,
      version: 3,
    }),
  );
});

it('downloads current board state after conflict and passes the new version on the next move', async () => {
  vi.mocked(loadBoardTasks)
    .mockResolvedValueOnce([first, second])
    .mockResolvedValue([
      { ...second, position: 0 },
      { ...first, position: 1, version: 8 },
    ]);
  vi.mocked(moveBoardTask).mockRejectedValueOnce({
    isAxiosError: true,
    response: { status: 409, data: { code: 'TASK_VERSION_CONFLICT' } },
  });
  show();
  const user = userEvent.setup();
  await user.click(await screen.findByRole('button', { name: 'Move First task down' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Review the latest order');
  await user.click(await screen.findByRole('button', { name: 'Move First task up' }));
  expect(moveBoardTask).toHaveBeenLastCalledWith({
    taskId: 'first',
    status: 'TODO',
    position: 0,
    version: 8,
  });
});

it('only shows move controls for tasks assigned to a Member', async () => {
  vi.mocked(getProjectMembers).mockResolvedValue({
    project,
    data: [],
    canManage: false,
    canAssignManager: false,
  });
  show();
  expect(await screen.findByLabelText('Move First task to column')).toBeVisible();
  expect(screen.queryByLabelText('Move Second task to column')).not.toBeInTheDocument();
});

it('renders an archived project without drag or move controls', async () => {
  vi.mocked(getProjectMembers).mockResolvedValue({
    project: { ...project, status: 'ARCHIVED' },
    data: [],
    canManage: true,
    canAssignManager: true,
  });
  show();
  expect(await screen.findByText(/archived and read-only/)).toBeVisible();
  const card = (await screen.findByRole('link', { name: 'First task' })).closest('li');
  expect(card).toHaveAttribute('draggable', 'false');
  expect(screen.queryByLabelText('Move First task to column')).not.toBeInTheDocument();
});
