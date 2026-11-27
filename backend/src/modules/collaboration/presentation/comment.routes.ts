import { Router, type Request, type RequestHandler } from 'express';
import { z, type ZodType } from 'zod';
import { AppError } from '../../../errors/app-error.js';
import { ERROR_CODES } from '../../../shared/domain/errors/error-codes.js';
import type { AddTaskComment, ListTaskComments } from '../application/use-cases/task-comments.js';
import { CommentFailure } from '../domain/comment.js';

const params = z.object({ taskId: z.uuid() });
const digits = z.string().regex(/^\d+$/).transform(Number);
const pagination = z
  .object({
    page: digits.pipe(z.number().int().min(0).max(2_147_483_647)).default(0),
    size: digits.pipe(z.number().int().min(1).max(100)).default(20),
  })
  .refine(({ page, size }) => page * size <= 2_147_483_647);
const body = z.strictObject({
  body: z
    .string()
    .trim()
    .min(1)
    .refine((text) => !text.includes('\0')),
  mentionIds: z.array(z.uuid()).max(100),
});

function parse<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Invalid comment request.');
  }
  return result.data;
}

function taskActor(req: Request) {
  if (!req.auth) throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required.');
  return { ...parse(params, req.params), actorId: req.auth.userId };
}

const failures = {
  not_found: { status: 404, code: ERROR_CODES.NOT_FOUND },
  forbidden: { status: 403, code: ERROR_CODES.FORBIDDEN },
  archived: { status: 409, code: ERROR_CODES.PROJECT_ARCHIVED },
  invalid_mention: { status: 422, code: ERROR_CODES.VALIDATION_ERROR },
};

function present(error: unknown): never {
  if (!(error instanceof CommentFailure)) throw error;
  const { status, code } = failures[error.kind];
  throw new AppError(status, code, error.message);
}

export function createCommentRouter(
  list: ListTaskComments,
  add: AddTaskComment,
  authenticate: RequestHandler,
) {
  const router = Router({ mergeParams: true });
  router.get('/', authenticate, async (req, res) => {
    try {
      res.json(await list.execute({ ...taskActor(req), ...parse(pagination, req.query) }));
    } catch (error) {
      present(error);
    }
  });
  router.post('/', authenticate, async (req, res) => {
    try {
      const comment = await add.execute({ ...taskActor(req), ...parse(body, req.body) });
      res.status(201).json({ data: comment });
    } catch (error) {
      present(error);
    }
  });
  return router;
}
