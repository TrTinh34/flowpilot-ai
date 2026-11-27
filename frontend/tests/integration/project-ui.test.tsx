import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import * as api from '@/features/project/api/project.api';
import * as workspaceApi from '@/features/workspace/api/workspace.api';
import { ProjectSettingsPage } from '@/pages/project/ProjectSettingsPage';
import { ProjectsPage } from '@/pages/project/ProjectsPage';

vi.mock('@/features/project/api/project.api');
vi.mock('@/features/workspace/api/workspace.api');

it('archives only after confirmation and refreshes the read-only state', async () => {
  const active = {
    project: { id: 'fixture', workspaceId: 'studio', name: 'Release', status: 'ACTIVE' as const },
    data: [],
    canManage: true,
    canAssignManager: true,
  };
  vi.mocked(api.getProjectMembers).mockResolvedValue(active);
  vi.mocked(workspaceApi.listWorkspaceMembers).mockResolvedValue({
    workspace: { id: 'studio', name: 'Studio', role: 'OWNER' },
    data: [],
  });
  vi.mocked(api.updateProject).mockImplementationOnce(async () => {
    vi.mocked(api.getProjectMembers).mockResolvedValue({
      ...active,
      project: { ...active.project, status: 'ARCHIVED' },
    });
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={['/projects/fixture']}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectSettingsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
  const user = userEvent.setup();
  await user.click(await screen.findByRole('button', { name: 'Archive project' }));
  await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }));
  expect(api.updateProject).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Archive project' }));
  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', { name: 'Archive project' }),
  );
  expect(await screen.findByText('Archived · read-only')).toBeInTheDocument();
  expect(api.updateProject).toHaveBeenCalledWith('fixture', {
    name: 'Release',
    status: 'ARCHIVED',
  });
});

it('shows an archived project and its members without editing controls', async () => {
  vi.mocked(api.getProjectMembers).mockResolvedValue({
    project: { id: 'fixture', workspaceId: 'studio', name: 'Archive', status: 'ARCHIVED' },
    data: [{ userId: 'manager', role: 'MANAGER', user: { displayName: 'Fixture Manager' } }],
    canManage: true,
    canAssignManager: true,
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={['/projects/fixture']}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectSettingsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
  expect(await screen.findByText('Archived · read-only')).toBeInTheDocument();
  expect(screen.getByText('Fixture Manager')).toBeInTheDocument();
  expect(screen.getByText('Manager', { exact: true })).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: /save changes|add member|archive project/i }),
  ).not.toBeInTheDocument();
});

it('filters the loaded project page by name and status and resets the empty result', async () => {
  vi.mocked(workspaceApi.listWorkspaceMembers).mockResolvedValue({
    workspace: { id: 'studio', name: 'Studio', role: 'MEMBER' },
    data: [],
  });
  vi.mocked(api.listProjects).mockResolvedValue({
    page: 0,
    size: 20,
    data: [
      { id: 'current', workspaceId: 'studio', name: 'Release planning', status: 'ACTIVE' },
      { id: 'old', workspaceId: 'studio', name: 'Release archive', status: 'ARCHIVED' },
    ],
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={['/workspaces/studio/projects']}>
        <Routes>
          <Route path="/workspaces/:workspaceId/projects" element={<ProjectsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
  const user = userEvent.setup();
  await user.type(await screen.findByRole('searchbox', { name: 'Search this page' }), 'archive');
  expect(screen.getByRole('link', { name: 'Release archive' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Release planning' })).not.toBeInTheDocument();
  await user.selectOptions(screen.getByLabelText('Project status'), 'ACTIVE');
  expect(screen.getByText('No matching projects.')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Clear filters' }));
  expect(screen.getByRole('link', { name: 'Board for Release planning' })).toHaveAttribute(
    'href',
    '/projects/current/board',
  );
  expect(screen.queryByRole('button', { name: 'Create project' })).not.toBeInTheDocument();
  expect(api.listProjects).toHaveBeenCalledWith('studio', 0);
});
