import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommentSection } from '@/features/collaboration/components/CommentSection';
import { AttachmentUploader } from '@/features/collaboration/components/AttachmentUploader';
import { getProjectMembers } from '@/features/project/api/project.api';
import { extractApiErrorMessage } from '@/services/api-client';
import { createTask, getTask, updateTask } from '../api/task.api';
import type { TaskFields } from '../types/task.types';
import { TaskLinks } from './SubtaskList';
import { TaskForm } from './TaskForm';

export function TaskDetail({ taskId }: { taskId: string }) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const queryClient = useQueryClient();
  const [subtaskFormOpen, setSubtaskFormOpen] = useState(false);
  const task = useQuery({ queryKey: ['task', revision, taskId], queryFn: () => getTask(taskId) });
  const projectId = task.data?.projectId ?? '';
  const access = useQuery({
    queryKey: ['project-members', revision, projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: Boolean(projectId),
  });
  const canEdit = access.data?.canManage && access.data.project.status === 'ACTIVE';
  const canCollaborate = access.data?.project.status === 'ACTIVE';
  const members = access.data?.data ?? [];

  async function reconcile() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['task', revision] }),
      queryClient.invalidateQueries({ queryKey: ['project-tasks', revision, projectId] }),
      queryClient.invalidateQueries({ queryKey: ['my-tasks', revision] }),
    ]);
  }

  const edit = useMutation({
    mutationFn: (input: TaskFields & { version: number }) => updateTask(taskId, input),
    onSuccess: reconcile,
  });
  const addSubtask = useMutation({
    mutationFn: (input: TaskFields) => createTask(projectId, { ...input, parentId: taskId }),
    onSuccess: async () => {
      await reconcile();
      setSubtaskFormOpen(false);
    },
  });
  const conflict =
    axios.isAxiosError<{ code: string }>(edit.error) &&
    edit.error.response?.data?.code === 'TASK_VERSION_CONFLICT';

  if (task.isPending) {
    return (
      <div className="w-full min-w-0 px-page-gutter py-6">
        <LoadingState label="Loading task…" variant="detail" />
      </div>
    );
  }
  if (task.isError) {
    return (
      <div className="w-full min-w-0 px-page-gutter py-6">
        <ErrorState
          title="Could not load task"
          message={extractApiErrorMessage(task.error)}
          onRetry={() => void task.refetch()}
        />
      </div>
    );
  }

  const item = task.data;
  const assignee = members.find(({ userId }) => userId === item.assigneeId);
  const assigneeLabel =
    assignee?.user.displayName ?? (item.assigneeId ? 'Assigned member' : 'Unassigned');

  return (
    <div className="w-full min-w-0 space-y-6 px-page-gutter py-6">
      <PageHeader
        backLink={{ to: `/projects/${projectId}/tasks`, label: 'Back to project tasks' }}
        title={item.title}
        badge={<StatusBadge status={item.status} />}
      />

      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,21rem)]">
        <div className="min-w-0 space-y-5">
          {item.description && (
            <p className="whitespace-pre-wrap break-words rounded-[var(--radius-md)] border border-border bg-card p-4 text-sm leading-relaxed text-foreground">
              {item.description}
            </p>
          )}
          <Tabs defaultValue="details">
            <TabsList variant="line">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-5 pt-4">
              {access.isPending && <LoadingState label="Loading project permissions…" />}
              {access.isError && (
                <ErrorState
                  title="Could not load project permissions"
                  message={extractApiErrorMessage(access.error)}
                  onRetry={() => void access.refetch()}
                />
              )}
              {access.data?.project.status === 'ARCHIVED' && (
                <p className="rounded-[var(--radius)] border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
                  This project is archived and read-only.
                </p>
              )}
              {canEdit && (
                <section className="space-y-4 rounded-[var(--radius-md)] border border-border bg-card p-4 sm:p-5">
                  <h2 className="text-section-title">Edit task</h2>
                  <TaskForm
                    key={item.version}
                    initial={item}
                    members={members}
                    label="Save task"
                    pending={edit.isPending || conflict}
                    onSubmit={(fields) => edit.mutate({ ...fields, version: item.version })}
                  />
                  {conflict ? (
                    <div className="space-y-2.5 pt-1">
                      <FormErrorBanner message="This task was changed. Reload the latest version before saving again." />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={task.isFetching}
                        onClick={() => {
                          void task.refetch().then((result) => {
                            if (result.isSuccess) edit.reset();
                          });
                        }}
                      >
                        <RefreshCw aria-hidden="true" />
                        Reload task
                      </Button>
                    </div>
                  ) : (
                    <FormErrorBanner
                      message={edit.isError ? extractApiErrorMessage(edit.error) : undefined}
                    />
                  )}
                </section>
              )}

              {!item.parentId && (
                <section className="space-y-4 rounded-[var(--radius-md)] border border-border bg-card p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-section-title">Subtasks</h2>
                    {canEdit && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-expanded={subtaskFormOpen}
                        onClick={() => {
                          setSubtaskFormOpen((open) => !open);
                          addSubtask.reset();
                        }}
                      >
                        <Plus aria-hidden="true" />
                        {subtaskFormOpen ? 'Cancel' : 'New subtask'}
                      </Button>
                    )}
                  </div>
                  {item.subtasks.length ? (
                    <TaskLinks tasks={item.subtasks} />
                  ) : (
                    <EmptyState compact title="No subtasks yet." />
                  )}
                  {canEdit && subtaskFormOpen && (
                    <div className="space-y-3 border-t border-border pt-4">
                      <TaskForm
                        key={addSubtask.data?.id ?? 'create'}
                        members={members}
                        label="Add subtask"
                        pending={addSubtask.isPending}
                        onSubmit={(fields) => addSubtask.mutate(fields)}
                      />
                      <FormErrorBanner
                        message={
                          addSubtask.isError ? extractApiErrorMessage(addSubtask.error) : undefined
                        }
                      />
                    </div>
                  )}
                </section>
              )}
            </TabsContent>

            <TabsContent value="comments" className="pt-4">
              <CommentSection taskId={taskId} canWrite={canCollaborate} members={members} />
            </TabsContent>

            <TabsContent value="attachments" className="pt-4">
              <AttachmentUploader taskId={taskId} canWrite={canCollaborate} />
            </TabsContent>
          </Tabs>
        </div>

        <aside
          aria-label="Task metadata"
          className="order-first min-w-0 self-start rounded-[var(--radius-md)] border border-border bg-card p-4 lg:order-none"
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Properties
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <StatusBadge status={item.status} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground">Priority</dt>
              <dd>
                <PriorityBadge priority={item.priority} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground">Assignee</dt>
              <dd className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
                {item.assigneeId && <Avatar name={assigneeLabel} size="xs" />}
                <span className="truncate">{assigneeLabel}</span>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground">Due date</dt>
              <dd className="flex items-center gap-1 tabular-nums text-foreground">
                {item.dueDate ? (
                  <>
                    <Calendar className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    <time dateTime={item.dueDate.slice(0, 10)}>{item.dueDate.slice(0, 10)}</time>
                  </>
                ) : (
                  <span className="text-muted-foreground">No due date</span>
                )}
              </dd>
            </div>
            {item.parentId && (
              <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                <dt className="text-muted-foreground">Parent</dt>
                <dd>
                  <Link
                    to={`/tasks/${item.parentId}`}
                    className="font-medium text-action-link hover:underline"
                  >
                    Parent task
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </div>
    </div>
  );
}
