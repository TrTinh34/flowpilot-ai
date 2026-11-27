import type { Task, TaskStatus } from '@/features/task/types/task.types';

export const boardColumns = [
  { status: 'TODO', label: 'To do' },
  { status: 'IN_PROGRESS', label: 'In progress' },
  { status: 'IN_REVIEW', label: 'In review' },
  { status: 'DONE', label: 'Done' },
] as const satisfies ReadonlyArray<{ status: TaskStatus; label: string }>;

export type BoardMove = (task: Task, status: TaskStatus, position: number) => void;
