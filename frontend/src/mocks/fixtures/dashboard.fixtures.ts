/** Mock dashboard data — used when VITE_USE_MOCK_API=true or backend not ready */

export interface DashboardStats {
  totalTasks: number;
  byStatus: { status: string; count: number }[];
  completionRate: number;
  activeProjects: number;
}

export interface ActivityEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  createdAt: string;
}

export const mockDashboardStats: DashboardStats = {
  totalTasks: 24,
  byStatus: [
    { status: 'TODO', count: 8 },
    { status: 'IN_PROGRESS', count: 7 },
    { status: 'IN_REVIEW', count: 4 },
    { status: 'DONE', count: 5 },
  ],
  completionRate: 21,
  activeProjects: 3,
};

export const mockActivity: ActivityEntry[] = [
  {
    id: 'a1',
    user: 'Alice',
    action: 'created task',
    target: 'Set up CI pipeline',
    createdAt: '2026-11-27T08:30:00Z',
  },
  {
    id: 'a2',
    user: 'Bob',
    action: 'moved task to IN_REVIEW',
    target: 'User auth API',
    createdAt: '2026-11-27T09:15:00Z',
  },
  {
    id: 'a3',
    user: 'Alice',
    action: 'completed task',
    target: 'Database schema',
    createdAt: '2026-11-27T10:00:00Z',
  },
  {
    id: 'a4',
    user: 'Charlie',
    action: 'commented on',
    target: 'Kanban board drag',
    createdAt: '2026-11-26T17:45:00Z',
  },
  {
    id: 'a5',
    user: 'Bob',
    action: 'created task',
    target: 'Write API tests',
    createdAt: '2026-11-26T16:20:00Z',
  },
];
