export type CollaborationFailureKind =
  | 'not_found'
  | 'forbidden'
  | 'archived'
  | 'invalid_mention'
  | 'invalid_file'
  | 'storage_unavailable';

export class CollaborationFailure extends Error {
  constructor(
    readonly kind: CollaborationFailureKind,
    message: string,
  ) {
    super(message);
  }
}
