import { useEffect, useState } from 'react';
import { useWatch, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Check, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/auth.schema';
import { cn } from '@/utils/cn.util';

interface RegisterFormProps {
  onSubmit: (values: Omit<RegisterFormValues, 'confirmPassword'>) => Promise<string | null>;
  /** Show success state instead of the form (set by parent after 201) */
  onSuccess?: () => void;
}

/** Password guidance rule state */
function usePasswordRules(password: string, confirmPassword: string) {
  const hasValue = password.length > 0;
  // Check actual byte length — bcrypt silently truncates at 72 bytes.
  // We show a friendly message instead of exposing "UTF-8 bytes".
  const byteLen = hasValue ? new TextEncoder().encode(password).length : 0;
  const withinLimit = hasValue && byteLen <= 72;
  const matches = confirmPassword.length > 0 && password === confirmPassword;
  return [
    { key: 'hasValue', label: 'At least 1 character', met: hasValue },
    {
      key: 'withinLimit',
      label: byteLen > 72 ? 'Password is too long' : 'Password length is valid',
      met: withinLimit,
      // Show as error (not neutral) only after the user typed and exceeded
      isError: hasValue && !withinLimit,
    },
    { key: 'matches', label: 'Passwords match', met: matches },
  ];
}

export function RegisterForm({ onSubmit, onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const password = useWatch({ control, name: 'password' }) ?? '';
  const confirmPassword = useWatch({ control, name: 'confirmPassword' }) ?? '';
  const rules = usePasswordRules(password, confirmPassword);

  // Clear error message when a new submit starts
  useEffect(() => {
    if (apiError && !isSubmitting) {
      // Keep error until next submit — do nothing here
    }
  }, [apiError, isSubmitting]);

  async function handleFormSubmit(values: RegisterFormValues) {
    setApiError(null);
    // Strip confirmPassword — OpenAPI only accepts { displayName, email, password }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _confirmPassword, ...apiPayload } = values;
    const error = await onSubmit(apiPayload);
    if (error) {
      setApiError(error);
    } else {
      setIsSuccess(true);
      onSuccess?.();
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-center gap-5 py-8">
        <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-success-bg)] ring-1 ring-[var(--color-success-border)]">
          <Check className="size-7 text-green-600" aria-hidden="true" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Account created</h2>
          <p className="mt-1.5 text-sm text-[var(--foreground-secondary)]">
            Your account has been created. Sign in to get started.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  // ── Register form ───────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={(e) => void handleSubmit(handleFormSubmit)(e)}
      noValidate
      aria-busy={isSubmitting}
    >
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-[var(--foreground)]">
          Create your account
        </h1>
        <p className="mt-1.5 text-[15px] text-[var(--foreground-secondary)]">
          Get started with FlowPilot AI today
        </p>
      </div>

      {/* API error */}
      <FormErrorBanner message={apiError} className="mb-5" />

      <div className="space-y-4">
        {/* Display name */}
        <div className="space-y-1.5">
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.displayName}
            aria-describedby={errors.displayName ? 'displayName-error' : undefined}
            disabled={isSubmitting}
            {...register('displayName')}
          />
          {errors.displayName && (
            <p
              id="displayName-error"
              className="text-xs text-[var(--color-error-text)]"
              role="alert"
            >
              {errors.displayName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-email">Email address</Label>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'reg-email-error' : undefined}
            disabled={isSubmitting}
            {...register('email')}
          />
          {errors.email && (
            <p id="reg-email-error" className="text-xs text-[var(--color-error-text)]" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-password">Password</Label>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a password"
              className="pr-10"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'reg-password-error' : undefined}
              disabled={isSubmitting}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              id="reg-password-error"
              className="text-xs text-[var(--color-error-text)]"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className="pr-10"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              disabled={isSubmitting}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-sm"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              id="confirmPassword-error"
              className="text-xs text-[var(--color-error-text)]"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Password guidance — dynamic checkmarks */}
        <ul
          aria-label="Password requirements"
          className="flex flex-col gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-3.5 py-3 sm:flex-row sm:gap-3"
        >
          {rules.map((rule) => (
            <li
              key={rule.key}
              className={cn(
                'flex items-center gap-1.5 text-[11px] leading-snug transition-colors flex-1',
                rule.isError
                  ? 'text-[var(--color-error-text)]'
                  : rule.met
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-[var(--foreground-muted)]',
              )}
            >
              {rule.isError ? (
                <X className="size-3 shrink-0" aria-hidden="true" />
              ) : rule.met ? (
                <Check className="size-3 shrink-0" aria-hidden="true" />
              ) : (
                <div
                  className="size-3 shrink-0 rounded-full border border-current opacity-40"
                  aria-hidden="true"
                />
              )}
              <span>{rule.label}</span>
              <span className="sr-only">{rule.met ? 'satisfied' : 'not yet satisfied'}</span>
            </li>
          ))}
        </ul>
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
            <span>Creating account…</span>
            <span className="sr-only">Please wait</span>
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* Login link */}
      <p className="mt-5 text-center text-sm text-[var(--foreground-secondary)]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-action-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
