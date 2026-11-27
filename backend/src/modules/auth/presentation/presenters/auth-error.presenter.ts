import { AppError } from '../../../../errors/app-error.js';
import { ERROR_CODES } from '../../../../shared/domain/errors/error-codes.js';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  UnauthorizedError,
  UserNotFoundError,
} from '../../domain/errors/auth.errors.js';

export function toAuthAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof EmailAlreadyExistsError) {
    return new AppError(409, ERROR_CODES.EMAIL_ALREADY_EXISTS, error.message);
  }
  if (error instanceof InvalidCredentialsError) {
    return new AppError(401, ERROR_CODES.INVALID_CREDENTIALS, error.message);
  }
  if (error instanceof InvalidRefreshTokenError) {
    return new AppError(401, ERROR_CODES.INVALID_REFRESH_TOKEN, error.message);
  }
  if (error instanceof UserNotFoundError) {
    return new AppError(404, ERROR_CODES.NOT_FOUND, error.message);
  }
  if (error instanceof UnauthorizedError) {
    return new AppError(401, ERROR_CODES.UNAUTHORIZED, error.message);
  }

  return new AppError(500, ERROR_CODES.INTERNAL_ERROR, 'An unexpected internal error occurred');
}
