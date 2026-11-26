import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { login, mapAuthError } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/app/store/auth.store';
import type { LoginFormValues } from '@/features/auth/schemas/auth.schema';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  // If the user was redirected here from a protected route, go back there after login
  const from =
    (location.state as { from?: { pathname: string; search?: string; hash?: string } } | null)
      ?.from ?? '/';

  async function handleLogin(values: LoginFormValues): Promise<string | null> {
    try {
      const result = await login(values);
      // Store access token in-memory (Zustand).
      // Refresh token is in an HttpOnly cookie — we never touch it from JS.
      // SessionProvider loads the profile for the new session.
      setAuth(result.accessToken, result.expiresIn, null);
      navigate(from, { replace: true });
      return null;
    } catch (error) {
      return mapAuthError(error, 'login');
    }
  }

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  );
}
