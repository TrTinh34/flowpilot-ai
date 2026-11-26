import { apiClient } from '@/services/api-client';

export type ProjectStatus = 'ACTIVE' | 'ARCHIVED';
export type ProjectRole = 'MANAGER' | 'MEMBER';
export type Project = { id: string; workspaceId: string; name: string; status: ProjectStatus };
export type ProjectMember = { userId: string; role: ProjectRole; user: { displayName: string } };

export async function listProjects(workspaceId: string, page: number) {
  const { data } = await apiClient.get<{ data: Project[]; page: number; size: number }>(
    `/workspaces/${workspaceId}/projects`,
    { params: { page } },
  );
  return data;
}

export async function createProject(
  workspaceId: string,
  input: { name: string; managerId: string },
) {
  const { data } = await apiClient.post<{ data: Project }>(
    `/workspaces/${workspaceId}/projects`,
    input,
  );
  return data.data;
}

export async function getProjectMembers(projectId: string) {
  const { data } = await apiClient.get<{
    project: Project;
    data: ProjectMember[];
    canManage: boolean;
    canAssignManager: boolean;
  }>(`/projects/${projectId}/members`);
  return data;
}

export async function updateProject(
  projectId: string,
  input: { name: string; status: ProjectStatus },
) {
  await apiClient.patch(`/projects/${projectId}`, input);
}

export async function addProjectMember(
  projectId: string,
  input: { userId: string; role: ProjectRole },
) {
  await apiClient.post(`/projects/${projectId}/members`, input);
}
