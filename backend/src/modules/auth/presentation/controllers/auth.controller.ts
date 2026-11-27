import type { CookieOptions, Request, Response } from 'express';
import { AppError } from '../../../../errors/app-error.js';
import { ERROR_CODES } from '../../../../shared/domain/errors/error-codes.js';
import type { AuthSessionDto } from '../../application/dtos/auth.dtos.js';
import type { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case.js';
import type { LoginUserUseCase } from '../../application/use-cases/login-user.use-case.js';
import type { LogoutUseCase } from '../../application/use-cases/logout.use-case.js';
import type { RefreshSessionUseCase } from '../../application/use-cases/refresh-session.use-case.js';
import type { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case.js';
import { toAuthAppError } from '../presenters/auth-error.presenter.js';
import type { LoginInput, RegisterInput } from '../schemas/auth.schemas.js';

const COOKIE_NAME = 'refresh_token';

function readRefreshCookie(req: Request): string | undefined {
  const cookies = req.headers.cookie
    ?.split(';')
    .map((cookie) => cookie.trim())
    .filter((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));
  return cookies?.length === 1 ? cookies[0].slice(COOKIE_NAME.length + 1) : undefined;
}

export class AuthController {
  private readonly refreshCookieOptions: CookieOptions;

  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    isProduction: boolean,
  ) {
    this.refreshCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/v1/auth',
    };
  }

  private sendSession(res: Response, session: AuthSessionDto): void {
    res.set('Cache-Control', 'no-store');
    res.cookie(COOKIE_NAME, session.refreshToken, {
      ...this.refreshCookieOptions,
      expires: session.expiresAt,
    });
    res.status(200).json({ accessToken: session.accessToken, expiresIn: session.expiresIn });
  }

  register = async (
    _req: Request,
    res: Response<unknown, { validatedBody: RegisterInput }>,
  ): Promise<void> => {
    try {
      const user = await this.registerUserUseCase.execute(res.locals.validatedBody);
      res.status(201).json(user);
    } catch (error) {
      throw toAuthAppError(error);
    }
  };

  login = async (
    _req: Request,
    res: Response<unknown, { validatedBody: LoginInput }>,
  ): Promise<void> => {
    try {
      const session = await this.loginUserUseCase.execute(res.locals.validatedBody);
      this.sendSession(res, session);
    } catch (error) {
      throw toAuthAppError(error);
    }
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const session = await this.refreshSessionUseCase.execute(readRefreshCookie(req));
      this.sendSession(res, session);
    } catch (error) {
      throw toAuthAppError(error);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.logoutUseCase.execute(readRefreshCookie(req));
      res.set('Cache-Control', 'no-store');
      res.clearCookie(COOKIE_NAME, this.refreshCookieOptions);
      res.status(204).end();
    } catch (error) {
      throw toAuthAppError(error);
    }
  };

  currentUser = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) {
      res.set('WWW-Authenticate', 'Bearer');
      throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'A valid access token is required.');
    }
    try {
      res.set('Cache-Control', 'no-store');
      res.json({ data: await this.getCurrentUserUseCase.execute(req.auth.userId) });
    } catch (error) {
      throw toAuthAppError(error);
    }
  };
}
