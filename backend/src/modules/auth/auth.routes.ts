import { Router } from 'express';
import { registrationRateLimiter } from '../../middlewares/rate-limit.middleware.js';
import { validateBody } from '../../middlewares/validation.middleware.js';
import { registerController } from './auth.controller.js';
import { registerSchema } from './auth.schema.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  registrationRateLimiter,
  validateBody(registerSchema),
  registerController,
);
