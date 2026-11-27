import { CommentFailure } from '../../domain/comment.js';
import type { CommentReader, CommentUnitOfWork } from '../ports/comments.port.js';

interface TaskActor {
  taskId: string;
  actorId: string;
}

async function requireAccess(reader: Pick<CommentReader, 'findAccess'>, input: TaskActor) {
  const access = await reader.findAccess(input.taskId, input.actorId);
  if (!access) throw new CommentFailure('not_found', 'Task not found.');
  if (!access.canRead) throw new CommentFailure('forbidden', 'You cannot access this task.');
  return access;
}

function requireActive(status: 'ACTIVE' | 'ARCHIVED') {
  if (status === 'ARCHIVED') throw new CommentFailure('archived', 'This project is archived.');
}

export class ListTaskComments {
  constructor(private readonly reader: CommentReader) {}

  async execute(input: TaskActor & { page: number; size: number }) {
    await requireAccess(this.reader, input);
    const { taskId, page, size } = input;
    return { data: await this.reader.list(taskId, page, size), page, size };
  }
}

export class AddTaskComment {
  constructor(private readonly unitOfWork: CommentUnitOfWork) {}

  execute(input: TaskActor & { body: string; mentionIds: string[] }) {
    return this.unitOfWork.execute(async (writer) => {
      const initial = await requireAccess(writer, input);
      requireActive(initial.projectStatus);
      await writer.lockProject(initial.projectId, initial.workspaceId);
      const access = await requireAccess(writer, input);
      requireActive(access.projectStatus);

      const recipientIds = [...new Set(input.mentionIds.map((id) => id.toLowerCase()))];
      if (recipientIds.length > 0) {
        const members = await writer.findMentionMembers(
          access.projectId,
          access.workspaceId,
          recipientIds,
        );
        if (members.length !== recipientIds.length) {
          throw new CommentFailure(
            'invalid_mention',
            'Mentioned users must belong to the project.',
          );
        }
      }

      const comment = await writer.create({
        taskId: input.taskId,
        authorId: input.actorId,
        body: input.body,
      });
      if (recipientIds.length > 0) {
        await writer.enqueueMention({
          commentId: comment.id,
          taskId: comment.taskId,
          projectId: access.projectId,
          authorId: comment.authorId,
          recipientIds,
        });
      }
      return comment;
    });
  }
}
