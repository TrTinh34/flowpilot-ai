import { Router, type RequestHandler } from 'express';
import { isAllowedOrigin } from '../../../../config/cors.js';
import { AppError } from '../../../../errors/app-error.js';
import { ERROR_CODES } from '../../../../shared/domain/errors/error-codes.js';
import {
  loginRateLimiter,
  logoutRateLimiter,
  refreshRateLimiter,
  registrationRateLimiter,
} from '../../../../middlewares/rate-limit.middleware.js';
import { validateBody } from '../../../../middlewares/validation.middleware.js';
import type { AuthController } from '../controllers/auth.controller.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';

const requireTrustedBrowserOrigin: RequestHandler = (req, _res, next) => {
  const origin = req.get('Origin');
  const fetchSite = req.get('Sec-Fetch-Site');
  if ((origin && !isAllowedOrigin(origin)) || (!origin && fetchSite)) {
    next(new AppError(403, ERROR_CODES.CORS_FORBIDDEN, 'Origin not allowed for this request'));
    return;
  }
  next();
};

export function createAuthRouter(
  controller: AuthController,
  authenticateMiddleware: RequestHandler,
): Router {
  const authRouter = Router();

  authRouter.post(
    '/register',
    registrationRateLimiter,
    validateBody(registerSchema),
    controller.register,
  );

  authRouter.post(
    '/login',
    requireTrustedBrowserOrigin,
    loginRateLimiter,
    validateBody(loginSchema),
    controller.login,
  );

  authRouter.post('/refresh', requireTrustedBrowserOrigin, refreshRateLimiter, controller.refresh);
  authRouter.post('/logout', requireTrustedBrowserOrigin, logoutRateLimiter, controller.logout);
  authRouter.get('/me', authenticateMiddleware, controller.currentUser);

  return authRouter;
}
