import type {
  TaskDetailEntity,
  TaskEntity,
  TaskPriority,
  TaskStatus,
} from '../../domain/entities/task.entity.js';

export type TaskDto = TaskEntity;
export type TaskDetailDto = TaskDetailEntity;

export interface MoveTaskInput {
  taskId: string;
  actorId: string;
  status: TaskStatus;
  position: number;
  version: number;
}

export interface ListProjectTasksInput {
  projectId: string;
  actorId: string;
  page: number;
  size: number;
}

export interface CreateTaskInput {
  projectId: string;
  actorId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  parentId?: string | null;
  assigneeId?: string | null;
  dueDate?: Date | null;
}

export interface GetTaskDetailInput {
  taskId: string;
  actorId: string;
}

export interface UpdateTaskInput {
  taskId: string;
  actorId: string;
  version: number;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: Date | null;
}

export interface ListMyTasksInput {
  actorId: string;
  page: number;
  size: number;
}

export interface PaginatedTasksDto {
  data: TaskDto[];
  page: number;
  size: number;
}
