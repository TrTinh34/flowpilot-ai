import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '@/features/auth/api/auth.api';

export function useLogout() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function logout() {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      await apiLogout();
      navigate('/login', { replace: true });
    } catch {
      setLogoutError('Unable to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return { logout, isLoggingOut, logoutError };
}
