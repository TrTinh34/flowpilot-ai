import { z } from 'zod';

// ─── Field primitives ────────────────────────────────────────────────────────

const emailField = z.string().min(1, 'Email is required').email('Enter a valid email address');

/**
 * Password validation matches the backend bcrypt limit exactly.
 * Backend: z.string().min(1).refine(v => Buffer.byteLength(v, 'utf8') <= 72)
 * We mirror this — no strength policy (uppercase / symbol) is enforced.
 */
const passwordField = z
  .string()
  .min(1, 'Password is required')
  .refine(
    (v) => new TextEncoder().encode(v).length <= 72,
    'Password must be 72 bytes or fewer (UTF-8)',
  );

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Register ────────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(1, 'Display name is required'),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * API payload — confirmPassword is NOT sent to the backend.
 * OpenAPI /auth/register only accepts: { displayName, email, password }
 */
export type RegisterApiPayload = Omit<RegisterFormValues, 'confirmPassword'>;
