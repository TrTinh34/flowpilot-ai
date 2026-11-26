import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectIsRestoring } from '@/app/store/auth.store';

/**
 * Guards authenticated routes.
 *
 * Status transitions:
 *   'idle' | 'restoring'  → show full-page spinner (session restore in progress)
 *   'authenticated'       → render children via <Outlet />
 *   'unauthenticated'     → redirect /login, preserve intended destination
 */
export function ProtectedRoute() {
  const isRestoring = useAuthStore(selectIsRestoring);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (isRestoring) {
    return <SessionRestoreSpinner />;
  }

  if (!isAuthenticated) {
    // Preserve the intended URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

/**
 * Redirect authenticated users away from public auth routes.
 * Renders children only when NOT authenticated.
 */
export function PublicOnlyRoute({ redirectTo = '/' }: { redirectTo?: string }) {
  const isRestoring = useAuthStore(selectIsRestoring);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (isRestoring) {
    return <SessionRestoreSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

/** Full-page spinner shown while session restoration is in progress */
function SessionRestoreSpinner() {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-[var(--background)]"
      role="status"
      aria-label="Restoring your session"
    >
      <div className="flex flex-col items-center gap-3">
        {/* Animated ring */}
        <div
          className="size-9 rounded-full border-[3px] border-[var(--border)] border-t-[var(--color-primary)] animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-[var(--foreground-secondary)]">Loading…</p>
      </div>
    </div>
  );
}
