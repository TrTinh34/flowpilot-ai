import axios, { type AxiosError } from 'axios';
import { useAuthStore } from '@/app/store/auth.store';
import type { AuthTokenResponse } from '@/features/auth/types/auth.types';
import { env } from '@/lib/env';
import type { ApiErrorResponse, HealthCheckResponse } from '@/types/api.types';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const rootClient = axios.create({ baseURL: env.backendOrigin, timeout: 10000 });

const sessionEndpoints = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
]);

let sessionQueue: Promise<unknown> = Promise.resolve();

export async function withSessionCookie<T>(operation: () => Promise<T>): Promise<T> {
  // Serialize cookie mutations across tabs sharing this frontend origin.
  if (navigator.locks) {
    return navigator.locks.request(`flowpilot:session:${env.apiBaseUrl}`, operation);
  }
  const task = sessionQueue.then(operation);
  sessionQueue = task.catch(() => undefined);
  return task;
}

let pendingRefresh: Promise<AuthTokenResponse> | undefined;
type SessionRequest = { _retry?: boolean; _sessionRevision?: number };

export function refreshSession(): Promise<AuthTokenResponse> {
  const revision = useAuthStore.getState().sessionRevision;
  pendingRefresh ??= withSessionCookie(async () => {
    if (useAuthStore.getState().sessionRevision !== revision) throw new Error('Session changed');
    const { data } = await apiClient.post<AuthTokenResponse>('/auth/refresh');
    if (useAuthStore.getState().sessionRevision !== revision) throw new Error('Session changed');
    useAuthStore.getState().updateToken(data.accessToken, data.expiresIn);
    return data;
  }).finally(() => {
    pendingRefresh = undefined;
  });
  return pendingRefresh;
}

apiClient.interceptors.request.use((config) => {
  const { accessToken: token, sessionRevision } = useAuthStore.getState();
  const request = config as typeof config & SessionRequest;
  if (request._retry && request._sessionRevision !== sessionRevision)
    throw new Error('Session changed');
  request._sessionRevision = sessionRevision;
  if (token && !sessionEndpoints.has(config.url ?? '')) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as (NonNullable<typeof error.config> & SessionRequest) | undefined;
  const sentToken = config?.headers.get('Authorization');
  const activeToken = useAuthStore.getState().accessToken;
  if (
    error.response?.status !== 401 ||
    !config ||
    config._retry ||
    config._sessionRevision !== useAuthStore.getState().sessionRevision ||
    sessionEndpoints.has(config.url ?? '') ||
    !sentToken ||
    !activeToken
  ) {
    throw error;
  }

  config._retry = true;
  if (sentToken === `Bearer ${activeToken}`) {
    try {
      await refreshSession();
    } catch (refreshError) {
      if (
        axios.isAxiosError(refreshError) &&
        refreshError.response?.status === 401 &&
        useAuthStore.getState().sessionRevision === config._sessionRevision &&
        useAuthStore.getState().accessToken === activeToken
      ) {
        useAuthStore.getState().clearAuth();
      }
      throw refreshError;
    }
  }
  if (!useAuthStore.getState().accessToken) throw error;
  return apiClient(config);
});

export function extractApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Unexpected error occurred';
}

export async function fetchBackendHealth(): Promise<HealthCheckResponse> {
  try {
    const response = await rootClient.get<HealthCheckResponse>('/health');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<HealthCheckResponse>;
    if (axiosError.response?.status === 503 && axiosError.response.data?.services) {
      return axiosError.response.data;
    }
    throw error;
  }
}
