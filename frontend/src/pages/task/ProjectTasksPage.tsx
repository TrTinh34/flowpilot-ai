import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { Button } from '@/components/ui/button';
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
      <Link to={`/projects/${projectId}`} className="underline">
        Project settings
      </Link>
      <h1 className="text-2xl font-semibold">Project tasks</h1>
      {project.data?.project.name && <p>{project.data.project.name}</p>}
      {(tasks.isPending || project.isPending) && <p role="status">Loading project tasks…</p>}
      {(tasks.isError || project.isError) && (
        <p role="alert">{extractApiErrorMessage(tasks.error ?? project.error)}</p>
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
      {tasks.data &&
        (tasks.data.data.length ? (
          <TaskLinks tasks={tasks.data.data} />
        ) : (
          <p>No tasks on this page.</p>
        ))}
      <div className="flex gap-2">
        <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={!tasks.data || tasks.data.data.length < tasks.data.size}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </main>
  );
}
