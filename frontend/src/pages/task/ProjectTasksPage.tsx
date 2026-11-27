import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { getProjectMembers } from '@/features/project/api/project.api';
import { createTask, listProjectTasks } from '@/features/task/api/task.api';
import { TaskLinks } from '@/features/task/components/SubtaskList';
import { TaskForm } from '@/features/task/components/TaskForm';
import type { TaskFields } from '@/features/task/types/task.types';
import { extractApiErrorMessage } from '@/services/api-client';

export function ProjectTasksPage() {
  const { projectId = '' } = useParams();
  return <ProjectTasks key={projectId} projectId={projectId} />;
}

function ProjectTasks({ projectId }: { projectId: string }) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const [page, setPage] = useState(0);
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
      navigate(`/tasks/${task.id}`);
    },
  });

  return (
    <main className="mx-auto max-w-4xl space-y-5 px-5 py-10">
      <Link to={`/projects/${projectId}/board`} className="mr-4 underline">
        Kanban board
      </Link>
      <Link to={`/projects/${projectId}`} className="underline">
        Project settings
      </Link>
      <PageHeader title="Project tasks" description={project.data?.project.name} />
      {(tasks.isPending || project.isPending) && <LoadingState label="Loading project tasks" />}
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
      {project.data?.canManage && project.data.project.status === 'ACTIVE' && (
        <TaskForm
          members={project.data.data}
          label="Create task"
          pending={create.isPending}
          onSubmit={(input) => create.mutate(input)}
        />
      )}
      {create.isError && <p role="alert">{extractApiErrorMessage(create.error)}</p>}
      {tasks.isSuccess &&
        (tasks.data.data.length ? (
          <TaskLinks tasks={tasks.data.data} />
        ) : (
          <EmptyState title="No tasks on this page." />
        ))}
      <Pagination
        page={page}
        hasNext={tasks.isSuccess && tasks.data.data.length >= tasks.data.size}
        onPageChange={setPage}
      />
    </main>
  );
}
