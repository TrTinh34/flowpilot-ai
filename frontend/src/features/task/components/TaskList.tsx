import { useId, useState } from 'react';
import { CheckSquare, FolderKanban, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import type { Task } from '../types/task.types';
import { taskPriorities, taskStatusLabels } from '../types/task.types';
import { TaskMetadata } from './TaskMetadata';

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
  const searchId = useId();
  const statusId = useId();
  const priorityId = useId();
  const summaryId = useId();
  const visible = tasks.filter(
    (task) =>
      (!status || task.status === status) &&
      (!priority || task.priority === priority) &&
      task.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );

  return (
    <section aria-label="Task list" className="space-y-4">
      <div
        className="grid gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end"
        aria-describedby={summaryId}
      >
        <div className="grid min-w-0 gap-1.5">
          <Label htmlFor={searchId} className="text-xs font-medium text-muted-foreground">
            Search this page
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id={searchId}
              name="search"
              type="search"
              placeholder="Filter by task title…"
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:contents">
          <div className="grid min-w-0 gap-1.5 sm:min-w-[9rem]">
            <Label htmlFor={statusId} className="text-xs font-medium text-muted-foreground">
              Status
            </Label>
            <Select
              id={statusId}
              name="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              {Object.entries(taskStatusLabels).map(([value, name]) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid min-w-0 gap-1.5 sm:min-w-[9rem]">
            <Label htmlFor={priorityId} className="text-xs font-medium text-muted-foreground">
              Priority
            </Label>
            <Select
              id={priorityId}
              name="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="">All priorities</option>
              {taskPriorities.map((value) => (
                <option key={value} value={value}>
                  {value[0] + value.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <p id={summaryId} className="text-caption tabular-nums" role="status">
        {visible.length} of {tasks.length} tasks on this page
      </p>
      {visible.length > 0 ? (
        <ul className="divide-y divide-border rounded-[var(--radius-md)] border border-border bg-card">
          {visible.map((task) => {
            const assigneeName = task.assigneeId
              ? (assignees?.get(task.assigneeId) ?? 'Assigned member')
              : 'Unassigned';
            return (
              <li
                key={task.id}
                className="flex min-w-0 flex-col gap-2.5 px-4 py-3.5 transition-colors duration-[var(--duration-ui)] hover:bg-muted/40 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="block break-words text-sm font-semibold text-foreground transition-colors hover:text-action-link hover:underline"
                  >
                    {task.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {showProject && (
                      <Link
                        to={`/projects/${task.projectId}`}
                        className="inline-flex items-center gap-1 font-medium text-action-link hover:underline"
                        aria-label={`Open project for ${task.title}`}
                      >
                        <FolderKanban className="size-3.5" aria-hidden="true" />
                        Open project
                      </Link>
                    )}
                    {assignees && (
                      <span className="inline-flex items-center gap-1.5">
                        {task.assigneeId && <Avatar name={assigneeName} size="xs" />}
                        <span>{assigneeName}</span>
                      </span>
                    )}
                  </div>
                </div>
                <TaskMetadata task={task} />
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          compact
          icon={CheckSquare}
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
