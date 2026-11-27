import { Router, type RequestHandler } from 'express';
import multer, { MulterError } from 'multer';
import { z } from 'zod';
import { AppError } from '../../../errors/app-error.js';
import { ERROR_CODES } from '../../../shared/domain/errors/error-codes.js';
import type { TaskAttachments } from '../application/use-cases/task-attachments.js';
import { MAX_ATTACHMENT_BYTES } from '../domain/attachment.js';
import { actorId, pagination, parse, present, taskActor } from './collaboration-http.js';

const fileParser = multer({
  storage: multer.memoryStorage(),
  defParamCharset: 'utf8',
  limits: { fileSize: MAX_ATTACHMENT_BYTES, files: 1, fields: 0, parts: 1 },
}).single('file');
const attachmentParams = z.object({ attachmentId: z.uuid() });

const parseUpload: RequestHandler = (req, res, next) => {
  fileParser(req, res, (error: unknown) => {
    if (error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE') {
      next(new AppError(413, ERROR_CODES.VALIDATION_ERROR, 'File exceeds 10 MiB.'));
    } else if (error || !req.file) {
      next(new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Provide one multipart file.'));
    } else {
      next();
    }
  });
};

export function createAttachmentRouters(
  attachments: TaskAttachments,
  authenticate: RequestHandler,
) {
  const taskAttachmentsRouter = Router({ mergeParams: true });
  taskAttachmentsRouter.get('/', authenticate, async (req, res) => {
    try {
      res.json(await attachments.list({ ...taskActor(req), ...parse(pagination, req.query) }));
    } catch (error) {
      present(error);
    }
  });
  taskAttachmentsRouter.post('/', authenticate, parseUpload, async (req, res) => {
    try {
      const file = req.file;
      if (!file) throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'File is required.');
      const data = await attachments.upload({
        ...taskActor(req),
        filename: file.originalname,
        mimeType: file.mimetype,
        content: file.buffer,
      });
      res.status(201).json({ data });
    } catch (error) {
      present(error);
    }
  });

  const attachmentDownloadRouter = Router();
  attachmentDownloadRouter.get('/:attachmentId/download', authenticate, async (req, res) => {
    try {
      const data = await attachments.download({
        ...parse(attachmentParams, req.params),
        actorId: actorId(req),
      });
      res.setHeader('Cache-Control', 'no-store');
      res.json({ data });
    } catch (error) {
      present(error);
    }
  });
  return { taskAttachmentsRouter, attachmentDownloadRouter };
}
