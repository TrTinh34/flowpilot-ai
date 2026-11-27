import { AppError } from '../../../../errors/app-error.js';
import { ERROR_CODES } from '../../../../shared/domain/errors/error-codes.js';
import {
  InvalidSubtaskParentError,
  InvalidBoardPositionError,
  InvalidTaskAssigneeError,
  ParentTaskNotFoundError,
  TaskForbiddenError,
  TaskNotFoundError,
  TaskProjectArchivedError,
  TaskProjectNotFoundError,
  TaskVersionConflictError,
} from '../../domain/errors/task.errors.js';

export function toTaskAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  if (
    error instanceof TaskNotFoundError ||
    error instanceof TaskProjectNotFoundError ||
    error instanceof ParentTaskNotFoundError
  ) {
    return new AppError(404, ERROR_CODES.NOT_FOUND, error.message);
  }
  if (error instanceof TaskForbiddenError) {
    return new AppError(403, ERROR_CODES.FORBIDDEN, error.message);
  }
  if (error instanceof TaskProjectArchivedError) {
    return new AppError(409, ERROR_CODES.PROJECT_ARCHIVED, error.message);
  }
  if (error instanceof TaskVersionConflictError) {
    return new AppError(409, ERROR_CODES.TASK_VERSION_CONFLICT, error.message);
  }
  if (
    error instanceof InvalidSubtaskParentError ||
    error instanceof InvalidTaskAssigneeError ||
    error instanceof InvalidBoardPositionError
  ) {
    return new AppError(422, ERROR_CODES.VALIDATION_ERROR, error.message);
  }

  return new AppError(500, ERROR_CODES.INTERNAL_ERROR, 'An unexpected internal error occurred');
}
