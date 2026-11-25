import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const testDatabaseUrl = process.env['TEST_DATABASE_URL'];

describe.skipIf(!testDatabaseUrl)('auth sessions on PostgreSQL', () => {
  const input = { email: `${randomUUID()}@example.test`, password: 'Fixture only!' };
  let app: ReturnType<typeof import('../../src/app.js').createApp>;
  let db: typeof import('../../src/config/prisma.js');
  let repo: typeof import('../../src/modules/auth/refresh-token.repository.js');
  let tokens: typeof import('../../src/modules/auth/auth.tokens.js');
  let userId: string | undefined;

  beforeAll(async () => {
    const target = new URL(testDatabaseUrl!);
    if (
      !/^postgres(ql)?:$/.test(target.protocol) ||
      !/^\/[a-z0-9_]+_test$/i.test(target.pathname)
    ) {
      throw new Error(
        'TEST_DATABASE_URL must point to a separate PostgreSQL database ending in _test',
      );
    }
    vi.stubEnv('DATABASE_URL', testDatabaseUrl);
    db = await import('../../src/config/prisma.js');
    const [database] = await db.prisma.$queryRaw<
      [{ name: string }]
    >`SELECT current_database() AS name`;
    expect(database.name).toBe(target.pathname.slice(1));
    app = (await import('../../src/app.js')).createApp();
    repo = await import('../../src/modules/auth/refresh-token.repository.js');
    tokens = await import('../../src/modules/auth/auth.tokens.js');
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...input, displayName: 'Session fixture' });
    expect(res.status).toBe(201);
    userId = res.body.id;
  });

  afterAll(async () => {
    try {
      if (userId) {
        await db.prisma.$transaction([
          db.prisma.refreshToken.deleteMany({ where: { userId } }),
          db.prisma.user.delete({ where: { id: userId } }),
        ]);
      }
    } finally {
      await db?.disconnectDatabase();
      vi.unstubAllEnvs();
    }
  });

  function refresh(cookie: string) {
    return request(app).post('/api/v1/auth/refresh').set('Cookie', cookie);
  }

  async function login() {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ ...input, email: ` ${input.email.toUpperCase()} ` });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ accessToken: expect.any(String), expiresIn: 900 });
    const cookie = res.headers['set-cookie'][0].split(';')[0];
    const tokenHash = tokens.hashRefreshToken(cookie.slice('refresh_token='.length));
    const record = await db.prisma.refreshToken.findUniqueOrThrow({ where: { tokenHash } });
    expect(record.userId).toBe(userId);
    return { cookie, record };
  }

  it('does not persist a session for invalid credentials', async () => {
    const before = await db.prisma.refreshToken.count({ where: { userId } });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ ...input, password: 'wrong' });
    expect(res.status).toBe(401);
    expect(await db.prisma.refreshToken.count({ where: { userId } })).toBe(before);
  });

  it('rotates and commits reuse revocation only for the affected family', async () => {
    const initial = await login();
    const independent = await login();
    const rotated = await refresh(initial.cookie);
    expect(rotated.status).toBe(200);
    const rows = await db.prisma.refreshToken.findMany({
      where: { familyId: initial.record.familyId },
    });
    expect(rows).toHaveLength(2);
    expect(rows.find((row) => row.id === initial.record.id)?.revokedAt).toBeInstanceOf(Date);
    const next = rows.find((row) => row.id !== initial.record.id);
    expect(next?.expiresAt).toEqual(initial.record.expiresAt);
    const rotatedCookie = rotated.headers['set-cookie'][0].split(';')[0];
    expect(next?.tokenHash).toBe(
      tokens.hashRefreshToken(rotatedCookie.slice('refresh_token='.length)),
    );
    expect((await refresh(initial.cookie)).status).toBe(401);
    expect(
      await db.prisma.refreshToken.count({
        where: { familyId: initial.record.familyId, revokedAt: null },
      }),
    ).toBe(0);
    expect((await refresh(independent.cookie)).status).toBe(200);
  });

  it('creates one successor for concurrent use, then reuse revokes that successor', async () => {
    const { cookie, record } = await login();
    const responses = await Promise.all([refresh(cookie), refresh(cookie)]);
    expect(responses.map((res) => res.status).sort()).toEqual([200, 401]);
    const rows = await db.prisma.refreshToken.findMany({ where: { familyId: record.familyId } });
    expect(rows).toHaveLength(2);
    expect(rows.every((row) => row.revokedAt !== null)).toBe(true);
  });

  it('rolls back source revocation when the successor insert fails', async () => {
    const { cookie, record } = await login();
    const insert = repo.saveRefreshToken;
    const failure = vi
      .spyOn(repo, 'saveRefreshToken')
      .mockImplementationOnce((data, tx) => insert({ ...data, tokenHash: record.tokenHash }, tx));
    try {
      expect((await refresh(cookie)).status).toBe(500);
    } finally {
      failure.mockRestore();
    }
    expect(await db.prisma.refreshToken.findUnique({ where: { id: record.id } })).toMatchObject({
      revokedAt: null,
    });
    expect((await refresh(cookie)).status).toBe(200);
  });

  it('rejects expired and unknown tokens', async () => {
    const { cookie, record } = await login();
    await db.prisma.refreshToken.update({
      where: { id: record.id },
      data: { expiresAt: new Date(0) },
    });
    expect((await refresh(cookie)).status).toBe(401);
    expect((await refresh(`refresh_token=${tokens.generateRefreshToken()}`)).status).toBe(401);
  });
});
