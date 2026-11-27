import type { Request } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../../../errors/app-error.js';
import { ERROR_CODES } from '../../../shared/domain/errors/error-codes.js';
import { NotificationFailure } from '../domain/notification-failure.js';

export function parseNotificationRequest<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Invalid notification request.');
  }
  return result.data;
}

export function requireNotificationActor(req: Request): string {
  if (!req.auth) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required.');
  }
  return req.auth.userId;
}

export function presentNotificationFailure(error: unknown): never {
  if (error instanceof NotificationFailure) {
    throw new AppError(404, ERROR_CODES.NOT_FOUND, error.message);
  }
  throw error;
}
