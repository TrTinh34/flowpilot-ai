import { z } from 'zod';

const uuid = z.uuid();
const prismaIntMax = 2_147_483_647;
const pageNumber = z.string().regex(/^\d+$/).transform(Number);

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((val) => {
    const parsed = new Date(`${val}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(val);
  }, 'Invalid calendar date')
  .transform((val) => new Date(`${val}T00:00:00.000Z`));

export const projectTasksParams = z.object({ projectId: uuid });
export const taskParams = z.object({ taskId: uuid });

export const taskPageQuery = z
  .object({
    page: pageNumber.pipe(z.number().int().min(0).max(prismaIntMax)).optional().default(0),
    size: pageNumber.pipe(z.number().int().min(1).max(prismaIntMax)).optional().default(20),
  })
  .refine(({ page, size }) => page * size <= prismaIntMax);

export const taskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const createTaskBody = z.strictObject({
  title: z.string().trim().min(1),
  description: z.string().trim(),
  priority: taskPrioritySchema,
  parentId: uuid.nullable().optional(),
  assigneeId: uuid.nullable().optional(),
  dueDate: isoDate.nullable().optional(),
});

export const updateTaskBody = z.strictObject({
  version: z.number().int().min(0),
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: uuid.nullable().optional(),
  dueDate: isoDate.nullable().optional(),
});
