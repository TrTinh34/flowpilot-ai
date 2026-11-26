import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

// ─── Test helpers ────────────────────────────────────────────────────────────

function renderLoginForm(
  onSubmit: (values: unknown) => Promise<string | null> = vi.fn().mockResolvedValue(null),
) {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginForm onSubmit={onSubmit as never} />
    </MemoryRouter>,
  );
}

function renderRegisterForm(
  onSubmit: (values: unknown) => Promise<string | null> = vi.fn().mockResolvedValue(null),
) {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <RegisterForm onSubmit={onSubmit as never} />
    </MemoryRouter>,
  );
}

// ─── LoginForm ────────────────────────────────────────────────────────────────

describe('LoginForm', () => {
  it('renders email, password, submit button, and register link', () => {
    renderLoginForm();

    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create one' })).toHaveAttribute(
      'href',
      '/register',
    );
  });

  it('shows a show/hide password toggle with accessible label', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const toggle = screen.getByRole('button', { name: 'Show password' });
    await user.click(toggle);
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    expect(passwordInput.type).toBe('text');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(passwordInput.type).toBe('password');
  });

  it('displays validation errors when submitted empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderLoginForm(onSubmit as never);

    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('displays an error for a malformed email', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText('Email address'), 'bad-email');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(
      await screen.findByText('Enter a valid email address'),
    ).toBeInTheDocument();
  });

  it('marks invalid fields with aria-invalid', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    await screen.findByText('Email is required');

    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables submit and shows loading state while submitting', async () => {
    const user = userEvent.setup();
    let resolvePromise: (value: string | null) => void;
    const onSubmit = vi.fn().mockImplementation(
      () =>
        new Promise<string | null>((resolve) => {
          resolvePromise = resolve;
        }),
    );
    renderLoginForm(onSubmit as never);

    await user.type(screen.getByLabelText('Email address'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    // Loading state
    expect(screen.getByRole('button', { name: /Signing in/i })).toBeDisabled();
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });

    resolvePromise!(null);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign In' })).not.toBeDisabled();
    });
  });

  it('displays the API error message on failure', async () => {
    const user = userEvent.setup();
    const onSubmit = vi
      .fn()
      .mockResolvedValue('Incorrect email or password. Please try again.');
    renderLoginForm(onSubmit as never);

    await user.type(screen.getByLabelText('Email address'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(
      await screen.findByText('Incorrect email or password. Please try again.'),
    ).toBeInTheDocument();
  });
});

// ─── RegisterForm ─────────────────────────────────────────────────────────────

describe('RegisterForm', () => {
  it('renders all four fields with labels, submit, and login link', () => {
    renderRegisterForm();

    expect(screen.getByLabelText('Display name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login');
  });

  it('displays validation errors when submitted empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderRegisterForm(onSubmit as never);

    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText('Display name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('displays mismatch error when passwords differ', async () => {
    const user = userEvent.setup();
    renderRegisterForm();

    await user.type(screen.getByLabelText('Display name'), 'John');
    await user.type(screen.getByLabelText('Email address'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password-abc');
    await user.type(screen.getByLabelText('Confirm password'), 'password-xyz');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText("Passwords don't match")).toBeInTheDocument();
  });

  it('strips confirmPassword from the submitted payload', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(null);
    renderRegisterForm(onSubmit as never);

    await user.type(screen.getByLabelText('Display name'), 'John Doe');
    await user.type(screen.getByLabelText('Email address'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password-abc');
    await user.type(screen.getByLabelText('Confirm password'), 'password-abc');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    const payload = onSubmit.mock.calls[0][0] as Record<string, unknown>;
    expect(payload).not.toHaveProperty('confirmPassword');
    expect(payload).toEqual({
      displayName: 'John Doe',
      email: 'john@example.com',
      password: 'password-abc',
    });
  });

  it('shows success state after a successful registration', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(null);
    renderRegisterForm(onSubmit as never);

    await user.type(screen.getByLabelText('Display name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email address'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'password-abc');
    await user.type(screen.getByLabelText('Confirm password'), 'password-abc');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText('Account created')).toBeInTheDocument();
    expect(screen.getByText(/Your account has been created/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('displays the API error when registration fails', async () => {
    const user = userEvent.setup();
    const onSubmit = vi
      .fn()
      .mockResolvedValue('An account with this email already exists.');
    renderRegisterForm(onSubmit as never);

    await user.type(screen.getByLabelText('Display name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email address'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'password-abc');
    await user.type(screen.getByLabelText('Confirm password'), 'password-abc');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(
      await screen.findByText('An account with this email already exists.'),
    ).toBeInTheDocument();
  });
});
