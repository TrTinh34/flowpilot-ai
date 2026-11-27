import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { loadBoardTasks, moveBoardTask } from '@/features/board/api/board.api';
import { KanbanBoard } from '@/features/board/components/KanbanBoard';
import { getProjectMembers } from '@/features/project/api/project.api';
import { extractApiErrorMessage } from '@/services/api-client';

export function ProjectBoardPage() {
  const { projectId = '' } = useParams();
  return <ProjectBoard key={projectId} projectId={projectId} />;
}

function ProjectBoard({ projectId }: { projectId: string }) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const actorId = useAuthStore((state) => state.user?.id);
  const client = useQueryClient();
  const boardKey = ['project-board', revision, projectId];
  const board = useQuery({ queryKey: boardKey, queryFn: () => loadBoardTasks(projectId) });
  const access = useQuery({
    queryKey: ['project-members', revision, projectId],
    queryFn: () => getProjectMembers(projectId),
  });
  const move = useMutation({
    mutationFn: (input: Parameters<typeof moveBoardTask>[0]) => moveBoardTask(input),
    onSettled: async (_data, error) => {
      if (error && (!axios.isAxiosError(error) || error.response?.status !== 409)) return;
      await Promise.all([
        client.invalidateQueries({ queryKey: boardKey }),
        client.invalidateQueries({ queryKey: ['project-tasks', revision, projectId] }),
        client.invalidateQueries({ queryKey: ['task', revision] }),
        client.invalidateQueries({ queryKey: ['my-tasks', revision] }),
      ]);
    },
  });
  const conflict =
    axios.isAxiosError<{ code: string }>(move.error) &&
    move.error.response?.data?.code === 'TASK_VERSION_CONFLICT';

  return (
    <div className="w-full min-w-0 space-y-5 px-page-gutter py-8">
      <Link to={`/projects/${projectId}/tasks`} className="text-action-link underline">
        Project tasks
      </Link>
      <PageHeader title="Kanban" description={access.data?.project.name} />
      {(board.isPending || access.isPending) && <LoadingState label="Loading board" />}
      {(board.isError || access.isError) && (
        <ErrorState
          title="Could not load the board"
          message={extractApiErrorMessage(board.error ?? access.error)}
          onRetry={() => {
            if (board.isError) void board.refetch();
            if (access.isError) void access.refetch();
          }}
        />
      )}
      {access.data?.project.status === 'ARCHIVED' && <p>This project is archived and read-only.</p>}
      {move.isPending && <p role="status">Updating board…</p>}
      {move.isError && (
        <p role="alert">
          {conflict
            ? 'The board changed. Review the latest order before moving again.'
            : extractApiErrorMessage(move.error)}
        </p>
      )}
      {board.isSuccess && access.isSuccess && (
        <KanbanBoard
          tasks={board.data}
          assignees={
            new Map(access.data.data.map(({ userId, user }) => [userId, user.displayName]))
          }
          pending={move.isPending}
          canMove={(task) =>
            access.data.project.status === 'ACTIVE' &&
            (access.data.canManage || (Boolean(actorId) && task.assigneeId === actorId))
          }
          onMove={(task, status, position) =>
            move.mutate({ taskId: task.id, status, position, version: task.version })
          }
        />
      )}
    </div>
  );
}
