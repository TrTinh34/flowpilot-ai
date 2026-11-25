import { randomUUID } from 'node:crypto';
import { compare } from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const endpoint = '/api/v1/auth/register';
const domain = `${randomUUID()}.example.test`;
const sample = { displayName: 'Test User', email: `register@${domain}`, password: 'Fixture only!' };
const testDatabaseUrl = process.env['TEST_DATABASE_URL'];

if (testDatabaseUrl) {
  const target = new URL(testDatabaseUrl);
  if (!/^postgres(ql)?:$/.test(target.protocol) || !/^\/[a-z0-9_]+_test$/i.test(target.pathname)) {
    throw new Error(
      'TEST_DATABASE_URL must identify a separate PostgreSQL database ending in _test',
    );
  }
  process.env['DATABASE_URL'] = testDatabaseUrl;
}

const { createApp } = await import('../../src/app.js');
const { disconnectDatabase, prisma } = await import('../../src/config/prisma.js');

afterAll(disconnectDatabase);

describe('registration HTTP validation', () => {
  const app = createApp();

  it.each([
    { ...sample, displayName: undefined },
    { ...sample, displayName: '  ' },
    { ...sample, email: undefined },
    { ...sample, email: 'invalid' },
    { ...sample, password: undefined },
    { ...sample, password: '' },
    { ...sample, password: 'é'.repeat(37) },
    { ...sample, role: 'OWNER', id: randomUUID(), createdAt: new Date() },
  ])('rejects invalid request %#', async (body) => {
    const res = await request(app).post(endpoint).send(body);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Invalid request body',
      requestId: res.headers['x-request-id'],
    });
  });
});

describe.skipIf(!testDatabaseUrl)('registration with PostgreSQL', () => {
  const app = createApp();

  beforeAll(async () => {
    const [database] = await prisma.$queryRaw<
      [{ name: string }]
    >`SELECT current_database() AS name`;
    expect(database.name).toMatch(/_test$/i);
  });

  afterAll(async () => {
    // Only remove this run's fixture addresses from the confirmed test database.
    await prisma.user.deleteMany({
      where: { email: { in: [sample.email, sample.email.toUpperCase(), `race@${domain}`] } },
    });
  });

  it('persists the normalized email and a bcrypt hash and rejects duplicates', async () => {
    const res = await request(app)
      .post(endpoint)
      .send({ ...sample, email: ` ${sample.email.toUpperCase()} ` });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(String),
      displayName: sample.displayName,
      email: sample.email,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    const saved = await prisma.user.findUniqueOrThrow({ where: { id: res.body.id } });
    expect(saved.email).toBe(sample.email);
    expect(saved.passwordHash).not.toBe(sample.password);
    expect(await compare(sample.password, saved.passwordHash)).toBe(true);

    for (const email of [sample.email, sample.email.toUpperCase()]) {
      const duplicate = await request(app)
        .post(endpoint)
        .send({ ...sample, email });
      expect(duplicate.status).toBe(409);
      expect(duplicate.body).toMatchObject({ code: 'EMAIL_ALREADY_EXISTS' });
    }
  });

  it('allows a single insert for concurrent requests and exposes the index in Prisma metadata', async () => {
    const email = `race@${domain}`;
    const responses = await Promise.all(
      Array.from({ length: 3 }, () =>
        request(app)
          .post(endpoint)
          .send({ ...sample, email }),
      ),
    );
    expect(responses.map((res) => res.status).sort()).toEqual([201, 409, 409]);
    expect(await prisma.user.count({ where: { email } })).toBe(1);
    await expect(
      prisma.user.create({
        data: { email, displayName: sample.displayName, passwordHash: 'unused-fixture' },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
      meta: { driverAdapterError: { cause: { constraint: { index: 'users_email_lower_uidx' } } } },
    });
  });
});
