import type { ErrorCode } from '../../domain/errors/error-codes.js';

/**
 * Base class for application-layer use case failures independent of HTTP transport.
 */
export class ApplicationError extends Error {
  public readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = new.target.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
