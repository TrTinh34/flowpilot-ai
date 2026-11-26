import { z } from 'zod';

const uuid = z.uuid();
const prismaIntMax = 2_147_483_647;
const pageNumber = z.string().regex(/^\d+$/).transform(Number);
export const workspacePage = z
  .object({
    page: pageNumber.pipe(z.number().int().min(0).max(prismaIntMax)).optional().default(0),
    size: pageNumber.pipe(z.number().int().min(1).max(prismaIntMax)).optional().default(20),
  })
  .refine(({ page, size }) => page * size <= prismaIntMax);
export const workspaceParams = z.object({ workspaceId: uuid });
export const workspaceMemberParams = workspaceParams.extend({ userId: uuid });
export const createWorkspaceBody = z.strictObject({ name: z.string().trim().min(1) });
export const updateRoleBody = z.strictObject({ role: z.enum(['ADMIN', 'MEMBER']) });
export const transferOwnershipBody = z.strictObject({ userId: uuid });
export const inviteMemberBody = z.strictObject({
  email: z.string().trim().pipe(z.email()),
  role: z.enum(['ADMIN', 'MEMBER']),
});
export const acceptInvitationBody = z.strictObject({ token: z.string().regex(/^[\w-]{43}$/) });
