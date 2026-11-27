import { TaskForbiddenError, TaskNotFoundError } from '../../domain/errors/task.errors.js';
import type { GetTaskDetailInput, TaskDetailDto } from '../dtos/task.dtos.js';
import type { TaskRepository } from '../ports/task.repository.port.js';

export class GetTaskDetailUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: GetTaskDetailInput): Promise<TaskDetailDto> {
    const found = await this.taskRepository.findTaskAccess(input.taskId, input.actorId);
    if (!found) {
      throw new TaskNotFoundError();
    }
    if (!found.access.canRead) {
      throw new TaskForbiddenError();
    }

    return found.task;
  }
}
