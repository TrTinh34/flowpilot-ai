import type { Comment } from '../../domain/comment.js';

export interface TaskCommentAccess {
  projectId: string;
  workspaceId: string;
  canRead: boolean;
  projectStatus: 'ACTIVE' | 'ARCHIVED';
}

export interface CommentReader {
  findAccess(taskId: string, actorId: string): Promise<TaskCommentAccess | null>;
  list(taskId: string, page: number, size: number): Promise<Comment[]>;
}

export interface CommentWriter extends Pick<CommentReader, 'findAccess'> {
  lockProject(projectId: string, workspaceId: string): Promise<void>;
  findMentionMembers(projectId: string, workspaceId: string, ids: string[]): Promise<string[]>;
  create(data: Pick<Comment, 'taskId' | 'authorId' | 'body'>): Promise<Comment>;
  enqueueMention(input: {
    commentId: string;
    taskId: string;
    projectId: string;
    authorId: string;
    recipientIds: string[];
  }): Promise<void>;
}

export interface CommentUnitOfWork {
  execute<T>(work: (writer: CommentWriter) => Promise<T>): Promise<T>;
}
