import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { login, mapAuthError } from '@/features/auth/api/auth.api';
import type { LoginFormValues } from '@/features/auth/schemas/auth.schema';

/**
 * Login page — composes AuthLayout + LoginForm.
 * Handles API call and success/error routing.
 * (Token state integration arrives in AUTH-10; for now,
 *  a successful login shows a success path via navigation.)
 */
export function LoginPage() {
  const navigate = useNavigate();

  async function handleLogin(values: LoginFormValues): Promise<string | null> {
    try {
      const result = await login(values);
      // AUTH-10 will store the token in Zustand auth store.
      // For now, treat a 200 with accessToken as success.
      if (result?.accessToken) {
        // Navigate to app root (dashboard arrives in Sprint 2)
        navigate('/', { replace: true });
        return null;
      }
      return 'Unexpected response from server. Please try again.';
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
