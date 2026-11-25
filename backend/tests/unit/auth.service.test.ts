import { compare } from 'bcryptjs';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/modules/auth/auth.repository.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/modules/auth/auth.repository.js')>()),
  emailExists: vi.fn(),
  createUser: vi.fn(),
}));

import { Prisma } from '../../src/generated/prisma/client.js';
import { createApp } from '../../src/app.js';
import { createUser, emailExists } from '../../src/modules/auth/auth.repository.js';
import { register } from '../../src/modules/auth/auth.service.js';

const input = { email: ' Test@Example.com ', password: ' test-password ', displayName: 'Test' };
const user = {
  id: 'test-id',
  email: 'test@example.com',
  displayName: 'Test',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('register service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(emailExists).mockResolvedValue(false);
    vi.mocked(createUser).mockResolvedValue(user);
  });

  it('normalizes email, hashes the original password and returns the selected user', async () => {
    const result = await register(input);
    expect(emailExists).toHaveBeenCalledWith(user.email);
    const [write] = vi.mocked(createUser).mock.calls[0];
    expect(write).toMatchObject({ email: user.email, displayName: user.displayName });
    expect(write.passwordHash).not.toBe(input.password);
    expect(await compare(input.password, write.passwordHash)).toBe(true);
    expect(result).toEqual(user);
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('rejects an existing email before creating the user', async () => {
    vi.mocked(emailExists).mockResolvedValue(true);
    await expect(register(input)).rejects.toMatchObject({ statusCode: 409 });
    expect(createUser).not.toHaveBeenCalled();
  });

  it('maps the email index violation but preserves other database errors', async () => {
    const duplicate = new Prisma.PrismaClientKnownRequestError('Unique violation', {
      code: 'P2002',
      clientVersion: '7.10.1',
      meta: { driverAdapterError: { cause: { constraint: { index: 'users_email_lower_uidx' } } } },
    });
    vi.mocked(createUser).mockRejectedValueOnce(duplicate);
    await expect(register(input)).rejects.toMatchObject({ code: 'EMAIL_ALREADY_EXISTS' });

    const unavailable = new Error('Database unavailable');
    vi.mocked(emailExists).mockRejectedValueOnce(unavailable);
    await expect(register(input)).rejects.toBe(unavailable);
  });

  it('returns a generic HTTP 500 when the repository fails', async () => {
    vi.mocked(emailExists).mockRejectedValue(new Error('Private database diagnostics'));
    const res = await request(createApp()).post('/api/v1/auth/register').send(input);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected internal error occurred',
      requestId: res.headers['x-request-id'],
    });
  });
});
