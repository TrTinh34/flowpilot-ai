import type { Logger } from 'pino';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { prisma } from '../../config/prisma.js';
import type { PrismaClient } from '../../generated/prisma/client.js';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.use-case.js';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case.js';
import { LogoutUseCase } from './application/use-cases/logout.use-case.js';
import { RefreshSessionUseCase } from './application/use-cases/refresh-session.use-case.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';
import { PinoAuthLogger } from './infrastructure/logging/pino-auth.logger.js';
import { PrismaAuthUnitOfWork } from './infrastructure/persistence/prisma-auth-unit-of-work.js';
import { PrismaRefreshTokenRepository } from './infrastructure/repositories/prisma-refresh-token.repository.js';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository.js';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher.js';
import { JoseTokenService } from './infrastructure/security/jose-token.service.js';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { createAuthenticateMiddleware } from './presentation/middlewares/authenticate.middleware.js';
import { createAuthRouter } from './presentation/routes/auth.routes.js';

export interface AuthModuleDependencies {
  prisma: PrismaClient;
  logger: Logger;
  jwtAccessSecret: string;
  isProduction: boolean;
}

export function createAuthModule(deps: AuthModuleDependencies) {
  const userRepository = new PrismaUserRepository(deps.prisma);
  const refreshTokenRepository = new PrismaRefreshTokenRepository(deps.prisma);
  const authUnitOfWork = new PrismaAuthUnitOfWork(deps.prisma);
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JoseTokenService(deps.jwtAccessSecret);
  const authLogger = new PinoAuthLogger(deps.logger);

  const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
  const loginUserUseCase = new LoginUserUseCase(
    userRepository,
    passwordHasher,
    tokenService,
    tokenService,
    refreshTokenRepository,
  );
  const refreshSessionUseCase = new RefreshSessionUseCase(
    authUnitOfWork,
    tokenService,
    tokenService,
    authLogger,
  );
  const logoutUseCase = new LogoutUseCase(authUnitOfWork, tokenService);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

  const authController = new AuthController(
    registerUserUseCase,
    loginUserUseCase,
    refreshSessionUseCase,
    logoutUseCase,
    getCurrentUserUseCase,
    deps.isProduction,
  );

  const authenticate = createAuthenticateMiddleware(tokenService);
  const authRouter = createAuthRouter(authController, authenticate);

  return {
    authRouter,
    authenticate,
    accessTokenIssuer: tokenService,
    accessTokenVerifier: tokenService,
    refreshTokenService: tokenService,
    useCases: {
      registerUserUseCase,
      loginUserUseCase,
      refreshSessionUseCase,
      logoutUseCase,
      getCurrentUserUseCase,
    },
  };
}

export const authModule = createAuthModule({
  prisma,
  logger,
  jwtAccessSecret: env.JWT_ACCESS_SECRET,
  isProduction: env.NODE_ENV === 'production',
});
