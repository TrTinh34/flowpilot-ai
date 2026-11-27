import type { RequestHandler } from 'express';
import { prisma } from '../../config/prisma.js';
import type { PrismaClient } from '../../generated/prisma/client.js';
import { authenticate } from '../auth/index.js';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case.js';
import { GetTaskDetailUseCase } from './application/use-cases/get-task-detail.use-case.js';
import { ListMyTasksUseCase } from './application/use-cases/list-my-tasks.use-case.js';
import { ListProjectTasksUseCase } from './application/use-cases/list-project-tasks.use-case.js';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case.js';
import { PrismaTaskUnitOfWork } from './infrastructure/persistence/prisma-task-unit-of-work.js';
import { PrismaTaskRepository } from './infrastructure/repositories/prisma-task.repository.js';
import { TaskController } from './presentation/controllers/task.controller.js';
import {
  createMyTasksRouter,
  createProjectTasksRouter,
  createTaskRouter,
} from './presentation/routes/task.routes.js';

export interface TaskModuleDependencies {
  prisma: PrismaClient;
  authenticate: RequestHandler;
}

export function createTaskModule(deps: TaskModuleDependencies) {
  const taskRepository = new PrismaTaskRepository(deps.prisma);
  const taskUnitOfWork = new PrismaTaskUnitOfWork(deps.prisma);

  const listProjectTasksUseCase = new ListProjectTasksUseCase(taskRepository);
  const createTaskUseCase = new CreateTaskUseCase(taskUnitOfWork);
  const getTaskDetailUseCase = new GetTaskDetailUseCase(taskRepository);
  const updateTaskUseCase = new UpdateTaskUseCase(taskUnitOfWork);
  const listMyTasksUseCase = new ListMyTasksUseCase(taskRepository);

  const taskController = new TaskController(
    listProjectTasksUseCase,
    createTaskUseCase,
    getTaskDetailUseCase,
    updateTaskUseCase,
    listMyTasksUseCase,
  );

  return {
    projectTasksRouter: createProjectTasksRouter(taskController, deps.authenticate),
    taskRouter: createTaskRouter(taskController, deps.authenticate),
    myTasksRouter: createMyTasksRouter(taskController, deps.authenticate),
    useCases: {
      listProjectTasksUseCase,
      createTaskUseCase,
      getTaskDetailUseCase,
      updateTaskUseCase,
      listMyTasksUseCase,
    },
  };
}

export const taskModule = createTaskModule({
  prisma,
  authenticate,
});
