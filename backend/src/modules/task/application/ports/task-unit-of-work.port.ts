import type { TaskRepository } from './task.repository.port.js';

export interface TaskTransactionRepositories {
  tasks: TaskRepository;
}

export interface TaskUnitOfWork {
  execute<T>(work: (repos: TaskTransactionRepositories) => Promise<T>): Promise<T>;
}
