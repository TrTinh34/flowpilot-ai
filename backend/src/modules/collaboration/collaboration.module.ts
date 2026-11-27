import type { RequestHandler } from 'express';
import type { PrismaClient } from '../../generated/prisma/client.js';
import { AddTaskComment, ListTaskComments } from './application/use-cases/task-comments.js';
import { PrismaComments, PrismaCommentUnitOfWork } from './infrastructure/prisma-comments.js';
import { createCommentRouter } from './presentation/comment.routes.js';

export function createCollaborationModule(db: PrismaClient, authenticate: RequestHandler) {
  return createCommentRouter(
    new ListTaskComments(new PrismaComments(db)),
    new AddTaskComment(new PrismaCommentUnitOfWork(db)),
    authenticate,
  );
}
