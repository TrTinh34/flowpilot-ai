import { apiClient } from '@/services/api-client';

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type Workspace = { id: string; name: string; role: WorkspaceRole };
export type WorkspaceMember = {
  userId: string;
  role: WorkspaceRole;
  user: { displayName: string };
};

export async function listWorkspaces(page: number) {
  const { data } = await apiClient.get<{ data: Workspace[]; page: number; size: number }>(
    '/workspaces',
    { params: { page } },
  );
  return data;
}

export async function createWorkspace(name: string) {
  const { data } = await apiClient.post<{ data: Workspace }>('/workspaces', { name });
  return data.data;
}

export async function listWorkspaceMembers(workspaceId: string) {
  const { data } = await apiClient.get<{ data: WorkspaceMember[]; workspace: Workspace }>(
    `/workspaces/${workspaceId}/members`,
  );
  return data;
}

export async function sendInvitation(workspaceId: string, email: string, role: 'ADMIN' | 'MEMBER') {
  const { data } = await apiClient.post<{ data: { previewUrl?: string } }>(
    `/workspaces/${workspaceId}/invitations`,
    { email, role },
  );
  return data.data;
}

export async function acceptInvitation(token: string) {
  const { data } = await apiClient.post<{ data: { workspaceId: string } }>('/invitations/accept', {
    token,
  });
  return data.data;
}

export async function changeWorkspaceRole(
  workspaceId: string,
  userId: string,
  role: 'ADMIN' | 'MEMBER',
) {
  await apiClient.patch(`/workspaces/${workspaceId}/members/${userId}`, { role });
}

export async function removeWorkspaceMember(workspaceId: string, userId: string) {
  await apiClient.delete(`/workspaces/${workspaceId}/members/${userId}`);
}

export async function transferWorkspace(workspaceId: string, userId: string) {
  await apiClient.post(`/workspaces/${workspaceId}/transfer`, { userId });
}
