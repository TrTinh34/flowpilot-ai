import { describe, expect, it, vi } from 'vitest';
import type { CommentWriter } from '../../src/modules/collaboration/application/ports/comments.port.js';
import {
  AddTaskComment,
  ListTaskComments,
} from '../../src/modules/collaboration/application/use-cases/task-comments.js';

const command = { taskId: 'task', actorId: 'actor', body: 'Update', mentionIds: ['USER', 'user'] };
const access = {
  projectId: 'project',
  workspaceId: 'workspace',
  canRead: true,
  projectStatus: 'ACTIVE' as const,
};

function setup() {
  const comment = {
    id: 'comment',
    taskId: command.taskId,
    authorId: command.actorId,
    authorName: 'Fixture',
    body: command.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const writer = {
    findAccess: vi.fn<CommentWriter['findAccess']>().mockResolvedValue(access),
    lockProject: vi.fn<CommentWriter['lockProject']>(),
    findMentionMembers: vi.fn<CommentWriter['findMentionMembers']>().mockResolvedValue(['user']),
    create: vi.fn<CommentWriter['create']>().mockResolvedValue(comment),
    enqueueMention: vi.fn<CommentWriter['enqueueMention']>(),
  };
  return { writer, comment, useCase: new AddTaskComment({ execute: (work) => work(writer) }) };
}

describe('AddTaskComment', () => {
  it('enqueues one event with unique, normalized recipients', async () => {
    const { writer, comment, useCase } = setup();
    await expect(useCase.execute(command)).resolves.toEqual(comment);
    expect(writer.findMentionMembers).toHaveBeenCalledWith('project', 'workspace', ['user']);
    expect(writer.enqueueMention).toHaveBeenCalledExactlyOnceWith({
      commentId: comment.id,
      taskId: comment.taskId,
      projectId: 'project',
      authorId: comment.authorId,
      recipientIds: ['user'],
    });
  });

  it('stops before writing when access changes while waiting for the lock', async () => {
    const { writer, useCase } = setup();
    writer.findAccess.mockResolvedValueOnce(access).mockResolvedValueOnce(null);
    await expect(useCase.execute(command)).rejects.toMatchObject({ kind: 'not_found' });
    expect(writer.lockProject).toHaveBeenCalledWith('project', 'workspace');
    expect(writer.create).not.toHaveBeenCalled();
  });

  it('rejects invalid mentions before creating the comment', async () => {
    const { writer, useCase } = setup();
    writer.findMentionMembers.mockResolvedValue([]);
    await expect(useCase.execute(command)).rejects.toMatchObject({ kind: 'invalid_mention' });
    expect(writer.create).not.toHaveBeenCalled();
    expect(writer.enqueueMention).not.toHaveBeenCalled();
  });

  it('skips the outbox for a comment without mentions', async () => {
    const { writer, useCase } = setup();
    await useCase.execute({ ...command, mentionIds: [] });
    expect(writer.create).toHaveBeenCalledOnce();
    expect(writer.findMentionMembers).not.toHaveBeenCalled();
    expect(writer.enqueueMention).not.toHaveBeenCalled();
  });
});

describe('ListTaskComments', () => {
  it('does not read comments for a task the caller cannot access', async () => {
    const reader = {
      findAccess: vi.fn().mockResolvedValue({ ...access, canRead: false }),
      list: vi.fn(),
    };
    await expect(
      new ListTaskComments(reader).execute({ ...command, page: 0, size: 20 }),
    ).rejects.toMatchObject({ kind: 'forbidden' });
    expect(reader.list).not.toHaveBeenCalled();
  });
});
