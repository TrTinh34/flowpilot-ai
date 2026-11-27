import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/app/store/auth.store';
import { useWorkspaceStore } from '@/app/store/workspace.store';

/**
 * Provides a logout function that:
 * 1. Calls POST /auth/logout (revokes refresh token server-side)
 * 2. Clears auth store (access token, user)
 * 3. Clears workspace selection
 * 4. Navigates to /login
 *
 * Best-effort: if the API call fails we still clear local state.
 */
export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearWorkspace = useWorkspaceStore((s) => s.clearActiveWorkspace);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await apiLogout();
    } catch {
      // Best-effort — clear local state regardless
    } finally {
      clearAuth();
      clearWorkspace();
      navigate('/login', { replace: true });
      setIsLoggingOut(false);
    }
  }, [clearAuth, clearWorkspace, navigate]);

  return { logout, isLoggingOut };
}
