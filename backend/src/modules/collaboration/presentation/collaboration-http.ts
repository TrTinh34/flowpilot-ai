import type { Request } from 'express';
import { z, type ZodType } from 'zod';
import { AppError } from '../../../errors/app-error.js';
import { ERROR_CODES } from '../../../shared/domain/errors/error-codes.js';
import { CollaborationFailure } from '../domain/collaboration-failure.js';

const taskParams = z.object({ taskId: z.uuid() });
const digits = z.string().regex(/^\d+$/).transform(Number);
export const pagination = z
  .object({
    page: digits.pipe(z.number().int().min(0).max(2_147_483_647)).default(0),
    size: digits.pipe(z.number().int().min(1).max(100)).default(20),
  })
  .refine(({ page, size }) => page * size <= 2_147_483_647);

export function parse<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Invalid collaboration request.');
  }
  return result.data;
}

export function actorId(req: Request) {
  if (!req.auth) throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required.');
  return req.auth.userId;
}

export function taskActor(req: Request) {
  return { ...parse(taskParams, req.params), actorId: actorId(req) };
}

const failures = {
  not_found: { status: 404, code: ERROR_CODES.NOT_FOUND },
  forbidden: { status: 403, code: ERROR_CODES.FORBIDDEN },
  archived: { status: 409, code: ERROR_CODES.PROJECT_ARCHIVED },
  invalid_mention: { status: 422, code: ERROR_CODES.VALIDATION_ERROR },
  invalid_file: { status: 422, code: ERROR_CODES.VALIDATION_ERROR },
  storage_unavailable: { status: 503, code: ERROR_CODES.SERVICE_UNAVAILABLE },
};

export function present(error: unknown): never {
  if (!(error instanceof CollaborationFailure)) throw error;
  const { status, code } = failures[error.kind];
  throw new AppError(status, code, error.message);
}
