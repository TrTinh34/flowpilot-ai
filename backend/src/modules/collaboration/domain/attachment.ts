export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export interface Attachment {
  id: string;
  taskId: string;
  uploaderId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
}

export type StoredAttachment = Attachment & { objectKey: string };
