import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, FolderKanban, ListTodo } from 'lucide-react';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { taskStatusLabels, type TaskStatus } from '@/features/task/types/task.types';
import { loadDashboardDemo } from '../api/dashboard-demo';
import { StatCard } from './StatCard';

const panel = 'min-w-0 rounded-[var(--radius-md)] border border-border bg-card p-4 sm:p-5';

const STATUS_BAR_COLORS: Record<TaskStatus, string> = {
  TODO: 'bg-[var(--foreground-muted)]',
  IN_PROGRESS: 'bg-[var(--color-info)]',
  IN_REVIEW: 'bg-[var(--color-warning)]',
  DONE: 'bg-[var(--color-success)]',
};

export function DashboardDemo() {
  const demo = useQuery({
    queryKey: ['dashboard-demo'],
    queryFn: loadDashboardDemo,
    staleTime: Infinity,
  });
  const data = demo.data;
  return (
    <section aria-labelledby="demo-dashboard" className="space-y-4 border-t border-border pt-6">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="demo-dashboard" className="text-section-title">
            Workspace overview
          </h2>
          <Badge tone="ai">Demo</Badge>
        </div>
        <p className="text-secondary">
          Sample metrics, deadlines and activity for a demo workspace.
        </p>
      </div>
      {demo.isPending && <LoadingState label="Loading demo overview" variant="cards" />}
      {demo.isError && (
        <ErrorState
          title="Could not load the demo overview"
          message="Try loading the sample workspace again."
          onRetry={() => void demo.refetch()}
        />
      )}
      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total tasks" value={data.total} icon={ListTodo} />
            <StatCard
              label="In progress"
              value={data.inProgress}
              icon={Clock}
              toneClass="bg-[var(--color-info-bg)] text-[var(--info-text)]"
            />
            <StatCard
              label="Completed"
              value={data.completed}
              icon={CheckCircle2}
              toneClass="bg-[var(--color-success-bg)] text-[var(--success-text)]"
            />
            <StatCard label="Active projects" value={data.projectCount} icon={FolderKanban} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <section className={panel}>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-section-title">Task progress</h3>
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {data.completionRate}% completed
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {data.byStatus.map(({ status, count }) => (
                  <li key={status} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-foreground">
                        {taskStatusLabels[status]}
                      </span>
                      <span className="tabular-nums text-muted-foreground">{count}</span>
                    </div>
                    <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all duration-[var(--duration-ui)] ${STATUS_BAR_COLORS[status]}`}
                        style={{ width: `${data.total ? (count / data.total) * 100 : 0}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <section className={panel}>
              <h3 className="text-section-title">Demo deadlines</h3>
              <ul className="mt-3 divide-y divide-border">
                {data.due.map(({ title, due }) => (
                  <li
                    key={title}
                    className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm"
                  >
                    <span className="break-words font-medium text-foreground">{title}</span>
                    <time
                      className="tabular-nums text-xs text-muted-foreground"
                      dateTime={due ?? undefined}
                    >
                      {due}
                    </time>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <section className={panel}>
            <h3 className="text-section-title">Recent demo activity</h3>
            <ul className="mt-3 divide-y divide-border">
              {data.activity.slice(0, 4).map(({ title, status, updatedAt }) => (
                <li
                  key={title}
                  className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="break-words font-medium text-foreground">{title}</span>
                    <StatusBadge status={status} />
                  </div>
                  <time className="tabular-nums text-xs text-muted-foreground" dateTime={updatedAt}>
                    {updatedAt}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </section>
  );
}
