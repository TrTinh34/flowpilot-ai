import type { Socket } from 'socket.io';
import { z } from 'zod';
import type { AuthenticatedSocketData } from './socket-auth.middleware.js';

export type ProjectAccessChecker = (projectId: string, userId: string) => Promise<boolean>;

type JoinAck = (response: { ok: boolean; error?: string }) => void;

const projectIdSchema = z.uuid();

export function userRoom(userId: string): string {
  return `user:${userId}`;
}

export function projectRoom(projectId: string): string {
  return `project:${projectId}`;
}

export async function registerSocketRoomHandlers(
  socket: Socket,
  canAccessProject: ProjectAccessChecker,
): Promise<void> {
  const { userId } = socket.data as AuthenticatedSocketData;
  if (!userId) {
    socket.disconnect(true);
    return;
  }

  await socket.join(userRoom(userId));

  socket.on('project:join', async (rawProjectId: unknown, ack?: JoinAck) => {
    const parsed = projectIdSchema.safeParse(rawProjectId);
    if (!parsed.success) {
      if (typeof ack === 'function') ack({ ok: false, error: 'INVALID_PROJECT_ID' });
      return;
    }

    try {
      const allowed = await canAccessProject(parsed.data, userId);
      if (!allowed) {
        if (typeof ack === 'function') ack({ ok: false, error: 'FORBIDDEN' });
        return;
      }
      await socket.join(projectRoom(parsed.data));
      if (typeof ack === 'function') ack({ ok: true });
    } catch {
      if (typeof ack === 'function') ack({ ok: false, error: 'INTERNAL_ERROR' });
    }
  });

  socket.on('project:leave', async (rawProjectId: unknown) => {
    const parsed = projectIdSchema.safeParse(rawProjectId);
    if (!parsed.success) return;
    await socket.leave(projectRoom(parsed.data));
  });
}
