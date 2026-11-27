export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TaskEntity {
  id: string;
  projectId: string;
  parentId: string | null;
  assigneeId: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  position: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDetailEntity extends TaskEntity {
  subtasks: TaskEntity[];
}

export interface ProjectTaskAccess {
  projectId: string;
  workspaceId: string;
  projectStatus: 'ACTIVE' | 'ARCHIVED';
  canRead: boolean;
  canWrite: boolean;
}
