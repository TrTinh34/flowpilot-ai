import type { ListMyTasksInput, PaginatedTasksDto } from '../dtos/task.dtos.js';
import type { TaskRepository } from '../ports/task.repository.port.js';

export class ListMyTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: ListMyTasksInput): Promise<PaginatedTasksDto> {
    const data = await this.taskRepository.listByAssignee(
      input.actorId,
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
