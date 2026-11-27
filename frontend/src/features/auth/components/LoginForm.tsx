import { useRef, useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schema';
import { AuthField } from './AuthField';
import { PasswordField } from './PasswordField';

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<string | null>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const submitting = useRef(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setApiError(null);
    void handleSubmit(async (values) => setApiError(await onSubmit(values)))(event).finally(() => {
      submitting.current = false;
    });
  }

  return (
    <form onSubmit={submit} noValidate aria-busy={isSubmitting} className="space-y-5">
      <header>
        <h1 className="text-page-title">Welcome back</h1>
        <p className="mt-1 text-secondary">Sign in to your FlowPilot AI workspace.</p>
      </header>
      <FormErrorBanner message={apiError} />
      <div className="space-y-4">
        <AuthField
          id="email"
          label="Email address"
          type="email"
          autoComplete="username"
          placeholder="you@company.com"
          error={errors.email?.message}
          readOnly={isSubmitting}
          {...register('email')}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          readOnly={isSubmitting}
          {...register('password')}
        />
      </div>
      <Button type="submit" size="comfortable" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="size-4 motion-safe:animate-spin" aria-hidden="true" />}
        {isSubmitting ? 'Signing in…' : 'Sign In'}
      </Button>
      <p className="text-center text-secondary">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="rounded-sm font-medium text-action-link underline underline-offset-4"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
