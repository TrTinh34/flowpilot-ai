import { authModule } from './auth.module.js';

export const authRouter = authModule.authRouter;
export const authenticate = authModule.authenticate;
export const accessTokenIssuer = authModule.accessTokenIssuer;
export const accessTokenVerifier = authModule.accessTokenVerifier;
export const refreshTokenService = authModule.refreshTokenService;

export type {
  AccessTokenIssuer,
  AccessTokenVerifier,
  RefreshTokenService,
} from './application/ports/token-service.port.js';
export type { PublicUserDto } from './application/dtos/auth.dtos.js';
