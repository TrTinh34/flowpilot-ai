import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { decodeJwt } from 'jose';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

const testDatabaseUrl = process.env['TEST_DATABASE_URL'];

describe.skipIf(!testDatabaseUrl)('auth sessions on PostgreSQL', () => {
  const input = { email: `${randomUUID()}@example.test`, password: 'Fixture only!' };
  let app: ReturnType<typeof import('../../src/app.js').createApp>;
  let db: typeof import('../../src/config/prisma.js');
  let authModule: typeof import('../../src/modules/auth/auth.module.js').authModule;
  let tokens: {
    hashRefreshToken: (t: string) => string;
    generateRefreshToken: () => string;
    verifyAccessToken: (t: string) => Promise<{ userId: string }>;
    issueAccessToken: (u: string) => Promise<string>;
  };
  let userId: string | undefined;

  beforeAll(async () => {
    await confirmTestDatabase();
    db = await import('../../src/config/prisma.js');
    app = (await import('../../src/app.js')).createApp();
    authModule = (await import('../../src/modules/auth/auth.module.js')).authModule;
    tokens = {
      hashRefreshToken: (t) => authModule.refreshTokenService.hashRefreshToken(t),
      generateRefreshToken: () => authModule.refreshTokenService.generateRefreshToken(),
      verifyAccessToken: (t) => authModule.accessTokenVerifier.verifyAccessToken(t),
      issueAccessToken: (u) => authModule.accessTokenIssuer.issueAccessToken(u),
    };
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
    }
  });

  function refresh(cookie: string) {
    return request(app).post('/api/v1/auth/refresh').set('Cookie', cookie);
  }

  function logout(cookie: string) {
    return request(app).post('/api/v1/auth/logout').set('Cookie', cookie);
  }

  function currentUser(accessToken: string) {
    return request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${accessToken}`);
  }

  async function login(email = ` ${input.email.toUpperCase()} `) {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ ...input, email });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ accessToken: expect.any(String), expiresIn: 900 });
    const cookie = res.headers['set-cookie'][0].split(';')[0];
    const tokenHash = tokens.hashRefreshToken(cookie.slice('refresh_token='.length));
    const record = await db.prisma.refreshToken.findUniqueOrThrow({ where: { tokenHash } });
    expect(record.userId).toBe(userId);
    expect(record.expiresAt.getTime() - record.createdAt.getTime()).toBeGreaterThan(604_790_000);
    expect(record.expiresAt.getTime() - record.createdAt.getTime()).toBeLessThanOrEqual(
      604_800_000,
    );
    expect(record.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(res.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(res.headers['set-cookie'][0]).toContain('Path=/api/v1/auth');
    expect(res.headers['set-cookie'][0]).toContain('SameSite=Lax');
    const claims = decodeJwt(res.body.accessToken);
    expect(Object.keys(claims).sort()).toEqual(['aud', 'exp', 'iat', 'iss', 'sub']);
    expect(claims).toMatchObject({ sub: userId, iss: 'flowpilot-ai', aud: 'flowpilot-ai-api' });
    expect(Number(claims.exp) - Number(claims.iat)).toBe(900);
    await expect(tokens.verifyAccessToken(res.body.accessToken)).resolves.toEqual({ userId });
    return { cookie, record, accessToken: res.body.accessToken as string };
  }

  async function withRejection(
    record: { id: string; familyId: string },
    operation: 'insert' | 'revoke',
    test: () => Promise<void>,
  ) {
    await confirmTestDatabase();
    for (const id of [record.id, record.familyId]) {
      if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(id)) {
        throw new Error('Expected a fixture UUID for test DDL');
      }
    }
    // The validated UUIDs limit this test-only CHECK to one fixture.
    const name = `fixture_${record.id.replaceAll('-', '')}`;
    const check =
      operation === 'insert'
        ? `family_id <> '${record.familyId}' OR id = '${record.id}'`
        : `id <> '${record.id}' OR revoked_at IS NULL`;
    await db.prisma.$executeRawUnsafe(
      `ALTER TABLE refresh_tokens ADD CONSTRAINT ${name} CHECK (${check}) NOT VALID`,
    );
    try {
      await test();
    } finally {
      await db.prisma.$executeRawUnsafe(`ALTER TABLE refresh_tokens DROP CONSTRAINT ${name}`);
    }
  }

  it('does not persist a session for invalid credentials', async () => {
    const before = await db.prisma.refreshToken.count({ where: { userId } });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ ...input, password: 'wrong' });
    expect(res.status).toBe(401);
    const unknown = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: `${randomUUID()}@example.test`,
        password: input.password,
      });
    expect(unknown.status).toBe(401);
    expect(unknown.body).toEqual({ ...res.body, requestId: unknown.headers['x-request-id'] });
    expect(await db.prisma.refreshToken.count({ where: { userId } })).toBe(before);
  });

  it('looks up only the public fields for the verified subject on PostgreSQL', async () => {
    const { accessToken } = await login();
    const { UserNotFoundError } =
      await import('../../src/modules/auth/domain/errors/auth.errors.js');
    const subject = await tokens.verifyAccessToken(accessToken);
    await expect(
      authModule.useCases.getCurrentUserUseCase.execute(subject.userId),
    ).resolves.toEqual({
      id: userId,
      email: input.email,
      displayName: 'Session fixture',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    const absentSubject = await tokens.verifyAccessToken(
      await tokens.issueAccessToken(randomUUID()),
    );
    await expect(
      authModule.useCases.getCurrentUserUseCase.execute(absentSubject.userId),
    ).rejects.toBeInstanceOf(UserNotFoundError);
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
    await withRejection(record, 'insert', async () => {
      expect((await refresh(cookie)).status).toBe(500);
    });
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

  it('exercises Login → Refresh → Logout without reuse and verifies committed state', async () => {
    const initial = await login(input.email);
    const profile = await currentUser(initial.accessToken).query({ userId: randomUUID() });
    expect(profile.status).toBe(200);
    expect(profile.headers['cache-control']).toBe('no-store');
    expect(profile.body).toEqual({
      data: {
        id: userId,
        email: input.email,
        displayName: 'Session fixture',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
    expect((await refresh(`refresh_token=${initial.accessToken}`)).status).toBe(401);
    const rotated = await refresh(initial.cookie);
    expect(rotated.status).toBe(200);
    await expect(tokens.verifyAccessToken(rotated.body.accessToken)).resolves.toEqual({ userId });
    expect((await currentUser(rotated.body.accessToken)).body).toEqual(profile.body);
    const successor = rotated.headers['set-cookie'][0].split(';')[0];
    expect(successor).not.toBe(initial.cookie);
    const next = await refresh(successor);
    expect(next.status).toBe(200);
    const finalCookie = next.headers['set-cookie'][0].split(';')[0];
    const res = await logout(finalCookie);
    expect(res.status).toBe(204);
    expect(res.text).toBe('');
    expect(res.headers['set-cookie'][0]).toMatch(/^refresh_token=; Path=\/api\/v1\/auth; Expires=/);
    expect(res.headers['set-cookie'][0]).not.toContain('Domain=');
    const family = await db.prisma.refreshToken.findMany({
      where: { familyId: initial.record.familyId },
    });
    expect(family).toHaveLength(3);
    expect(family.every((row) => row.revokedAt !== null)).toBe(true);
    expect((await refresh(finalCookie)).status).toBe(401);
    expect((await currentUser(rotated.body.accessToken)).status).toBe(200);
  });

  it('revokes the current family via an old token and preserves other sessions and the access JWT', async () => {
    const initial = await login();
    const independent = await login();
    const rotated = await refresh(initial.cookie);
    expect(rotated.status).toBe(200);
    const successor = rotated.headers['set-cookie'][0].split(';')[0];
    expect((await logout(initial.cookie)).status).toBe(204);
    expect((await logout(initial.cookie)).status).toBe(204);
    expect(
      await db.prisma.refreshToken.count({
        where: { familyId: initial.record.familyId, revokedAt: null },
      }),
    ).toBe(0);
    expect((await refresh(successor)).status).toBe(401);
    expect((await refresh(independent.cookie)).status).toBe(200);
    await expect(tokens.verifyAccessToken(initial.accessToken)).resolves.toEqual({ userId });
  });

  it('serializes concurrent logout and refresh without leaving an active successor', async () => {
    const { cookie, record } = await login();
    const [first, second, rotation] = await Promise.all([
      logout(cookie),
      logout(cookie),
      refresh(cookie),
    ]);
    expect(first.status).toBe(204);
    expect(second.status).toBe(204);
    expect([200, 401]).toContain(rotation.status);
    expect(
      await db.prisma.refreshToken.count({
        where: { familyId: record.familyId, revokedAt: null },
      }),
    ).toBe(0);
    if (rotation.status === 200) {
      expect((await refresh(rotation.headers['set-cookie'][0].split(';')[0])).status).toBe(401);
    }
  });

  it('rolls back logout revocation if the transaction fails', async () => {
    const { cookie, record } = await login();
    await withRejection(record, 'revoke', async () => {
      const res = await logout(cookie);
      expect(res.status).toBe(500);
      expect(res.headers['set-cookie']).toBeUndefined();
    });
    expect(
      await db.prisma.refreshToken.findUniqueOrThrow({ where: { id: record.id } }),
    ).toMatchObject({
      revokedAt: null,
    });
  });

  it('rejects invalid bearer credentials and returns 404 for an absent subject', async () => {
    for (const header of [
      undefined,
      'Basic abc',
      'Bearer',
      'Bearer malformed',
      `Bearer ${tokens.generateRefreshToken()}`,
    ]) {
      const call = request(app).get('/api/v1/auth/me');
      const result = await (header ? call.set('Authorization', header) : call);
      expect(result.status).toBe(401);
      expect(result.headers['www-authenticate']).toBe('Bearer');
      expect(result.body.code).toBe('UNAUTHORIZED');
    }
    const result = await currentUser(await tokens.issueAccessToken(randomUUID()));
    expect(result.status).toBe(404);
    expect(result.body.code).toBe('NOT_FOUND');
  });
});
