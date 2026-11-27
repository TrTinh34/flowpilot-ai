import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Task } from '../types/task.types';
import { taskPriorities, taskStatusLabels } from '../types/task.types';
import { TaskMetadata } from './TaskMetadata';

const selectClass = 'h-11 min-w-0 rounded-[var(--radius)] border border-input bg-card px-3';

export function TaskList({
  tasks,
  assignees,
  showProject = false,
}: {
  tasks: Task[];
  assignees?: ReadonlyMap<string, string>;
  showProject?: boolean;
}) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const summaryId = useId();
  const visible = tasks.filter(
    (task) =>
      (!status || task.status === status) &&
      (!priority || task.priority === priority) &&
      task.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );

  return (
    <section aria-label="Task list" className="space-y-4">
      <div className="flex flex-wrap items-end gap-3" aria-describedby={summaryId}>
        <label className="grid w-full gap-1 text-sm sm:max-w-xs">
          Search this page
          <Input type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <label className="grid min-w-0 gap-1 text-sm">
          Status
          <select
            className={selectClass}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            {Object.entries(taskStatusLabels).map(([value, name]) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-1 text-sm">
          Priority
          <select
            className={selectClass}
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="">All priorities</option>
            {taskPriorities.map((value) => (
              <option key={value} value={value}>
                {value[0] + value.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p id={summaryId} className="text-caption" role="status">
        {visible.length} of {tasks.length} tasks on this page
      </p>
      {visible.length > 0 ? (
        <ul className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-card">
          {visible.map((task) => (
            <li
              key={task.id}
              className="flex min-w-0 flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <Link
                  to={`/tasks/${task.id}`}
                  className="break-words font-semibold hover:text-action-link hover:underline"
                >
                  {task.title}
                </Link>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {showProject && (
                    <Link
                      to={`/projects/${task.projectId}`}
                      className="text-action-link underline"
                      aria-label={`Open project for ${task.title}`}
                    >
                      Open project
                    </Link>
                  )}
                  {assignees && (
                    <span>
                      {task.assigneeId
                        ? (assignees.get(task.assigneeId) ?? 'Assigned member')
                        : 'Unassigned'}
                    </span>
                  )}
                </div>
              </div>
              <TaskMetadata task={task} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No matching tasks."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setStatus('');
                setPriority('');
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </section>
  );
}
