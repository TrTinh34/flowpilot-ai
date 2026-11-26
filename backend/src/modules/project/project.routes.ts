import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import * as controller from './project.controller.js';

export const workspaceProjectsRouter = Router({ mergeParams: true });
workspaceProjectsRouter.get('/', controller.list);
workspaceProjectsRouter.post('/', controller.create);

export const projectRouter = Router();
projectRouter.use(authenticate);
projectRouter.patch('/:projectId', controller.update);
projectRouter.get('/:projectId/members', controller.members);
projectRouter.post('/:projectId/members', controller.addMember);
