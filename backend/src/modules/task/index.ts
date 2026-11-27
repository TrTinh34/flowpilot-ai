import { taskModule } from './task.module.js';

export const projectTasksRouter = taskModule.projectTasksRouter;
export const taskRouter = taskModule.taskRouter;
export const myTasksRouter = taskModule.myTasksRouter;

export type { TaskDetailDto, TaskDto } from './application/dtos/task.dtos.js';
export { createTaskAccessRepository } from './task.module.js';
