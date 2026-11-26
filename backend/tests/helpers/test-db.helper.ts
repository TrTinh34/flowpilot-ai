import { Client } from 'pg';

export function configureTestDatabaseUrl(): void {
  const configured = process.env['TEST_DATABASE_URL'];
  if (!configured) {
    if (process.env['REQUIRE_TEST_DATABASE'] === '1')
      throw new Error('TEST_DATABASE_URL is required');
    process.env['DATABASE_URL'] = 'postgresql://127.0.0.1:1/flowpilot_ai_test';
    return;
  }
  if (process.env['NODE_ENV'] !== 'test') throw new Error('NODE_ENV must be test');
  let target: URL;
  try {
    target = new URL(configured);
  } catch {
    throw new Error('Invalid TEST_DATABASE_URL');
  }
  if (
    !['postgres:', 'postgresql:'].includes(target.protocol) ||
    !['localhost', '127.0.0.1', '[::1]'].includes(target.hostname) ||
    target.pathname !== '/flowpilot_ai_test' ||
    [...target.searchParams].some(([key, value]) => key !== 'schema' || value !== 'public')
  ) {
    throw new Error('TEST_DATABASE_URL must point to local flowpilot_ai_test');
  }
  process.env['DATABASE_URL'] = configured;
}

export async function confirmTestDatabase(): Promise<void> {
  configureTestDatabaseUrl();
  const client = new Client({
    connectionString: process.env['DATABASE_URL'],
    connectionTimeoutMillis: 3000,
  });
  try {
    await client.connect();
    const result = await client.query<{ name: string }>('SELECT current_database() AS name');
    if (result.rows[0]?.name !== 'flowpilot_ai_test')
      throw new Error('Unexpected PostgreSQL database');
  } finally {
    await client.end();
  }
}
