import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from '@/features/auth/schemas/auth.schema';

// ─── loginSchema ─────────────────────────────────────────────────────────────

describe('loginSchema', () => {
  it('accepts a valid login payload', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'correct-password',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Email is required');
    }
  });

  it('rejects a malformed email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Enter a valid email address');
    }
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Password is required');
    }
  });

  it('rejects a password longer than 72 UTF-8 bytes', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      // 73 one-byte chars
      password: 'a'.repeat(73),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('72 bytes');
    }
  });

  it('accepts a password of exactly 72 UTF-8 bytes', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'a'.repeat(72),
    });
    expect(result.success).toBe(true);
  });

  it('rejects a password exceeding 72 bytes via multi-byte characters', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      // 25 × 3-byte chars = 75 bytes
      password: 'あ'.repeat(25),
    });
    expect(result.success).toBe(false);
  });
});

// ─── registerSchema ──────────────────────────────────────────────────────────

describe('registerSchema', () => {
  const validPayload = {
    displayName: 'John Doe',
    email: 'user@example.com',
    password: 'secure-password',
    confirmPassword: 'secure-password',
  };

  it('accepts a valid registration payload', () => {
    const result = registerSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('rejects an empty display name', () => {
    const result = registerSchema.safeParse({ ...validPayload, displayName: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Display name is required');
    }
  });

  it('trims whitespace around the display name', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      displayName: '  John Doe  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.displayName).toBe('John Doe');
    }
  });

  it('rejects when confirm password does not match', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      confirmPassword: 'different-password',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'confirmPassword');
      expect(issue?.message).toBe("Passwords don't match");
    }
  });

  it('rejects when confirm password is empty', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      confirmPassword: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      ...validPayload,
      email: 'bad-email',
    });
    expect(result.success).toBe(false);
  });
});
