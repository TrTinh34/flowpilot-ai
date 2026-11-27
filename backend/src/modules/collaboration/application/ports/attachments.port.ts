import type { Attachment, StoredAttachment } from '../../domain/attachment.js';
import type { CommentReader, CommentWriter } from './comments.port.js';

export interface AttachmentRepository extends Pick<CommentReader, 'findAccess'> {
  list(taskId: string, page: number, size: number): Promise<Attachment[]>;
  find(attachmentId: string): Promise<StoredAttachment | null>;
}

export interface AttachmentWriter extends Pick<CommentWriter, 'findAccess' | 'lockProject'> {
  create(input: Omit<StoredAttachment, 'id' | 'createdAt'>): Promise<Attachment>;
}

export interface AttachmentUnitOfWork {
  execute<T>(work: (writer: AttachmentWriter) => Promise<T>): Promise<T>;
}

export interface AttachmentStorage {
  put(key: string, content: Uint8Array, mimeType: string): Promise<void>;
  delete(key: string): Promise<void>;
  signDownload(key: string, filename: string, expiresIn: number): Promise<string>;
}
