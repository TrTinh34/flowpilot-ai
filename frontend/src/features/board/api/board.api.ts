import { apiClient } from '@/services/api-client';
import { listProjectTasks } from '@/features/task/api/task.api';
import type { Task, TaskStatus } from '@/features/task/types/task.types';

export async function loadBoardTasks(projectId: string): Promise<Task[]> {
  const tasks = new Map<string, Task>();
  for (let page = 0; ; page++) {
    const result = await listProjectTasks(projectId, page, 100);
    for (const task of result.data) tasks.set(task.id, task);
    if (result.data.length < result.size) return [...tasks.values()];
  }
}

export async function moveBoardTask(input: {
  taskId: string;
  status: TaskStatus;
  position: number;
  version: number;
}) {
  const { taskId, ...body } = input;
  const { data } = await apiClient.patch<{ data: Task }>(`/tasks/${taskId}/move`, body);
  return data.data;
}
