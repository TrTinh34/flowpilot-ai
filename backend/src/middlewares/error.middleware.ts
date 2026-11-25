import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../errors/app-error.js';
import { ERROR_CODES } from '../errors/error-codes.js';

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = req.requestId ?? 'unknown';

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, requestId }, err.message);
    } else {
      logger.warn({ code: err.code, statusCode: err.statusCode, requestId }, err.message);
    }

    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      requestId,
    });
    return;
  }

  // Handle malformed JSON payloads from express.json()
  if (
    err instanceof SyntaxError &&
    'status' in err &&
    (err as { status?: number }).status === 400
  ) {
    res.status(400).json({
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Invalid JSON request payload',
      requestId,
    });
    return;
  }

  logger.error({ err, requestId }, 'Unhandled error');

  const isProd = env.NODE_ENV === 'production';
  const message =
    !isProd && err instanceof Error ? err.message : 'An unexpected internal error occurred';

  res.status(500).json({
    code: ERROR_CODES.INTERNAL_ERROR,
    message,
    requestId,
  });
}
