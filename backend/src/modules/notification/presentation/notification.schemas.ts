import { z } from 'zod';

const digits = z.string().regex(/^\d+$/).transform(Number);

export const listNotificationsQuerySchema = z
  .object({
    page: digits.pipe(z.number().int().min(0).max(2_147_483_647)).default(0),
    size: digits.pipe(z.number().int().min(1).max(100)).default(20),
    unreadOnly: z
      .enum(['true', 'false'])
      .optional()
      .transform((value) => value === 'true'),
  })
  .refine(({ page, size }) => page * size <= 2_147_483_647);

export const notificationIdParamsSchema = z.object({
  notificationId: z.uuid(),
});
