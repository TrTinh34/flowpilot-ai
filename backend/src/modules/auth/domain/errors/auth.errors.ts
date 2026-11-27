import { DomainError } from '../../../../shared/domain/errors/domain-error.js';
import { ERROR_CODES } from '../../../../shared/domain/errors/error-codes.js';

export class EmailAlreadyExistsError extends DomainError {
  constructor() {
    super(ERROR_CODES.EMAIL_ALREADY_EXISTS, 'Email is already registered');
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super(ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email or password.');
  }
}

export class InvalidRefreshTokenError extends DomainError {
  constructor() {
    super(ERROR_CODES.INVALID_REFRESH_TOKEN, 'Invalid or expired refresh token.');
  }
}

export class UserNotFoundError extends DomainError {
  constructor() {
    super(ERROR_CODES.NOT_FOUND, 'User not found.');
  }
}

export class UnauthorizedError extends DomainError {
  constructor() {
    super(ERROR_CODES.UNAUTHORIZED, 'A valid access token is required.');
  }
}
