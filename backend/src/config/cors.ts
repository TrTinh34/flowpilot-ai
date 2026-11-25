import type { CorsOptions } from 'cors';
import { env } from './env.js';
import { ERROR_CODES } from '../errors/error-codes.js';
import { AppError } from '../errors/app-error.js';

function parseAllowedOrigins(): string[] {
  const raw = env.CORS_ORIGIN || env.FRONTEND_URL;
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0 && origin !== '*');
}

const allowedOrigins = parseAllowedOrigins();

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests with no Origin header (curl, Supertest, server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new AppError(403, ERROR_CODES.CORS_FORBIDDEN, 'Origin not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id'],
};
