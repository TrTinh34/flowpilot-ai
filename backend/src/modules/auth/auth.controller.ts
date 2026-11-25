import type { Request, Response } from 'express';
import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import type { RegisterInput } from './auth.schema.js';
import { register } from './auth.service.js';

export async function registerController(
  _req: Request,
  res: Response<unknown, { validatedBody: RegisterInput }>,
): Promise<void> {
  try {
    const user = await register(res.locals.validatedBody);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(500, ERROR_CODES.INTERNAL_ERROR, 'An unexpected internal error occurred');
  }
}
