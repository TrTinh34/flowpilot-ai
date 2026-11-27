import { TaskForbiddenError, TaskProjectNotFoundError } from '../../domain/errors/task.errors.js';
import type { ListProjectTasksInput, PaginatedTasksDto } from '../dtos/task.dtos.js';
import type { TaskRepository } from '../ports/task.repository.port.js';

export class ListProjectTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: ListProjectTasksInput): Promise<PaginatedTasksDto> {
    const access = await this.taskRepository.findProjectAccess(input.projectId, input.actorId);
    if (!access) {
      throw new TaskProjectNotFoundError();
    }
    if (!access.canRead) {
      throw new TaskForbiddenError();
    }

    const data = await this.taskRepository.listByProject(
      input.projectId,
      input.page * input.size,
      input.size,
    );

    return {
      data,
      page: input.page,
      size: input.size,
    };
  }
}
