import { useQuery } from '@tanstack/react-query';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Badge } from '@/components/ui/badge';
import { taskStatusLabels } from '@/features/task/types/task.types';
import { loadDashboardDemo } from '../api/dashboard-demo';
import { StatCard } from './StatCard';

const panel = 'min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5';

export function DashboardDemo() {
  const demo = useQuery({
    queryKey: ['dashboard-demo'],
    queryFn: loadDashboardDemo,
    staleTime: Infinity,
  });
  const data = demo.data;
  return (
    <section aria-labelledby="demo-dashboard" className="space-y-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="demo-dashboard" className="text-section-title">
            Workspace overview
          </h2>
          <Badge tone="neutral">Demo</Badge>
        </div>
        <p className="text-secondary">
          Sample metrics, deadlines and activity for a demo workspace.
        </p>
      </div>
      {demo.isPending && <LoadingState label="Loading demo overview" />}
      {demo.isError && (
        <ErrorState
          title="Could not load the demo overview"
          message="Try loading the sample workspace again."
          onRetry={() => void demo.refetch()}
        />
      )}
      {data && (
        <>
          <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total tasks" value={data.total} />
            <StatCard label="In progress" value={data.inProgress} />
            <StatCard label="Completed" value={data.completed} />
            <StatCard label="Active projects" value={data.projectCount} />
          </dl>
          <div className="grid gap-4 lg:grid-cols-2">
            <section className={panel}>
              <h3 className="text-section-title">Task progress</h3>
              <p className="mb-4 text-secondary">{data.completionRate}% completed</p>
              <ul className="space-y-3">
                {data.byStatus.map(({ status, count }) => (
                  <li key={status} className="space-y-1">
                    <div className="flex justify-between gap-2">
                      <span>{taskStatusLabels[status]}</span>
                      <span>{count}</span>
                    </div>
                    <div aria-hidden="true" className="h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
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
                  <li key={title} className="flex flex-wrap justify-between gap-2 py-2">
                    <span className="break-words">{title}</span>
                    <time className="text-secondary" dateTime={due ?? undefined}>
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
                <li key={title} className="flex flex-wrap justify-between gap-2 py-2">
                  <span className="break-words">
                    {title} <span className="text-secondary">· {taskStatusLabels[status]}</span>
                  </span>
                  <time className="text-secondary" dateTime={updatedAt}>
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
