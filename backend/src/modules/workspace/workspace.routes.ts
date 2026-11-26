import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import * as controller from './workspace.controller.js';

export const workspaceRouter = Router();
export const invitationRouter = Router();

workspaceRouter.use(authenticate);
workspaceRouter.get('/', controller.list);
workspaceRouter.post('/', controller.create);
workspaceRouter.patch('/:workspaceId/members/:userId', controller.changeRole);
workspaceRouter.delete('/:workspaceId/members/:userId', controller.remove);
workspaceRouter.post('/:workspaceId/transfer', controller.transfer);
workspaceRouter.post('/:workspaceId/invitations', controller.invite);
invitationRouter.post('/accept', authenticate, controller.accept);
