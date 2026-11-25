import type { CookieOptions, Request, Response } from 'express';
import { env } from '../../config/env.js';
import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';
import { register } from './auth.service.js';
import { login, logoutSession, refreshSession } from './auth.session.js';

const cookieName = 'refresh_token';
const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/v1/auth',
};

function readRefreshCookie(req: Request): string | undefined {
  const cookies = req.headers.cookie
    ?.split(';')
    .map((cookie) => cookie.trim())
    .filter((cookie) => cookie.startsWith(`${cookieName}=`));
  return cookies?.length === 1 ? cookies[0].slice(cookieName.length + 1) : undefined;
}

function sendSession(res: Response, session: Awaited<ReturnType<typeof login>>): void {
  res.set('Cache-Control', 'no-store');
  res.cookie(cookieName, session.refreshToken, {
    ...refreshCookieOptions,
    expires: session.expiresAt,
  });
  res.status(200).json({ accessToken: session.accessToken, expiresIn: session.expiresIn });
}

function rethrowSafeError(error: unknown): never {
  if (error instanceof AppError) {
    throw error;
  }
  throw new AppError(500, ERROR_CODES.INTERNAL_ERROR, 'An unexpected internal error occurred');
}

export async function registerController(
  _req: Request,
  res: Response<unknown, { validatedBody: RegisterInput }>,
): Promise<void> {
  try {
    const user = await register(res.locals.validatedBody);
    res.status(201).json(user);
  } catch (error) {
    rethrowSafeError(error);
  }
}

export async function loginController(
  _req: Request,
  res: Response<unknown, { validatedBody: LoginInput }>,
): Promise<void> {
  try {
    sendSession(res, await login(res.locals.validatedBody));
  } catch (error) {
    rethrowSafeError(error);
  }
}

export async function refreshController(req: Request, res: Response): Promise<void> {
  try {
    sendSession(res, await refreshSession(readRefreshCookie(req)));
  } catch (error) {
    rethrowSafeError(error);
  }
}

export async function logoutController(req: Request, res: Response): Promise<void> {
  try {
    await logoutSession(readRefreshCookie(req));
    res.set('Cache-Control', 'no-store');
    res.clearCookie(cookieName, refreshCookieOptions);
    res.status(204).end();
  } catch (error) {
    rethrowSafeError(error);
  }
}
