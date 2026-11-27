import { taskStatusLabels, type TaskStatus } from '@/features/task/types/task.types';

export async function loadDashboardDemo() {
  if (!import.meta.env.DEV) return null;
  const { demoProjects, demoTasks } = await import('@/mocks/fixtures/dashboard.fixtures');
  const activeProjects = new Set(demoProjects.filter(({ active }) => active).map(({ id }) => id));
  const tasks = demoTasks.filter(({ projectId }) => activeProjects.has(projectId));
  const byStatus = (Object.keys(taskStatusLabels) as TaskStatus[]).map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }));
  const completed = byStatus.find(({ status }) => status === 'DONE')?.count ?? 0;
  const inProgress = byStatus.find(({ status }) => status === 'IN_PROGRESS')?.count ?? 0;
  return {
    total: tasks.length,
    completed,
    inProgress,
    projectCount: activeProjects.size,
    byStatus,
    completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    due: tasks
      .filter(({ due, status }) => due && status !== 'DONE')
      .sort((a, b) => (a.due ?? '').localeCompare(b.due ?? '')),
    activity: [...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  };
}
