import type { AuditLoggerPort } from '../../../audit/index.js';
import type { TaskRepository } from './task.repository.port.js';

export interface TaskTransactionRepositories {
  tasks: TaskRepository;
  audit?: AuditLoggerPort;
}

export interface TaskUnitOfWork {
  execute<T>(work: (repos: TaskTransactionRepositories) => Promise<T>): Promise<T>;
}
