import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { listMyTasks } from '@/features/task/api/task.api';
import { listWorkspaces } from '@/features/workspace/api/workspace.api';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';

vi.mock('@/features/task/api/task.api');
vi.mock('@/features/workspace/api/workspace.api');

function show() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('DEV', true);
  vi.stubEnv('VITE_USE_MOCK_API', 'false');
  vi.mocked(listMyTasks).mockResolvedValue({ data: [], page: 0, size: 20 });
  vi.mocked(listWorkspaces).mockResolvedValue({
    data: [{ id: 'studio', name: 'Studio North', role: 'MEMBER' }],
    page: 0,
    size: 20,
  });
});

afterEach(() => vi.unstubAllEnvs());

it('shows live links and a genuine empty state with Demo disabled', async () => {
  show();
  expect(await screen.findByRole('link', { name: 'Projects' })).toHaveAttribute(
    'href',
    '/workspaces/studio/projects',
  );
  expect(screen.getByRole('link', { name: 'Open My Tasks' })).toHaveAttribute('href', '/my-tasks');
  expect(await screen.findByText('No tasks assigned to you yet.')).toBeVisible();
  expect(screen.queryByText('Total tasks')).not.toBeInTheDocument();
});

it('derives the labeled Demo overview from active projects without demo links', async () => {
  vi.stubEnv('VITE_USE_MOCK_API', 'true');
  show();
  const demo = within(screen.getByRole('region', { name: 'Workspace overview' }));
  expect(demo.getByText('Demo')).toBeVisible();
  expect(await demo.findByText('40% completed')).toBeVisible();
  for (const [label, count] of [
    ['Total tasks', '5'],
    ['In progress', '1'],
    ['Completed', '2'],
    ['Active projects', '2'],
  ]) {
    const term = demo.getAllByText(label).find((element) => element.tagName === 'DT');
    expect(term?.nextElementSibling).toHaveTextContent(count);
  }
  expect(demo.queryByText('Publish prototype handoff')).not.toBeInTheDocument();
  expect(demo.queryByRole('link')).not.toBeInTheDocument();
});

it('ignores the Demo flag outside development and retries a failed live request', async () => {
  vi.stubEnv('DEV', false);
  vi.stubEnv('VITE_USE_MOCK_API', 'true');
  vi.mocked(listWorkspaces).mockResolvedValue({ data: [], page: 0, size: 20 });
  vi.mocked(listMyTasks).mockRejectedValueOnce(new Error('Internal error'));
  show();
  expect(await screen.findByRole('alert')).toHaveTextContent('Internal error');
  expect(screen.queryByText('No tasks assigned to you yet.')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Workspaces' })).toHaveAttribute('href', '/workspaces');
  expect(screen.queryByText('Demo')).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(await screen.findByText('No tasks assigned to you yet.')).toBeVisible();
  expect(listMyTasks).toHaveBeenCalledTimes(2);
});
