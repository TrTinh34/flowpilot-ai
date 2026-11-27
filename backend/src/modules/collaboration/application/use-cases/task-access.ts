import { CollaborationFailure } from '../../domain/collaboration-failure.js';
import type { CommentReader } from '../ports/comments.port.js';

export interface TaskActor {
  taskId: string;
  actorId: string;
}

export async function requireAccess(reader: Pick<CommentReader, 'findAccess'>, input: TaskActor) {
  const access = await reader.findAccess(input.taskId, input.actorId);
  if (!access) throw new CollaborationFailure('not_found', 'Task not found.');
  if (!access.canRead) throw new CollaborationFailure('forbidden', 'You cannot access this task.');
  return access;
}

export function requireActive(status: 'ACTIVE' | 'ARCHIVED') {
  if (status === 'ARCHIVED') {
    throw new CollaborationFailure('archived', 'This project is archived.');
  }
}
