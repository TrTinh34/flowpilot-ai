import { DomainError } from '../../../../shared/domain/errors/domain-error.js';
import { ERROR_CODES } from '../../../../shared/domain/errors/error-codes.js';

export class TaskNotFoundError extends DomainError {
  constructor(message = 'Task not found.') {
    super(ERROR_CODES.NOT_FOUND, message);
  }
}

export class TaskProjectNotFoundError extends DomainError {
  constructor() {
    super(ERROR_CODES.NOT_FOUND, 'Project not found.');
  }
}

export class ParentTaskNotFoundError extends DomainError {
  constructor() {
    super(ERROR_CODES.NOT_FOUND, 'Parent task not found in this project.');
  }
}

export class TaskForbiddenError extends DomainError {
  constructor() {
    super(ERROR_CODES.FORBIDDEN, 'Insufficient task permissions.');
  }
}

export class TaskProjectArchivedError extends DomainError {
  constructor() {
    super(ERROR_CODES.PROJECT_ARCHIVED, 'Archived projects are read-only.');
  }
}

export class TaskVersionConflictError extends DomainError {
  constructor() {
    super(ERROR_CODES.TASK_VERSION_CONFLICT, 'Task has been modified by another user.');
  }
}

export class InvalidBoardPositionError extends DomainError {
  constructor() {
    super(ERROR_CODES.VALIDATION_ERROR, 'Position is outside the destination column.');
  }
}

export class InvalidSubtaskParentError extends DomainError {
  constructor() {
    super(ERROR_CODES.VALIDATION_ERROR, 'Subtasks cannot have nested subtasks.');
  }
}

export class InvalidTaskAssigneeError extends DomainError {
  constructor() {
    super(ERROR_CODES.VALIDATION_ERROR, 'Assignee must be a member of the project.');
  }
}
