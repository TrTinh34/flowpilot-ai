import request from 'supertest';
import { afterAll, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { disconnectDatabase } from '../../src/config/prisma.js';

const endpoint = '/api/v1/auth/login';
const app = createApp();
afterAll(disconnectDatabase);

it('rejects missing credentials and malformed JSON and applies the login rate limit', async () => {
  const malformed = await request(app).post(endpoint).set('Content-Type', 'application/json').send('{');
  expect(malformed.status).toBe(400);
  expect(malformed.body.code).toBe('VALIDATION_ERROR');
  for (let i = 0; i < 15; i++) {
    const invalid = await request(app).post(endpoint).send({});
    expect(invalid.status).toBe(400);
    expect(invalid.body.code).toBe('VALIDATION_ERROR');
  }
  const limited = await request(app).post(endpoint).send({});
  expect(limited.status).toBe(429);
  expect(limited.body.code).toBe('RATE_LIMITED');
});
