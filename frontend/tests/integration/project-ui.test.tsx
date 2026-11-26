import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import * as api from '@/features/project/api/project.api';
import { ProjectSettingsPage } from '@/pages/project/ProjectSettingsPage';

vi.mock('@/features/project/api/project.api');

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
  expect(screen.getByText('Fixture Manager · MANAGER')).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: /save changes|add member|archive project/i }),
  ).not.toBeInTheDocument();
});
