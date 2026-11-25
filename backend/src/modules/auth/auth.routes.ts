import { Router, type RequestHandler } from 'express';
import { isAllowedOrigin } from '../../config/cors.js';
import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import {
  loginRateLimiter,
  refreshRateLimiter,
  registrationRateLimiter,
} from '../../middlewares/rate-limit.middleware.js';
import { validateBody } from '../../middlewares/validation.middleware.js';
import { loginController, refreshController, registerController } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schema.js';

export const authRouter = Router();

const requireTrustedBrowserOrigin: RequestHandler = (req, _res, next) => {
  const origin = req.get('Origin');
  const fetchSite = req.get('Sec-Fetch-Site');
  if ((origin && !isAllowedOrigin(origin)) || (!origin && fetchSite)) {
    next(new AppError(403, ERROR_CODES.CORS_FORBIDDEN, 'Origin not allowed for this request'));
    return;
  }
  next();
};

authRouter.post(
  '/register',
  registrationRateLimiter,
  validateBody(registerSchema),
  registerController,
);

authRouter.post(
  '/login',
  requireTrustedBrowserOrigin,
  loginRateLimiter,
  validateBody(loginSchema),
  loginController,
);
authRouter.post('/refresh', requireTrustedBrowserOrigin, refreshRateLimiter, refreshController);
