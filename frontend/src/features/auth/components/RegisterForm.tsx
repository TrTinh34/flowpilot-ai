import { useId, useRef, useState, type FormEvent } from 'react';
import { useWatch, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Check, Circle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';
import {
  registerSchema,
  type RegisterApiPayload,
  type RegisterFormValues,
} from '@/features/auth/schemas/auth.schema';
import { cn } from '@/utils/cn.util';
import { AuthField } from './AuthField';
import { PasswordField } from './PasswordField';

interface RegisterFormProps {
  onSubmit: (values: RegisterApiPayload) => Promise<string | null>;
  onSuccess?: () => void;
}

export function RegisterForm({ onSubmit, onSuccess }: RegisterFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const submitting = useRef(false);
  const passwordGuideId = useId();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });
  const password = useWatch({ control, name: 'password' }) ?? '';
  const confirmPassword = useWatch({ control, name: 'confirmPassword' }) ?? '';
  const tooLong = new TextEncoder().encode(password).length > 72;
  const rules = [
    { label: 'Enter a password', met: Boolean(password) },
    {
      label: tooLong ? 'Password is too long' : 'Within the password length limit',
      met: Boolean(password) && !tooLong,
      invalid: tooLong,
    },
    { label: 'Passwords match', met: Boolean(confirmPassword) && password === confirmPassword },
  ];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setApiError(null);
    void handleSubmit(async ({ displayName, email, password }) => {
      const error = await onSubmit({ displayName, email, password });
      if (error) {
        setApiError(error);
      } else {
        setIsSuccess(true);
        onSuccess?.();
      }
    })(event).finally(() => {
      submitting.current = false;
    });
  }

  if (isSuccess) {
    return (
      <div className="space-y-5">
        <span className="grid size-11 place-items-center rounded-full bg-[var(--color-success-bg)] text-[var(--success-text)]">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <div role="status" className="space-y-1">
          <h1
            className="text-page-title"
            tabIndex={-1}
            ref={(element) => {
              element?.focus();
            }}
          >
            Account created
          </h1>
          <p className="text-secondary">Your account has been created. Sign in to get started.</p>
        </div>
        <Button asChild className="w-full">
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-busy={isSubmitting} className="space-y-5">
      <header>
        <h1 className="text-page-title">Create your account</h1>
        <p className="mt-1 text-secondary">Set up your FlowPilot AI account.</p>
      </header>
      <FormErrorBanner message={apiError} />
      <div className="space-y-4">
        <AuthField
          id="displayName"
          label="Display name"
          autoComplete="name"
          error={errors.displayName?.message}
          readOnly={isSubmitting}
          {...register('displayName')}
        />
        <AuthField
          id="reg-email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          readOnly={isSubmitting}
          {...register('email')}
        />
        <PasswordField
          id="reg-password"
          label="Password"
          autoComplete="new-password"
          descriptionId={passwordGuideId}
          error={errors.password?.message}
          readOnly={isSubmitting}
          {...register('password')}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          readOnly={isSubmitting}
          {...register('confirmPassword')}
        />
        <ul
          id={passwordGuideId}
          aria-label="Password requirements"
          className="space-y-1.5 rounded-[var(--radius-md)] border border-border bg-muted px-3 py-2.5"
        >
          {rules.map(({ label, met, invalid }) => {
            const Icon = invalid ? X : met ? Check : Circle;
            return (
              <li
                key={label}
                className={cn(
                  'flex items-center gap-2 text-xs',
                  invalid
                    ? 'text-[var(--color-error-text)]'
                    : met
                      ? 'text-[var(--success-text)]'
                      : 'text-muted-foreground',
                )}
              >
                <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {label}
                  <span className="sr-only"> {met ? 'satisfied' : 'not yet satisfied'}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="size-4 motion-safe:animate-spin" aria-hidden="true" />}
        {isSubmitting ? 'Creating account…' : 'Create Account'}
      </Button>
      <p className="text-center text-secondary">
        Already have an account?{' '}
        <Link
          to="/login"
          className="rounded-sm font-medium text-action-link underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
