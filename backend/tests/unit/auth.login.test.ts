import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { findUserCredentials } from '../../src/modules/auth/auth.repository.js';
import { loginSchema } from '../../src/modules/auth/auth.schema.js';
import { verifyLoginCredentials } from '../../src/modules/auth/auth.service.js';
import { hashPassword, verifyPassword } from '../../src/utils/crypto.util.js';

vi.mock('../../src/modules/auth/auth.repository.js', () => ({
  findUserCredentials: vi.fn(),
}));
vi.mock('../../src/utils/crypto.util.js', { spy: true });

const input = { email: ' User@Example.test ', password: ' fixture password ' };
let passwordHash: string;

describe('login validation', () => {
  it('trims surrounding email whitespace and preserves the password verbatim', () => {
    expect(loginSchema.parse(input)).toEqual({
      email: 'User@Example.test',
      password: input.password,
    });
  });

  it.each([
    null,
    { password: input.password },
    { email: input.email },
    { ...input, email: 'invalid' },
    { ...input, password: 123 },
    { ...input, password: '' },
    { ...input, password: 'é'.repeat(37) },
    { ...input, role: 'OWNER' },
  ])('rejects invalid credentials input %#', (body) => {
    expect(loginSchema.safeParse(body).success).toBe(false);
  });
});

describe('verifyLoginCredentials', () => {
  beforeAll(async () => {
    passwordHash = await hashPassword(input.password);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(findUserCredentials).mockResolvedValue({ id: 'fixture-user', passwordHash });
  });

  it('looks up normalized email, verifies the original password and returns only userId', async () => {
    await expect(verifyLoginCredentials(loginSchema.parse(input))).resolves.toEqual({
      userId: 'fixture-user',
    });
    expect(findUserCredentials).toHaveBeenCalledWith('user@example.test');
    expect(verifyPassword).toHaveBeenCalledWith(input.password, passwordHash);
  });

  it.each(['missing user', 'wrong password'])(
    'uses identical credentials errors for %s',
    async (scenario) => {
      if (scenario === 'missing user') {
        vi.mocked(findUserCredentials).mockResolvedValue(null);
      }
      await expect(verifyLoginCredentials({ ...input, password: 'wrong' })).rejects.toMatchObject({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.',
      });
      expect(verifyPassword).toHaveBeenCalledExactlyOnceWith(
        'wrong',
        expect.stringMatching(/^\$2b\$12\$/),
      );
    },
  );

  it('returns a safe error if the repository fails', async () => {
    vi.mocked(findUserCredentials).mockRejectedValue(new Error('private PostgreSQL diagnostics'));
    await expect(verifyLoginCredentials(input)).rejects.toMatchObject({
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected internal error occurred',
    });
    expect(verifyPassword).not.toHaveBeenCalled();
  });
});
