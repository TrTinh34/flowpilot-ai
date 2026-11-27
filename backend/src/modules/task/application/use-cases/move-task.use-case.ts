import type { TaskEntity } from '../../domain/entities/task.entity.js';
import {
  InvalidBoardPositionError,
  TaskForbiddenError,
  TaskNotFoundError,
  TaskProjectArchivedError,
  TaskVersionConflictError,
} from '../../domain/errors/task.errors.js';
import type { TaskUnitOfWork } from '../ports/task-unit-of-work.port.js';
import type { MoveTaskInput } from '../dtos/task.dtos.js';

export class MoveTaskUseCase {
  constructor(private readonly unitOfWork: TaskUnitOfWork) {}

  execute(input: MoveTaskInput): Promise<TaskEntity> {
    return this.unitOfWork.execute(async ({ tasks, audit }) => {
      const initial = await tasks.findTaskAccess(input.taskId, input.actorId);
      if (!initial) throw new TaskNotFoundError();
      if (!initial.access.canRead) throw new TaskForbiddenError();
      await tasks.lockProject(initial.access.projectId, initial.access.workspaceId);

      const found = await tasks.findTaskAccess(input.taskId, input.actorId);
      if (!found) throw new TaskNotFoundError();
      const { task, access } = found;
      if (!access.canRead || (!access.canWrite && task.assigneeId !== input.actorId)) {
        throw new TaskForbiddenError();
      }
      if (access.projectStatus === 'ARCHIVED') throw new TaskProjectArchivedError();
      if (task.version !== input.version) throw new TaskVersionConflictError();

      const positions = await tasks.listBoardPositions(task.projectId, [task.status, input.status]);
      const remaining = positions.filter(({ id }) => id !== task.id);
      const destination = remaining.filter(({ status }) => status === input.status);
      if (input.position > destination.length) throw new InvalidBoardPositionError();

      destination.splice(input.position, 0, task);
      const source =
        task.status === input.status
          ? []
          : remaining.filter(({ status }) => status === task.status);
      const changes = [source, destination].flatMap((column) =>
        column.flatMap((item, position) =>
          item.id === task.id || item.position === position ? [] : [{ id: item.id, position }],
        ),
      );

      const moved = await tasks.moveWithVersion(input);
      if (!moved) throw new TaskVersionConflictError();
      await tasks.updateBoardPositions(changes);
      await audit?.record({
        workspaceId: access.workspaceId,
        projectId: access.projectId,
        actorId: input.actorId,
        action: 'TASK_MOVED',
        targetType: 'TASK',
        targetId: moved.id,
        metadata: { fromStatus: task.status, toStatus: moved.status, position: moved.position },
      });
      return moved;
    });
  }
}
