import type { ErrorCode } from './error-codes.js';

/**
 * Base class for framework-independent domain invariant and business rule errors.
 */
export class DomainError extends Error {
  public readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
