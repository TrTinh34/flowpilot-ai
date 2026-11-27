import { apiClient } from '@/services/api-client';
import type { Task, TaskDetail, TaskFields, TaskPage } from '../types/task.types';

export async function listProjectTasks(projectId: string, page: number) {
  const { data } = await apiClient.get<TaskPage>(`/projects/${projectId}/tasks`, {
    params: { page },
  });
  return data;
}

export async function listMyTasks(page: number) {
  const { data } = await apiClient.get<TaskPage>('/me/tasks', { params: { page } });
  return data;
}

export async function getTask(taskId: string) {
  const { data } = await apiClient.get<{ data: TaskDetail }>(`/tasks/${taskId}`);
  return data.data;
}

export async function createTask(projectId: string, fields: TaskFields & { parentId?: string }) {
  const { data } = await apiClient.post<{ data: Task }>(`/projects/${projectId}/tasks`, fields);
  return data.data;
}

export async function updateTask(taskId: string, fields: TaskFields & { version: number }) {
  const { data } = await apiClient.patch<{ data: Task }>(`/tasks/${taskId}`, fields);
  return data.data;
}
