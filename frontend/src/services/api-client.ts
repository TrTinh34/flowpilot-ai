import axios, { type AxiosError } from 'axios';
import { env } from '@/lib/env';
import type { ApiErrorResponse, HealthCheckResponse } from '@/types/api.types';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const rootClient = axios.create({
  baseURL: env.backendOrigin,
  timeout: 10000,
});

export function extractApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
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
