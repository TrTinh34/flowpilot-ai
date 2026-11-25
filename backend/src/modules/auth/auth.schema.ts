import { z } from 'zod';

export const registerSchema = z.strictObject({
  displayName: z.string().trim().min(1),
  email: z.string().trim().pipe(z.email()),
  password: z
    .string()
    .min(1)
    .refine((value) => Buffer.byteLength(value, 'utf8') <= 72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
