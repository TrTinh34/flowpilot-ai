// ─── API Response shapes ─────────────────────────────────────────────────────

/** Returned by POST /auth/login and POST /auth/refresh */
export interface AuthTokenResponse {
  accessToken: string;
  expiresIn: number; // seconds
}

/** Minimal user profile stored in auth state */
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

// ─── Auth state (Zustand — implemented in AUTH-10) ───────────────────────────

export interface AuthState {
  accessToken: string | null;
  /** Unix timestamp (ms) when the access token expires */
  expiresAt: number | null;
  user: AuthUser | null;
}
