import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import type { PrismaClient } from '../../generated/prisma/client.js';
import type { AttachmentStorage } from './application/ports/attachments.port.js';
import { TaskAttachments } from './application/use-cases/task-attachments.js';
import { AddTaskComment, ListTaskComments } from './application/use-cases/task-comments.js';
import {
  PrismaAttachments,
  PrismaAttachmentUnitOfWork,
} from './infrastructure/prisma-attachments.js';
import { PrismaComments, PrismaCommentUnitOfWork } from './infrastructure/prisma-comments.js';
import { createAttachmentRouters } from './presentation/attachment.routes.js';
import { createCommentRouter } from './presentation/comment.routes.js';

export function createCollaborationModule(
  db: PrismaClient,
  authenticate: RequestHandler,
  storage?: AttachmentStorage,
) {
  const commentRouter = createCommentRouter(
    new ListTaskComments(new PrismaComments(db)),
    new AddTaskComment(new PrismaCommentUnitOfWork(db)),
    authenticate,
  );
  const attachments = new TaskAttachments(
    new PrismaAttachments(db),
    new PrismaAttachmentUnitOfWork(db),
    storage,
    randomUUID,
  );
  return { commentRouter, ...createAttachmentRouters(attachments, authenticate) };
}
