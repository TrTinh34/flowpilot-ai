import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from './env.js';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  connectionTimeoutMillis: 3000,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  await pool.end();
}
