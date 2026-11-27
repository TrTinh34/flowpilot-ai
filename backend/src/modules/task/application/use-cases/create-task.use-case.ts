import {
  InvalidSubtaskParentError,
  InvalidTaskAssigneeError,
  ParentTaskNotFoundError,
  TaskForbiddenError,
  TaskProjectArchivedError,
  TaskProjectNotFoundError,
} from '../../domain/errors/task.errors.js';
import type { CreateTaskInput, TaskDto } from '../dtos/task.dtos.js';
import type { TaskUnitOfWork } from '../ports/task-unit-of-work.port.js';

export class CreateTaskUseCase {
  constructor(private readonly unitOfWork: TaskUnitOfWork) {}

  execute(input: CreateTaskInput): Promise<TaskDto> {
    return this.unitOfWork.execute(async ({ tasks, audit }) => {
      const initial = await tasks.findProjectAccess(input.projectId, input.actorId);
      if (!initial) throw new TaskProjectNotFoundError();
      if (!initial.canWrite) throw new TaskForbiddenError();
      if (initial.projectStatus === 'ARCHIVED') throw new TaskProjectArchivedError();
      await tasks.lockProject(initial.projectId, initial.workspaceId);
      const access = await tasks.findProjectAccess(input.projectId, input.actorId);
      if (!access) {
        throw new TaskProjectNotFoundError();
      }
      if (!access.canWrite) {
        throw new TaskForbiddenError();
      }
      if (access.projectStatus === 'ARCHIVED') {
        throw new TaskProjectArchivedError();
      }

      const parentId = input.parentId ?? null;
      if (parentId !== null) {
        const parent = await tasks.findParentInProject(input.projectId, parentId);
        if (!parent) {
          throw new ParentTaskNotFoundError();
        }
        if (parent.parentId !== null) {
          throw new InvalidSubtaskParentError();
        }
      }

      const assigneeId = input.assigneeId ?? null;
      if (assigneeId !== null) {
        const isMember = await tasks.isProjectMember(input.projectId, assigneeId);
        if (!isMember) {
          throw new InvalidTaskAssigneeError();
        }
      }

      const position = await tasks.getNextTodoPosition(input.projectId);
      const created = await tasks.create({
        projectId: input.projectId,
        parentId,
        assigneeId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate: input.dueDate ?? null,
        position,
      });
      await audit?.record({
        workspaceId: access.workspaceId,
        projectId: access.projectId,
        actorId: input.actorId,
        action: 'TASK_CREATED',
        targetType: 'TASK',
        targetId: created.id,
        metadata: { title: created.title, priority: created.priority, parentId: created.parentId },
      });
      return created;
    });
  }
}
