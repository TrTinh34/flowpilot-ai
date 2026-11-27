import { randomBytes, randomUUID } from 'node:crypto';
import express from 'express';
import { SignJWT } from 'jose';
import request from 'supertest';
import { beforeEach, expect, it, vi } from 'vitest';
import { env } from '../../src/config/env.js';
import { errorMiddleware } from '../../src/middlewares/error.middleware.js';
import { requestIdMiddleware } from '../../src/middlewares/request-id.middleware.js';
import { JoseTokenService } from '../../src/modules/auth/infrastructure/security/jose-token.service.js';
import { createAuthenticateMiddleware } from '../../src/modules/auth/presentation/middlewares/authenticate.middleware.js';

const tokenService = new JoseTokenService(env.JWT_ACCESS_SECRET);
const authenticate = createAuthenticateMiddleware(tokenService);

function protectedApp() {
  const app = express();
  const controller = vi.fn();
  app.use(requestIdMiddleware);
  app.get('/protected', authenticate, (req, res) => {
    controller(req.auth);
    res.json(req.auth);
  });
  app.use(errorMiddleware);
  return { app, controller };
}

const userId = randomUUID();

beforeEach(() => {
  vi.restoreAllMocks();
});

it('extracts the Bearer token and passes only the verified userId downstream', async () => {
  const verifySpy = vi.spyOn(tokenService, 'verifyAccessToken');
  const { app, controller } = protectedApp();
  const token = await tokenService.issueAccessToken(userId);
  const response = await request(app).get('/protected').set('Authorization', `bEaReR  ${token}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ userId });
  expect(verifySpy).toHaveBeenLastCalledWith(token);
  expect(controller).toHaveBeenCalledExactlyOnceWith({ userId });
});

it.each([
  undefined,
  'Basic abc',
  'Bearer',
  'Bearer token another',
  'Bearer token,Bearer token',
  'Bearer malformed',
])('rejects invalid Authorization header %#', async (header) => {
  const { app, controller } = protectedApp();
  const call = request(app).get('/protected');
  const response = await (header ? call.set('Authorization', header) : call);
  expect(response.status).toBe(401);
  expect(response.headers['www-authenticate']).toBe('Bearer');
  expect(response.body).toEqual({
    code: 'UNAUTHORIZED',
    message: 'A valid access token is required.',
    requestId: expect.any(String),
  });
  expect(controller).not.toHaveBeenCalled();
});

it.each(['expired', 'forged', 'invalid subject', 'invalid type', 'refresh token'])(
  'rejects %s',
  async (scenario) => {
    const { app, controller } = protectedApp();
    const now = Math.floor(Date.now() / 1000);
    const token =
      scenario === 'refresh token'
        ? tokenService.generateRefreshToken()
        : await new SignJWT({})
            .setProtectedHeader({
              alg: 'HS256',
              typ: scenario === 'invalid type' ? 'JWT' : 'at+jwt',
            })
            .setIssuer('flowpilot-ai')
            .setAudience('flowpilot-ai-api')
            .setSubject(scenario === 'invalid subject' ? 'invalid' : userId)
            .setIssuedAt(now - 100)
            .setExpirationTime(scenario === 'expired' ? now - 1 : now + 100)
            .sign(
              scenario === 'forged' ? randomBytes(32) : Buffer.from(env.JWT_ACCESS_SECRET, 'hex'),
            );
    const response = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(401);
    expect(response.body.code).toBe('UNAUTHORIZED');
    expect(controller).not.toHaveBeenCalled();
  },
);

it('returns a safe 500 if verification unexpectedly fails', async () => {
  const { app, controller } = protectedApp();
  vi.spyOn(tokenService, 'verifyAccessToken').mockRejectedValueOnce(
    new Error('private verifier diagnostic'),
  );
  const response = await request(app).get('/protected').set('Authorization', 'Bearer opaque');
  expect(response.status).toBe(500);
  expect(response.body.message).toBe('An unexpected internal error occurred');
  expect(controller).not.toHaveBeenCalled();
});
