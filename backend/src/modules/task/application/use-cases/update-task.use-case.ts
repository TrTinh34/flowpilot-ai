import {
  InvalidTaskAssigneeError,
  TaskForbiddenError,
  TaskNotFoundError,
  TaskProjectArchivedError,
  TaskVersionConflictError,
} from '../../domain/errors/task.errors.js';
import type { TaskDto, UpdateTaskInput } from '../dtos/task.dtos.js';
import type { TaskUnitOfWork } from '../ports/task-unit-of-work.port.js';

export class UpdateTaskUseCase {
  constructor(private readonly unitOfWork: TaskUnitOfWork) {}

  execute(input: UpdateTaskInput): Promise<TaskDto> {
    return this.unitOfWork.execute(async ({ tasks, audit }) => {
      const found = await tasks.findTaskAccess(input.taskId, input.actorId);
      if (!found) {
        throw new TaskNotFoundError();
      }
      if (!found.access.canWrite) {
        throw new TaskForbiddenError();
      }
      if (found.access.projectStatus === 'ARCHIVED') {
        throw new TaskProjectArchivedError();
      }

      if (input.assigneeId !== undefined && input.assigneeId !== null) {
        const isMember = await tasks.isProjectMember(found.access.projectId, input.assigneeId);
        if (!isMember) {
          throw new InvalidTaskAssigneeError();
        }
      }

      const updated = await tasks.updateWithVersion({
        taskId: input.taskId,
        version: input.version,
        title: input.title,
        description: input.description,
        priority: input.priority,
        assigneeId: input.assigneeId,
        dueDate: input.dueDate,
      });

      if (!updated) {
        throw new TaskVersionConflictError();
      }

      await audit?.record({
        workspaceId: found.access.workspaceId,
        projectId: found.access.projectId,
        actorId: input.actorId,
        action: 'TASK_UPDATED',
        targetType: 'TASK',
        targetId: updated.id,
        metadata: {
          title: updated.title,
          priority: updated.priority,
          assigneeId: updated.assigneeId,
        },
      });

      return updated;
    });
  }
}
