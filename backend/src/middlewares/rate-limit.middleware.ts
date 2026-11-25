import rateLimit from 'express-rate-limit';
import { ERROR_CODES } from '../errors/error-codes.js';

const rateLimitOptions = {
  windowMs: 60_000,
  standardHeaders: 'draft-8' as const,
  legacyHeaders: false,
  handler: ((req, res) => {
    res.status(429).json({
      code: ERROR_CODES.RATE_LIMITED,
      message: 'Too many requests, please try again later.',
      requestId: req.requestId ?? 'unknown',
    });
  }) satisfies import('express-rate-limit').RateLimitExceededEventHandler,
};

export const apiRateLimiter = rateLimit({ ...rateLimitOptions, limit: 120 });
export const registrationRateLimiter = rateLimit({ ...rateLimitOptions, limit: 15 });
export const loginRateLimiter = rateLimit({ ...rateLimitOptions, limit: 15 });
export const refreshRateLimiter = rateLimit({ ...rateLimitOptions, limit: 30 });
