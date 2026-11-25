import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';
import { disconnectDatabase } from '../../src/config/prisma.js';

describe('Backend foundation smoke tests', () => {
  afterAll(async () => {
    await disconnectDatabase();
  });

  it('GET /health returns structured api and database status with x-request-id', async () => {
    const res = await request(app).get('/health');

    expect([200, 503]).toContain(res.status);
    expect(res.headers['x-request-id']).toBeTruthy();
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('services.api', 'up');
    expect(['up', 'down']).toContain(res.body.services?.database);
  });

  it('GET /unknown-route returns 404 in standard Error format', async () => {
    const res = await request(app).get('/unknown-route');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: 'NOT_FOUND',
      message: 'Route not found: GET /unknown-route',
      requestId: res.headers['x-request-id'],
    });
  });

  it('POST /health with malformed JSON returns 400 VALIDATION_ERROR in standard Error format', async () => {
    const res = await request(app)
      .post('/health')
      .set('Content-Type', 'application/json')
      .send('{"invalidJson":');

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      code: 'VALIDATION_ERROR',
      message: 'Invalid JSON request payload',
      requestId: res.headers['x-request-id'],
    });
  });

  it('rejects disallowed CORS origin with 403 CORS_FORBIDDEN', async () => {
    const res = await request(app).get('/health').set('Origin', 'https://evil.example.com');

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({
      code: 'CORS_FORBIDDEN',
      requestId: res.headers['x-request-id'],
    });
  });
});
