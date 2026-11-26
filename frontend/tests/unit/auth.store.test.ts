import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore, selectIsAuthenticated, selectIsRestoring } from '@/app/store/auth.store';

// Reset store state between tests
function resetStore() {
  useAuthStore.setState({
    accessToken: null,
    expiresAt: null,
    user: null,
    status: 'idle',
  });
}

describe('auth.store', () => {
  beforeEach(resetStore);

  // ── Initial state ───────────────────────────────────────────────────────

  it('starts with idle status and no token', () => {
    const state = useAuthStore.getState();
    expect(state.status).toBe('idle');
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
  });

  // ── setRestoring ────────────────────────────────────────────────────────

  it('setRestoring transitions status to restoring', () => {
    useAuthStore.getState().setRestoring();
    expect(useAuthStore.getState().status).toBe('restoring');
  });

  // ── setAuth ─────────────────────────────────────────────────────────────

  it('setAuth stores token, computes expiresAt, and sets status authenticated', () => {
    const before = Date.now();
    useAuthStore.getState().setAuth('tok_abc', 900, { id: '1', email: 'a@a.com', displayName: 'Alice' });
    const state = useAuthStore.getState();

    expect(state.status).toBe('authenticated');
    expect(state.accessToken).toBe('tok_abc');
    expect(state.user?.email).toBe('a@a.com');
    // expiresAt should be ~900s from now
    expect(state.expiresAt).toBeGreaterThanOrEqual(before + 900_000);
    expect(state.expiresAt).toBeLessThan(before + 901_000);
  });

  it('setAuth accepts null user (GET /me not yet available)', () => {
    useAuthStore.getState().setAuth('tok_xyz', 900, null);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().status).toBe('authenticated');
  });

  // ── clearAuth ───────────────────────────────────────────────────────────

  it('clearAuth resets all fields to unauthenticated', () => {
    useAuthStore.getState().setAuth('tok_abc', 900, null);
    useAuthStore.getState().clearAuth();
    const state = useAuthStore.getState();

    expect(state.status).toBe('unauthenticated');
    expect(state.accessToken).toBeNull();
    expect(state.expiresAt).toBeNull();
    expect(state.user).toBeNull();
  });

  // ── updateToken ─────────────────────────────────────────────────────────

  it('updateToken replaces the token without changing user', () => {
    useAuthStore.getState().setAuth('old_tok', 900, { id: '1', email: 'a@a.com', displayName: 'Alice' });
    useAuthStore.getState().updateToken('new_tok', 900);

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('new_tok');
    expect(state.user?.email).toBe('a@a.com'); // unchanged
    expect(state.status).toBe('authenticated');
  });

  // ── Selectors ───────────────────────────────────────────────────────────

  describe('selectIsRestoring', () => {
    it('returns true when status is idle', () => {
      useAuthStore.setState({ status: 'idle' });
      expect(selectIsRestoring(useAuthStore.getState())).toBe(true);
    });

    it('returns true when status is restoring', () => {
      useAuthStore.setState({ status: 'restoring' });
      expect(selectIsRestoring(useAuthStore.getState())).toBe(true);
    });

    it('returns false when authenticated', () => {
      useAuthStore.setState({ status: 'authenticated', accessToken: 'tok' });
      expect(selectIsRestoring(useAuthStore.getState())).toBe(false);
    });

    it('returns false when unauthenticated', () => {
      useAuthStore.setState({ status: 'unauthenticated' });
      expect(selectIsRestoring(useAuthStore.getState())).toBe(false);
    });
  });

  describe('selectIsAuthenticated', () => {
    it('returns true only when authenticated and token present', () => {
      useAuthStore.setState({ status: 'authenticated', accessToken: 'tok' });
      expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true);
    });

    it('returns false when status authenticated but token is null', () => {
      useAuthStore.setState({ status: 'authenticated', accessToken: null });
      expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false);
    });

    it('returns false when unauthenticated', () => {
      useAuthStore.setState({ status: 'unauthenticated', accessToken: null });
      expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false);
    });
  });
});
