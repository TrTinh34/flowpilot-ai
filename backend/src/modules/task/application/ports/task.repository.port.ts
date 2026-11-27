import type {
  ProjectTaskAccess,
  TaskDetailEntity,
  TaskEntity,
  TaskPriority,
} from '../../domain/entities/task.entity.js';

export interface CreateTaskRecordData {
  projectId: string;
  parentId: string | null;
  assigneeId: string | null;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Date | null;
  position: number;
}

export interface UpdateTaskRecordData {
  taskId: string;
  version: number;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: Date | null;
}

export interface TaskRepository {
  findProjectAccess(projectId: string, actorId: string): Promise<ProjectTaskAccess | null>;
  findTaskAccess(
    taskId: string,
    actorId: string,
  ): Promise<{ task: TaskDetailEntity; access: ProjectTaskAccess } | null>;
  listByProject(projectId: string, skip: number, take: number): Promise<TaskEntity[]>;
  findParentInProject(
    projectId: string,
    parentId: string,
  ): Promise<{ id: string; parentId: string | null } | null>;
  isProjectMember(projectId: string, userId: string): Promise<boolean>;
  getNextTodoPosition(projectId: string): Promise<number>;
  create(data: CreateTaskRecordData): Promise<TaskEntity>;
  updateWithVersion(data: UpdateTaskRecordData): Promise<TaskEntity | null>;
  listByAssignee(actorId: string, skip: number, take: number): Promise<TaskEntity[]>;
}
