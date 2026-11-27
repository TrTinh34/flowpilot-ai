import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type {
  TaskTransactionRepositories,
  TaskUnitOfWork,
} from '../../application/ports/task-unit-of-work.port.js';
import { PrismaTaskRepository } from '../repositories/prisma-task.repository.js';

export class PrismaTaskUnitOfWork implements TaskUnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  execute<T>(work: (repos: TaskTransactionRepositories) => Promise<T>): Promise<T> {
    return this.prisma.$transaction((tx) => work({ tasks: new PrismaTaskRepository(tx) }), {
      isolationLevel: 'ReadCommitted',
    });
  }
}
