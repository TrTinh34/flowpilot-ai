import { AuthLayout } from '@/layouts/AuthLayout';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { register, mapAuthError } from '@/features/auth/api/auth.api';
import type { RegisterApiPayload } from '@/features/auth/schemas/auth.schema';

/**
 * Register page — composes AuthLayout + RegisterForm.
 * Handles API call and delegates success state display to RegisterForm.
 */
export function RegisterPage() {
  async function handleRegister(payload: RegisterApiPayload): Promise<string | null> {
    try {
      await register(payload);
      return null; // success
    } catch (error) {
      return mapAuthError(error, 'register');
    }
  }

  return (
    <AuthLayout>
      <RegisterForm onSubmit={handleRegister} />
    </AuthLayout>
  );
}
