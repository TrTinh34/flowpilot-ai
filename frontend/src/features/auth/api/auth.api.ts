import axios from 'axios';
import { useAuthStore } from '@/app/store/auth.store';
import {
  apiClient,
  extractApiErrorMessage,
  refreshSession,
  withSessionCookie,
} from '@/services/api-client';
import type { AuthTokenResponse, CurrentUser } from '@/features/auth/types/auth.types';
import type { LoginFormValues, RegisterApiPayload } from '@/features/auth/schemas/auth.schema';

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await apiClient.get<{ data: CurrentUser }>('/auth/me');
  return response.data.data;
}

/**
 * Maps HTTP error responses to user-readable messages.
 * Keeps API-specific error semantics in one place.
 */
function mapAuthError(error: unknown, context: 'login' | 'register'): string {
  // Try to extract structured API error first
  const message = extractApiErrorMessage(error);

  // Check status code for well-known auth errors
  // axios-shaped error
  const status = (error as { response?: { status?: number } })?.response?.status;

  if (context === 'login' && status === 401) {
    return 'Incorrect email or password. Please try again.';
  }
  if (context === 'register' && status === 409) {
    return 'An account with this email already exists.';
  }
  if (status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (status && status >= 500) {
    return 'A server error occurred. Please try again later.';
  }
  if (!status) {
    // Network error — no response received
    return 'Unable to connect. Please check your connection and try again.';
  }

  // Fall back to the API-provided message
  return message || 'An unexpected error occurred.';
}

/**
 * POST /api/v1/auth/login
 * Returns the access token and its TTL on success.
 */
export async function login(payload: LoginFormValues): Promise<AuthTokenResponse> {
  return withSessionCookie(async () => {
    const response = await apiClient.post<AuthTokenResponse>('/auth/login', payload);
    return response.data;
  });
}

/**
 * POST /api/v1/auth/register
 * confirmPassword must NOT be included in payload — omit before calling.
 */
export async function register(payload: RegisterApiPayload): Promise<void> {
  await apiClient.post('/auth/register', payload);
}

/**
 * POST /api/v1/auth/logout
 * Sends the HttpOnly refresh cookie (browser-managed). Revokes the session.
 */
export async function logout(): Promise<void> {
  await withSessionCookie(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
    }
    useAuthStore.getState().clearAuth();
  });
}

/**
 * POST /api/v1/auth/refresh
 * Sends the HttpOnly refresh cookie. Returns a new access token.
 * Used by the axios interceptor for silent token refresh.
 */
export async function refreshToken(): Promise<AuthTokenResponse> {
  return refreshSession();
}

// Re-export the error mapper for use in page-level handlers
export { mapAuthError };
