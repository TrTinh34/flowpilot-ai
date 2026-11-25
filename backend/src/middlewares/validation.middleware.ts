import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../errors/app-error.js';
import { ERROR_CODES } from '../errors/error-codes.js';

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Invalid request body'));
      return;
    }

    res.locals.validatedBody = result.data;
    next();
  };
}
