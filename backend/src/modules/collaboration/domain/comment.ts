export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CommentFailureKind = 'not_found' | 'forbidden' | 'archived' | 'invalid_mention';

export class CommentFailure extends Error {
  constructor(
    readonly kind: CommentFailureKind,
    message: string,
  ) {
    super(message);
  }
}
