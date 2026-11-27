import type { Request, Response } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../../../../errors/app-error.js';
import { ERROR_CODES } from '../../../../shared/domain/errors/error-codes.js';
import type { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case.js';
import type { GetTaskDetailUseCase } from '../../application/use-cases/get-task-detail.use-case.js';
import type { ListMyTasksUseCase } from '../../application/use-cases/list-my-tasks.use-case.js';
import type { ListProjectTasksUseCase } from '../../application/use-cases/list-project-tasks.use-case.js';
import type { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case.js';
import type { MoveTaskUseCase } from '../../application/use-cases/move-task.use-case.js';
import { toTaskAppError } from '../presenters/task-error.presenter.js';
import {
  createTaskBody,
  moveTaskBody,
  projectTasksParams,
  taskPageQuery,
  taskParams,
  updateTaskBody,
} from '../schemas/task.schemas.js';

function actorId(req: Request): string {
  if (!req.auth) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'A valid access token is required.');
  }
  return req.auth.userId;
}

function parse<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Invalid task request.');
  }
  return result.data;
}

export class TaskController {
  constructor(
    private readonly listProjectTasksUseCase: ListProjectTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTaskDetailUseCase: GetTaskDetailUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly listMyTasksUseCase: ListMyTasksUseCase,
    private readonly moveTaskUseCase: MoveTaskUseCase,
  ) {}

  listProjectTasks = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = parse(projectTasksParams, req.params);
    const { page, size } = parse(taskPageQuery, req.query);
    try {
      res.json(
        await this.listProjectTasksUseCase.execute({
          projectId,
          actorId: actorId(req),
          page,
          size,
        }),
      );
    } catch (error) {
      throw toTaskAppError(error);
    }
  };

  createTask = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = parse(projectTasksParams, req.params);
    const input = parse(createTaskBody, req.body);
    try {
      const task = await this.createTaskUseCase.execute({
        projectId,
        actorId: actorId(req),
        ...input,
      });
      res.status(201).json({ data: task });
    } catch (error) {
      throw toTaskAppError(error);
    }
  };

  getTaskDetail = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = parse(taskParams, req.params);
    try {
      const task = await this.getTaskDetailUseCase.execute({
        taskId,
        actorId: actorId(req),
      });
      res.json({ data: task });
    } catch (error) {
      throw toTaskAppError(error);
    }
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = parse(taskParams, req.params);
    const input = parse(updateTaskBody, req.body);
    try {
      const task = await this.updateTaskUseCase.execute({
        taskId,
        actorId: actorId(req),
        ...input,
      });
      res.json({ data: task });
    } catch (error) {
      throw toTaskAppError(error);
    }
  };

  listMyTasks = async (req: Request, res: Response): Promise<void> => {
    const { page, size } = parse(taskPageQuery, req.query);
    try {
      res.json(
        await this.listMyTasksUseCase.execute({
          actorId: actorId(req),
          page,
          size,
        }),
      );
    } catch (error) {
      throw toTaskAppError(error);
    }
  };

  moveTask = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = parse(taskParams, req.params);
    const input = parse(moveTaskBody, req.body);
    try {
      res.json({
        data: await this.moveTaskUseCase.execute({ taskId, actorId: actorId(req), ...input }),
      });
    } catch (error) {
      throw toTaskAppError(error);
    }
  };
}
