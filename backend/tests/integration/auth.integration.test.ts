import { randomUUID } from 'node:crypto';
import { compare } from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { confirmTestDatabase } from '../helpers/test-db.helper.js';

const endpoint = '/api/v1/auth/register';
const domain = `${randomUUID()}.example.test`;
const sample = { displayName: 'Test User', email: `register@${domain}`, password: 'Fixture only!' };
const testDatabaseUrl = process.env['TEST_DATABASE_URL'];

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
  let confirmed = false;

  beforeAll(async () => {
    await confirmTestDatabase();
    confirmed = true;
  });

  afterAll(async () => {
    if (!confirmed) return;
    // Only remove this run's fixture addresses from the confirmed test database.
    await prisma.user.deleteMany({
      where: { email: { in: [sample.email, sample.email.toUpperCase(), `race@${domain}`] } },
    });
  });

  it('checks applied migration and authentication constraints in PostgreSQL', async () => {
    const migrations = await prisma.$queryRaw<{ migration_name: string }[]>`
      SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL
    `;
    expect(migrations).toContainEqual({ migration_name: '20261125150345_init_auth' });
    const constraints = await prisma.$queryRaw<{ conname: string; definition: string }[]>`
      SELECT conname, pg_get_constraintdef(oid) AS definition FROM pg_constraint
      WHERE conrelid IN ('public.users'::regclass, 'public.refresh_tokens'::regclass)
    `;
    expect(constraints).toEqual(
      expect.arrayContaining([
        { conname: 'users_pkey', definition: 'PRIMARY KEY (id)' },
        { conname: 'refresh_tokens_pkey', definition: 'PRIMARY KEY (id)' },
        {
          conname: 'refresh_tokens_user_id_fkey',
          definition: expect.stringMatching(/REFERENCES users\(id\).*ON DELETE RESTRICT/),
        },
      ]),
    );
    const indexes = await prisma.$queryRaw<{ indexname: string; indexdef: string }[]>`
      SELECT indexname, indexdef FROM pg_indexes
      WHERE schemaname = 'public' AND tablename IN ('users', 'refresh_tokens')
    `;
    expect(indexes).toEqual(
      expect.arrayContaining([
        {
          indexname: 'users_email_lower_uidx',
          indexdef: expect.stringMatching(/CREATE UNIQUE INDEX.*lower\(email\)/),
        },
        {
          indexname: 'refresh_tokens_token_hash_key',
          indexdef: expect.stringMatching(/CREATE UNIQUE INDEX.*\(token_hash\)/),
        },
        ...['user_id', 'family_id', 'expires_at'].map((column) => ({
          indexname: `refresh_tokens_${column}_idx`,
          indexdef: expect.stringContaining(`(${column})`),
        })),
      ]),
    );
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
        data: {
          email: email.toUpperCase(),
          displayName: sample.displayName,
          passwordHash: 'unused-fixture',
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
      meta: { driverAdapterError: { cause: { constraint: { index: 'users_email_lower_uidx' } } } },
    });
  });
});
