import { useEffect, useRef, type PropsWithChildren } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/app/store/auth.store';
import { getCurrentUser, refreshToken } from '@/features/auth/api/auth.api';

/**
 * SessionProvider — attempts a silent token refresh on mount.
 *
 * Strategy:
 *   1. Set status → 'restoring'
 *   2. Call POST /auth/refresh (HttpOnly cookie is sent automatically)
 *   3. On 200 → store token → status 'authenticated'
 *   4. On any error → status 'unauthenticated' (cookie absent/expired/revoked)
 *
 * This runs once per page load. Subsequent token renewals are handled
 * by the axios response interceptor in api-client.ts.
 *
 */
export function SessionProvider({ children }: PropsWithChildren) {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setRestoring = useAuthStore((s) => s.setRestoring);
  const status = useAuthStore((s) => s.status);
  const sessionRevision = useAuthStore((s) => s.sessionRevision);
  const hasRun = useRef(false);

  useEffect(() => {
    // StrictMode fires effects twice in development — guard with a ref
    if (hasRun.current) return;
    hasRun.current = true;

    setRestoring();

    const revision = useAuthStore.getState().sessionRevision;
    void refreshToken().catch(() => {
      if (useAuthStore.getState().sessionRevision === revision) clearAuth();
    });
  }, [clearAuth, setRestoring]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    let cancelled = false;
    const isCurrent = () =>
      !cancelled && useAuthStore.getState().sessionRevision === sessionRevision;

    void getCurrentUser()
      .then((user) => {
        if (isCurrent()) useAuthStore.setState({ user });
      })
      .catch((error: unknown) => {
        if (isCurrent() && axios.isAxiosError(error) && error.response?.status === 404) clearAuth();
      });

    return () => {
      cancelled = true;
    };
  }, [status, sessionRevision, clearAuth]);

  return <>{children}</>;
}
