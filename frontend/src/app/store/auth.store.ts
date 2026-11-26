import { create } from 'zustand';
import type { AuthUser } from '@/features/auth/types/auth.types';

// ─── State shape ─────────────────────────────────────────────────────────────

export type AuthStatus =
  | 'idle'          // app just mounted, not yet attempted session restore
  | 'restoring'     // attempting silent refresh to restore session
  | 'authenticated' // has a valid access token
  | 'unauthenticated'; // no valid session

export interface AuthStore {
  /** In-memory access token. NEVER persisted to localStorage. */
  accessToken: string | null;
  /** Unix timestamp (ms) when the access token expires */
  expiresAt: number | null;
  /** Authenticated user profile */
  user: AuthUser | null;
  /** Current session lifecycle status */
  status: AuthStatus;
  sessionRevision: number;

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Store a fresh token + user after login or successful refresh.
   * expiresIn is seconds (matches the API field).
   */
  setAuth: (accessToken: string, expiresIn: number, user: AuthUser | null) => void;

  /**
   * Clear all auth state. Called on logout or failed refresh.
   */
  clearAuth: () => void;

  /**
   * Transition to 'restoring' while silent refresh is in flight.
   */
  setRestoring: () => void;

  /**
   * Update the in-memory token without changing user profile.
   * Used by the axios interceptor after a silent refresh.
   */
  updateToken: (accessToken: string, expiresIn: number) => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  expiresAt: null,
  user: null,
  status: 'idle',
  sessionRevision: 0,

  setAuth(accessToken, expiresIn, user) {
    set((state) => ({
      accessToken,
      expiresAt: Date.now() + expiresIn * 1000,
      user,
      status: 'authenticated',
      sessionRevision: state.sessionRevision + 1,
    }));
  },

  clearAuth() {
    set((state) => ({
      accessToken: null,
      expiresAt: null,
      user: null,
      status: 'unauthenticated',
      sessionRevision: state.sessionRevision + 1,
    }));
  },

  setRestoring() {
    set({ status: 'restoring' });
  },

  updateToken(accessToken, expiresIn) {
    set({
      accessToken,
      expiresAt: Date.now() + expiresIn * 1000,
      status: 'authenticated',
    });
  },
}));

// ─── Selector helpers ─────────────────────────────────────────────────────────

/** True when the app is still determining session status */
export const selectIsRestoring = (s: AuthStore) =>
  s.status === 'idle' || s.status === 'restoring';

export const selectIsAuthenticated = (s: AuthStore) =>
  s.status === 'authenticated' && s.accessToken !== null;

export const selectAccessToken = (s: AuthStore) => s.accessToken;
