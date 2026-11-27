import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckSquare, Columns3, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { getProjectMembers } from '@/features/project/api/project.api';
import { createTask, listProjectTasks } from '@/features/task/api/task.api';
import { TaskList } from './TaskList';
import { TaskForm } from '@/features/task/components/TaskForm';
import type { TaskFields } from '@/features/task/types/task.types';
import { extractApiErrorMessage } from '@/services/api-client';

export function ProjectTasks({ projectId }: { projectId: string }) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tasks = useQuery({
    queryKey: ['project-tasks', revision, projectId, page],
    queryFn: () => listProjectTasks(projectId, page),
  });
  const project = useQuery({
    queryKey: ['project-members', revision, projectId],
    queryFn: () => getProjectMembers(projectId),
  });
  const create = useMutation({
    mutationFn: (fields: TaskFields) => createTask(projectId, fields),
    onSuccess: async (task) => {
      await queryClient.invalidateQueries({ queryKey: ['project-tasks', revision, projectId] });
      await queryClient.invalidateQueries({ queryKey: ['my-tasks', revision] });
      setCreateOpen(false);
      navigate(`/tasks/${task.id}`);
    },
  });

  const assignees = new Map(
    project.data?.data.map(({ userId, user }) => [userId, user.displayName]),
  );

  return (
    <div className="w-full min-w-0 space-y-6 px-page-gutter py-6">
      <PageHeader
        title="Project tasks"
        description={project.data?.project.name}
        badge={
          project.data?.project.status === 'ARCHIVED' && (
            <Badge tone="neutral">Archived · read-only</Badge>
          )
        }
        actions={
          <>
            <Button asChild variant="outline">
              <Link to={`/projects/${projectId}/board`}>
                <Columns3 aria-hidden="true" />
                Kanban board
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={`/projects/${projectId}`}>
                <Settings aria-hidden="true" />
                Project settings
              </Link>
            </Button>
            {project.isSuccess &&
              project.data.canManage &&
              project.data.project.status === 'ACTIVE' && (
                <Dialog
                  title="Create task"
                  description="Add a task to this project."
                  open={createOpen}
                  onOpenChange={(open) => {
                    setCreateOpen(open);
                    if (!open) create.reset();
                  }}
                  busy={create.isPending}
                  trigger={<Button type="button">Create task</Button>}
                >
                  <div className="mt-4 space-y-3">
                    <FormErrorBanner
                      message={create.isError ? extractApiErrorMessage(create.error) : undefined}
                    />
                    <TaskForm
                      members={project.data.data}
                      label="Create task"
                      pending={create.isPending}
                      onSubmit={(input) => create.mutate(input)}
                    />
                  </div>
                </Dialog>
              )}
          </>
        }
      />
      {(tasks.isPending || project.isPending) && (
        <LoadingState label="Loading project tasks" variant="list" />
      )}
      {tasks.isError && (
        <ErrorState
          title="Could not load project tasks"
          message={extractApiErrorMessage(tasks.error)}
          onRetry={() => void tasks.refetch()}
        />
      )}
      {project.isError && (
        <ErrorState
          title="Could not load project details"
          message={extractApiErrorMessage(project.error)}
          onRetry={() => void project.refetch()}
        />
      )}
      {tasks.isSuccess &&
        (tasks.data.data.length ? (
          <TaskList tasks={tasks.data.data} assignees={assignees} />
        ) : (
          <EmptyState
            icon={CheckSquare}
            title="No tasks on this page."
            description={
              project.data?.canManage && project.data?.project.status === 'ACTIVE'
                ? 'Use Create task to add work to this project.'
                : undefined
            }
          />
        ))}
      <Pagination
        page={page}
        hasNext={tasks.isSuccess && tasks.data.data.length >= tasks.data.size}
        onPageChange={setPage}
      />
    </div>
  );
}
