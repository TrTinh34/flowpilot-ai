import type { RequestHandler, Response } from 'express';
import { errors } from 'jose';
import { AppError } from '../errors/app-error.js';
import { ERROR_CODES } from '../errors/error-codes.js';
import { verifyAccessToken } from '../modules/auth/auth.tokens.js';

function unauthorized(res: Response): AppError {
  res.set('WWW-Authenticate', 'Bearer');
  return new AppError(401, ERROR_CODES.UNAUTHORIZED, 'A valid access token is required.');
}

export const authenticate: RequestHandler = async (req, res, next) => {
  const authorization = req.get('Authorization');
  const match = authorization && /^Bearer +([^\s,]+)$/i.exec(authorization);
  if (!match || (req.headersDistinct.authorization?.length ?? 0) > 1) {
    next(unauthorized(res));
    return;
  }

  try {
    req.auth = await verifyAccessToken(match[1]);
  } catch (error) {
    next(
      error instanceof errors.JOSEError
        ? unauthorized(res)
        : new AppError(500, ERROR_CODES.INTERNAL_ERROR, 'An unexpected internal error occurred'),
    );
    return;
  }

  next();
};
