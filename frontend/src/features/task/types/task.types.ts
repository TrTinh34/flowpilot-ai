export const taskPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export type TaskPriority = (typeof taskPriorities)[number];
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export interface Task {
  id: string;
  projectId: string;
  parentId: string | null;
  assigneeId: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  position: number;
  version: number;
}

export type TaskDetail = Task & { subtasks: Task[] };
export type TaskFields = Pick<
  Task,
  'title' | 'description' | 'priority' | 'assigneeId' | 'dueDate'
>;
export type TaskPage = { data: Task[]; page: number; size: number };
