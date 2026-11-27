import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
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

export function TaskDetailPage() {
  const { taskId = '' } = useParams();
  return <TaskDetail key={taskId} taskId={taskId} />;
}

function TaskDetail({ taskId }: { taskId: string }) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const queryClient = useQueryClient();
  const task = useQuery({ queryKey: ['task', revision, taskId], queryFn: () => getTask(taskId) });
  const projectId = task.data?.projectId ?? '';
  const access = useQuery({
    queryKey: ['project-members', revision, projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: Boolean(projectId),
  });
  const canEdit = access.data?.canManage && access.data.project.status === 'ACTIVE';
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
    onSuccess: reconcile,
  });
  const conflict =
    axios.isAxiosError<{ code: string }>(edit.error) &&
    edit.error.response?.data?.code === 'TASK_VERSION_CONFLICT';

  if (task.isPending)
    return (
      <p className="p-5" role="status">
        Loading task…
      </p>
    );
  if (task.isError)
    return (
      <p className="p-5" role="alert">
        {extractApiErrorMessage(task.error)}
      </p>
    );

  const item = task.data;
  const assignee = members.find(({ userId }) => userId === item.assigneeId);
  return (
    <main className="mx-auto max-w-4xl space-y-5 px-5 py-10">
      <Link to={`/projects/${projectId}/tasks`} className="underline">
        Back to project tasks
      </Link>
      <h1 className="break-all text-2xl font-semibold">{item.title}</h1>
      <p className="whitespace-pre-wrap break-words">{item.description}</p>
      <p>
        Priority {item.priority} · {item.status.replaceAll('_', ' ')}
      </p>
      <p>
        Assignee:{' '}
        {assignee?.user.displayName ?? (item.assigneeId ? 'Assigned member' : 'Unassigned')}
      </p>
      <p>Due date: {item.dueDate?.slice(0, 10) ?? 'None'}</p>
      {item.parentId && (
        <Link to={`/tasks/${item.parentId}`} className="underline">
          Parent task
        </Link>
      )}

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 pt-4">
          {access.isPending && <p role="status">Loading project permissions…</p>}
          {access.isError && <p role="alert">{extractApiErrorMessage(access.error)}</p>}
          {access.data?.project.status === 'ARCHIVED' && (
            <p>This project is archived and read-only.</p>
          )}
          {canEdit && (
            <TaskForm
              key={item.version}
              initial={item}
              members={members}
              label="Save task"
              pending={edit.isPending || conflict}
              onSubmit={(fields) => edit.mutate({ ...fields, version: item.version })}
            />
          )}
          {conflict ? (
            <div className="space-y-2">
              <p role="alert">
                This task was changed. Reload the latest version before saving again.
              </p>
              <Button
                variant="outline"
                disabled={task.isFetching}
                onClick={() => {
                  void task.refetch().then((result) => {
                    if (result.isSuccess) edit.reset();
                  });
                }}
              >
                Reload task
              </Button>
            </div>
          ) : (
            edit.isError && <p role="alert">{extractApiErrorMessage(edit.error)}</p>
          )}
          {!item.parentId && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Subtasks</h2>
              {item.subtasks.length ? <TaskLinks tasks={item.subtasks} /> : <p>No subtasks yet.</p>}
              {canEdit && (
                <TaskForm
                  key={addSubtask.data?.id ?? 'create'}
                  members={members}
                  label="Add subtask"
                  pending={addSubtask.isPending}
                  onSubmit={(fields) => addSubtask.mutate(fields)}
                />
              )}
              {addSubtask.isError && <p role="alert">{extractApiErrorMessage(addSubtask.error)}</p>}
            </section>
          )}
        </TabsContent>

        <TabsContent value="comments" className="pt-4">
          <CommentSection />
        </TabsContent>

        <TabsContent value="attachments" className="pt-4">
          <AttachmentUploader />
        </TabsContent>
      </Tabs>
    </main>
  );
}
