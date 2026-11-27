import type { TaskStatus } from '@/features/task/types/task.types';

export const demoProjects = [
  { id: 'launch', active: true },
  { id: 'platform', active: true },
  { id: 'prototype', active: false },
];

export const demoTasks: {
  projectId: string;
  title: string;
  status: TaskStatus;
  due: string | null;
  updatedAt: string;
}[] = [
  {
    projectId: 'launch',
    title: 'Prepare release notes',
    status: 'IN_PROGRESS',
    due: '2026-12-03',
    updatedAt: '2026-11-28',
  },
  {
    projectId: 'launch',
    title: 'Review onboarding copy',
    status: 'IN_REVIEW',
    due: '2026-12-04',
    updatedAt: '2026-11-27',
  },
  {
    projectId: 'platform',
    title: 'Plan the next sprint',
    status: 'TODO',
    due: '2026-12-07',
    updatedAt: '2026-11-26',
  },
  {
    projectId: 'launch',
    title: 'Validate release checklist',
    status: 'DONE',
    due: null,
    updatedAt: '2026-11-25',
  },
  {
    projectId: 'platform',
    title: 'Update API documentation',
    status: 'DONE',
    due: null,
    updatedAt: '2026-11-24',
  },
  {
    projectId: 'prototype',
    title: 'Publish prototype handoff',
    status: 'DONE',
    due: null,
    updatedAt: '2026-11-23',
  },
];
