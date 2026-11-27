import { Router, type RequestHandler } from 'express';
import type { TaskController } from '../controllers/task.controller.js';

export function createProjectTasksRouter(
  controller: TaskController,
  authenticateMiddleware: RequestHandler,
): Router {
  const router = Router({ mergeParams: true });
  router.use(authenticateMiddleware);
  router.get('/', controller.listProjectTasks);
  router.post('/', controller.createTask);
  return router;
}

export function createTaskRouter(
  controller: TaskController,
  authenticateMiddleware: RequestHandler,
): Router {
  const router = Router();
  router.use(authenticateMiddleware);
  router.get('/:taskId', controller.getTaskDetail);
  router.patch('/:taskId', controller.updateTask);
  return router;
}

export function createMyTasksRouter(
  controller: TaskController,
  authenticateMiddleware: RequestHandler,
): Router {
  const router = Router();
  router.use(authenticateMiddleware);
  router.get('/', controller.listMyTasks);
  return router;
}
