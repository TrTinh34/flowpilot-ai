import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/app/store/auth.store';
import { login, logout, refreshToken, register } from '@/features/auth/api/auth.api';
import { apiClient } from '@/services/api-client';

const originalAdapter = apiClient.defaults.adapter;
const oldToken = 'old-access-token';
const newToken = 'new-access-token';

function reply(config: InternalAxiosRequestConfig, status: number, data: unknown): AxiosResponse {
  const response = { config, status, statusText: '', headers: {}, data };
  if (status >= 400) throw new AxiosError('Request failed', undefined, config, undefined, response);
  return response;
}

beforeEach(() => useAuthStore.getState().setAuth(oldToken, 900, null));
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter;
  vi.unstubAllGlobals();
});

it('shares refresh between restoration and concurrent 401s and uses server-provided TTL', async () => {
  let resolveRefresh!: () => void;
  const waitForRefresh = new Promise<void>((resolve) => {
    resolveRefresh = resolve;
  });
  const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
    if (config.url === '/auth/refresh') {
      expect(config.withCredentials).toBe(true);
      expect(config.headers.has('Authorization')).toBe(false);
      await waitForRefresh;
      return reply(config, 200, { accessToken: newToken, expiresIn: 123 });
    }
    return config.headers.get('Authorization') === `Bearer ${newToken}`
      ? reply(config, 200, {})
      : reply(config, 401, {});
  });
  apiClient.defaults.adapter = adapter;
  const pending = Promise.all([
    apiClient.get('/protected/a'),
    apiClient.get('/protected/b'),
    refreshToken(),
  ]);
  await vi.waitFor(() => expect(adapter).toHaveBeenCalledTimes(3));
  resolveRefresh();
  await pending;
  expect(adapter.mock.calls.filter(([config]) => config.url === '/auth/refresh')).toHaveLength(1);
  expect(useAuthStore.getState().accessToken).toBe(newToken);
  expect(useAuthStore.getState().expiresAt).toBeGreaterThan(Date.now() + 122_000);
});

it('does not refresh auth endpoint errors and keeps local state on failed logout', async () => {
  const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
    expect(config.headers.has('Authorization')).toBe(false);
    return reply(
      config,
      config.url === '/auth/register' ? 409 : config.url === '/auth/login' ? 401 : 500,
      {},
    );
  });
  apiClient.defaults.adapter = adapter;
  await expect(
    register({ displayName: 'Fixture', email: 'fixture@example.test', password: 'fixture' }),
  ).rejects.toMatchObject({ response: { status: 409 } });
  await expect(login({ email: 'fixture@example.test', password: 'wrong' })).rejects.toMatchObject({
    response: { status: 401 },
  });
  await expect(logout()).rejects.toMatchObject({ response: { status: 500 } });
  expect(adapter.mock.calls.map(([config]) => config.url)).toEqual([
    '/auth/register',
    '/auth/login',
    '/auth/logout',
  ]);
  expect(useAuthStore.getState().accessToken).toBe(oldToken);
});

it('serializes refresh and logout under the same Web Lock and clears on logout', async () => {
  let queue = Promise.resolve();
  const lock = vi.fn((name: string, operation: () => Promise<void>) => {
    expect(name).toContain('flowpilot:session:');
    const task = queue.then(operation);
    queue = task;
    return task;
  });
  vi.stubGlobal('navigator', { locks: { request: lock } });
  const adapter = vi.fn(async (config: InternalAxiosRequestConfig) =>
    config.url === '/auth/refresh'
      ? reply(config, 200, { accessToken: newToken, expiresIn: 900 })
      : reply(config, 204, undefined),
  );
  apiClient.defaults.adapter = adapter;
  await Promise.all([refreshToken(), logout()]);
  expect(adapter.mock.calls.map(([config]) => config.url)).toEqual([
    '/auth/refresh',
    '/auth/logout',
  ]);
  expect(lock).toHaveBeenCalledTimes(2);
  expect(useAuthStore.getState().accessToken).toBeNull();
});

it('does not replay a response from a previous login against the new session', async () => {
  apiClient.defaults.adapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
    useAuthStore.getState().setAuth(newToken, 900, null);
    return reply(config, 401, {});
  });
  await expect(apiClient.get('/protected/profile')).rejects.toMatchObject({
    response: { status: 401 },
  });
  expect(apiClient.defaults.adapter).toHaveBeenCalledOnce();
  expect(useAuthStore.getState().accessToken).toBe(newToken);
});
