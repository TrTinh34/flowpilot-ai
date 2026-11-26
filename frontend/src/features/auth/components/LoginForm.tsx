import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schema';

interface LoginFormProps {
  /** Called with validated values; should return an error string on failure */
  onSubmit: (values: LoginFormValues) => Promise<string | null>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  async function handleFormSubmit(values: LoginFormValues) {
    setApiError(null);
    const error = await onSubmit(values);
    if (error) setApiError(error);
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(handleFormSubmit)(e)}
      noValidate
      aria-busy={isSubmitting}
    >
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
          Welcome back
        </h1>
        <p className="mt-1.5 text-[15px] text-[var(--foreground-secondary)]">
          Sign in to your account to continue
        </p>
      </div>

      {/* API error */}
      <FormErrorBanner message={apiError} className="mb-5" />

      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-[var(--color-error-text)]" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="pr-10"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              disabled={isSubmitting}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-sm"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              className="text-xs text-[var(--color-error-text)]"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="mt-6 w-full"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            <span>Signing in…</span>
            <span className="sr-only">Please wait</span>
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Register link */}
      <p className="mt-5 text-center text-sm text-[var(--foreground-secondary)]">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-sm"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
