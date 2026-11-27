import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/app/store/auth.store';
import { listMyTasks } from '@/features/task/api/task.api';
import { Link } from 'react-router-dom';
import { mockDashboardStats, mockActivity } from '@/mocks/fixtures/dashboard.fixtures';
import { Clock, CheckSquare, Layers, TrendingUp } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  TODO:        'bg-slate-200',
  IN_PROGRESS: 'bg-blue-400',
  IN_REVIEW:   'bg-yellow-400',
  DONE:        'bg-green-400',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function DashboardPage() {
  const revision = useAuthStore((s) => s.sessionRevision);
  const { data: myTasks, isPending } = useQuery({
    queryKey: ['my-tasks', revision, 0],
    queryFn: () => listMyTasks(0),
  });

  const stats = mockDashboardStats;
  const activity = mockActivity;
  const topTasks = myTasks?.data.slice(0, 5) ?? [];

  return (
    <div className="px-6 py-8 space-y-8 max-w-6xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Overview of your workspace activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Tasks', value: stats.totalTasks, icon: Layers, color: 'text-[var(--color-primary)]' },
          { label: 'In Progress', value: stats.byStatus.find(s => s.status === 'IN_PROGRESS')?.count ?? 0, icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Completed', value: stats.byStatus.find(s => s.status === 'DONE')?.count ?? 0, icon: CheckSquare, color: 'text-green-500' },
          { label: 'Active Projects', value: stats.activeProjects, icon: Clock, color: 'text-yellow-500' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--foreground-secondary)]">{card.label}</p>
              <card.icon className={`size-4 ${card.color}`} aria-hidden="true" />
            </div>
            <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Task status breakdown + My Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status breakdown */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Task Status</h2>
          <p className="text-xs text-[var(--foreground-muted)] mb-4">Mock data — backend dashboard API coming soon</p>
          <div className="space-y-3">
            {stats.byStatus.map((s) => (
              <div key={s.status} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground-secondary)]">
                    {s.status.replace('_', ' ')}
                  </span>
                  <span className="font-medium text-[var(--foreground)]">{s.count}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--surface-secondary)]">
                  <div
                    className={`h-full rounded-full ${STATUS_COLOR[s.status] ?? 'bg-slate-300'}`}
                    style={{ width: `${(s.count / stats.totalTasks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Tasks */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--foreground)]">My Tasks</h2>
            <Link
              to="/my-tasks"
              className="text-xs text-[var(--color-primary)] hover:underline"
            >
              View all →
            </Link>
          </div>
          {isPending && (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 rounded-md bg-[var(--surface-secondary)] animate-pulse" />
              ))}
            </div>
          )}
          {!isPending && topTasks.length === 0 && (
            <p className="text-sm text-[var(--foreground-muted)]">No tasks assigned to you yet.</p>
          )}
          <ul className="space-y-2">
            {topTasks.map((task) => (
              <li key={task.id}>
                <Link
                  to={`/tasks/${task.id}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--surface-secondary)] transition-colors"
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${STATUS_COLOR[task.status] ?? 'bg-slate-300'}`}
                    aria-label={task.status}
                  />
                  <span className="flex-1 truncate text-sm text-[var(--foreground)]">
                    {task.title}
                  </span>
                  {task.dueDate && (
                    <span className="shrink-0 text-[11px] text-[var(--foreground-muted)]">
                      {task.dueDate.slice(0, 10)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Recent Activity</h2>
        <p className="text-xs text-[var(--foreground-muted)] mb-4">Mock data — audit log API coming soon</p>
        <ul className="divide-y divide-[var(--border)]">
          {activity.map((entry) => (
            <li key={entry.id} className="flex items-start gap-3 py-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-secondary)] text-[11px] font-semibold text-[var(--foreground-secondary)]">
                {entry.user[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--foreground)]">
                  <span className="font-medium">{entry.user}</span>{' '}
                  <span className="text-[var(--foreground-secondary)]">{entry.action}</span>{' '}
                  <span className="font-medium">{entry.target}</span>
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-[var(--foreground-muted)]">
                {timeAgo(entry.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
