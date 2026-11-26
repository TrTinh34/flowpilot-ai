import { z } from 'zod';

export const workspaceProjectParams = z.object({ workspaceId: z.uuid() });
export const projectParams = z.object({ projectId: z.uuid() });
export const createProjectBody = z.strictObject({
  name: z.string().trim().min(1),
  managerId: z.uuid(),
});
export const updateProjectBody = z.strictObject({
  name: z.string().trim().min(1),
  status: z.enum(['ACTIVE', 'ARCHIVED']),
});
export const addProjectMemberBody = z.strictObject({
  userId: z.uuid(),
  role: z.enum(['MANAGER', 'MEMBER']),
});
