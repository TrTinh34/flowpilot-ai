import 'dotenv/config';
import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: z
      .string()
      .min(1, 'DATABASE_URL is required')
      .refine(
        (val) => val.startsWith('postgres://') || val.startsWith('postgresql://'),
        'DATABASE_URL must be a valid PostgreSQL connection URL',
      ),
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    S3_BUCKET: z.string().optional(),
    S3_ENDPOINT: z.union([z.httpUrl(), z.literal('')]).optional(),
    S3_REGION: z.string().min(1).default('us-east-1'),
    S3_ACCESS_KEY: z.string().optional(),
    S3_SECRET_KEY: z.string().optional(),
    CORS_ORIGIN: z.string().optional(),
    JWT_ACCESS_SECRET: z
      .string()
      .length(64)
      .regex(/^[\da-f]{64}$/i, 'Expected a 32-byte hex signing key'),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
  })
  .refine(({ S3_ACCESS_KEY, S3_SECRET_KEY }) => Boolean(S3_ACCESS_KEY) === Boolean(S3_SECRET_KEY), {
    message: 'Set both S3_ACCESS_KEY and S3_SECRET_KEY, or use the AWS credential chain.',
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment configuration: ${details}`);
}

export const env = parsed.data;
