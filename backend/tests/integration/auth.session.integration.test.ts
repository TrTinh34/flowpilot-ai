import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { beforeEach, expect, it, vi } from 'vitest';
import { createApp } from '../../src/app.js';
import { verifyLoginCredentials } from '../../src/modules/auth/auth.service.js';
import {
  generateRefreshToken,
  hashRefreshToken,
  verifyAccessToken,
} from '../../src/modules/auth/auth.tokens.js';
import {
  findRefreshToken,
  revokeRefreshFamily,
  revokeRefreshToken,
  saveRefreshToken,
} from '../../src/modules/auth/refresh-token.repository.js';
import { AppError } from '../../src/errors/app-error.js';

const { transaction, tx } = vi.hoisted(() => ({ transaction: vi.fn(), tx: {} }));
vi.mock('../../src/config/prisma.js', () => ({ prisma: { $transaction: transaction } }));
vi.mock('../../src/modules/auth/auth.service.js', () => ({
  verifyLoginCredentials: vi.fn(),
  register: vi.fn(),
}));
vi.mock('../../src/modules/auth/refresh-token.repository.js', () => ({
  findRefreshToken: vi.fn(),
  lockRefreshFamily: vi.fn(),
  revokeRefreshFamily: vi.fn(),
  revokeRefreshToken: vi.fn(),
  saveRefreshToken: vi.fn(),
}));

const app = createApp();
const loginPath = '/api/v1/auth/login';
const refreshPath = '/api/v1/auth/refresh';
const input = { email: 'fixture@example.test', password: 'fixture-password' };
const userId = randomUUID();
const refreshToken = generateRefreshToken();
const record = {
  id: randomUUID(),
  userId,
  familyId: randomUUID(),
  expiresAt: new Date(Date.now() + 60_000),
  revokedAt: null,
};
const refresh = (token = refreshToken) =>
  request(app).post(refreshPath).set('Cookie', `refresh_token=${token}`);

beforeEach(() => {
  vi.resetAllMocks();
  transaction.mockImplementation((callback: (client: typeof tx) => unknown) => callback(tx));
  vi.mocked(verifyLoginCredentials).mockResolvedValue({ userId });
  vi.mocked(findRefreshToken).mockResolvedValue(record);
});

it('delivers login tokens through JSON and cookie and saves only the refresh hash', async () => {
  const res = await request(app).post(loginPath).send(input);
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ accessToken: expect.any(String), expiresIn: 900 });
  await expect(verifyAccessToken(res.body.accessToken)).resolves.toEqual({ userId });
  const cookie = res.headers['set-cookie'][0];
  expect(cookie).toMatch(/^refresh_token=[\w-]{43};/);
  expect(cookie).toContain('HttpOnly');
  expect(cookie).toContain('SameSite=Lax');
  expect(cookie).toContain('Path=/api/v1/auth');
  expect(res.headers['cache-control']).toBe('no-store');
  expect(saveRefreshToken).toHaveBeenCalledExactlyOnceWith({
    familyId: expect.any(String),
    userId,
    tokenHash: hashRefreshToken(cookie.split(';')[0].slice('refresh_token='.length)),
    expiresAt: expect.any(Date),
  });
});

it('rejects invalid login without writing a refresh record', async () => {
  vi.mocked(verifyLoginCredentials).mockRejectedValue(
    new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.'),
  );
  const res = await request(app).post(loginPath).send(input);
  expect(res.status).toBe(401);
  expect(res.body.code).toBe('INVALID_CREDENTIALS');
  expect(saveRefreshToken).not.toHaveBeenCalled();
  expect(res.headers['set-cookie']).toBeUndefined();
});

it('returns a generic failure and withholds the cookie when persistence fails', async () => {
  vi.mocked(saveRefreshToken).mockRejectedValue(new Error('private database diagnostics'));
  const res = await request(app).post(loginPath).send(input);
  expect(res.status).toBe(500);
  expect(res.body).toEqual({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected internal error occurred',
    requestId: expect.any(String),
  });
  expect(res.headers['set-cookie']).toBeUndefined();
});

it('rotates within the family and preserves absolute expiry', async () => {
  const res = await refresh();
  expect(res.status).toBe(200);
  expect(revokeRefreshToken).toHaveBeenCalledWith(tx, record.id, expect.any(Date));
  expect(saveRefreshToken).toHaveBeenCalledWith(
    {
      userId,
      familyId: record.familyId,
      expiresAt: record.expiresAt,
      tokenHash: expect.any(String),
    },
    tx,
  );
});

it('returns 401 after committing the reuse outcome', async () => {
  vi.mocked(findRefreshToken).mockResolvedValue({ ...record, revokedAt: new Date() });
  const res = await refresh();
  expect(res.status).toBe(401);
  expect(revokeRefreshFamily).toHaveBeenCalledWith(tx, record.familyId, expect.any(Date));
  expect(saveRefreshToken).not.toHaveBeenCalled();
});

it.each(['expired', 'unknown', 'malformed', 'missing'])(
  'rejects a %s refresh token',
  async (scenario) => {
    if (scenario === 'expired')
      vi.mocked(findRefreshToken).mockResolvedValue({ ...record, expiresAt: new Date(0) });
    if (scenario === 'unknown') vi.mocked(findRefreshToken).mockResolvedValue(null);
    const res = await (scenario === 'missing'
      ? request(app).post(refreshPath)
      : refresh(scenario === 'malformed' ? 'invalid' : refreshToken));
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_REFRESH_TOKEN');
    expect(saveRefreshToken).not.toHaveBeenCalled();
  },
);

it('rejects an untrusted browser request before the transaction', async () => {
  const res = await refresh().set('Sec-Fetch-Site', 'cross-site');
  expect(res.status).toBe(403);
  expect(transaction).not.toHaveBeenCalled();
});

it('returns a generic 500 for failed refresh transaction', async () => {
  transaction.mockRejectedValue(new Error('private transaction details'));
  const res = await refresh();
  expect(res.status).toBe(500);
  expect(res.body.message).toBe('An unexpected internal error occurred');
  expect(res.headers['set-cookie']).toBeUndefined();
});
