import { z } from 'zod';

const email = z.string().trim().pipe(z.email());
const bcryptPassword = z
  .string()
  .min(1)
  .refine((value) => Buffer.byteLength(value, 'utf8') <= 72);

export const registerSchema = z.strictObject({
  displayName: z.string().trim().min(1),
  email,
  password: bcryptPassword,
});

export const loginSchema = z.strictObject({ email, password: bcryptPassword });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
