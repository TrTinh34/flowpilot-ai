import { MAX_ATTACHMENT_BYTES } from '../../domain/attachment.js';
import { CollaborationFailure } from '../../domain/collaboration-failure.js';
import type {
  AttachmentRepository,
  AttachmentStorage,
  AttachmentUnitOfWork,
} from '../ports/attachments.port.js';
import { requireActive, requireAccess, type TaskActor } from './task-access.js';

const DOWNLOAD_TTL_SECONDS = 300;
const signatures = {
  'application/pdf': [0x25, 0x50, 0x44, 0x46, 0x2d],
  'image/png': [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  'image/jpeg': [0xff, 0xd8, 0xff],
} as const;

function validSignature(mimeType: string, content: Uint8Array): boolean {
  if (!Object.hasOwn(signatures, mimeType)) return false;
  return signatures[mimeType as keyof typeof signatures].every((byte, i) => content[i] === byte);
}

export class TaskAttachments {
  constructor(
    private readonly repository: AttachmentRepository,
    private readonly unitOfWork: AttachmentUnitOfWork,
    private readonly storage: AttachmentStorage | undefined,
    private readonly newObjectId: () => string,
  ) {}

  async list(input: TaskActor & { page: number; size: number }) {
    await requireAccess(this.repository, input);
    const { taskId, page, size } = input;
    return { data: await this.repository.list(taskId, page, size), page, size };
  }

  async upload(input: TaskActor & { filename: string; mimeType: string; content: Uint8Array }) {
    const access = await requireAccess(this.repository, input);
    requireActive(access.projectStatus);
    const { mimeType, content, taskId, actorId } = input;
    const filename = input.filename.split(/[\\/]/).at(-1)?.trim() ?? '';
    const hasControl = [...filename].some((char) => char.charCodeAt(0) < 32 || char === '\x7f');
    if (!filename || filename.length > 255 || hasControl) {
      throw new CollaborationFailure('invalid_file', 'Invalid file name.');
    }
    if (
      content.byteLength === 0 ||
      content.byteLength > MAX_ATTACHMENT_BYTES ||
      !validSignature(mimeType, content)
    ) {
      throw new CollaborationFailure('invalid_file', 'Upload a PDF, PNG or JPEG up to 10 MiB.');
    }

    const objectKey = `attachments/${taskId}/${this.newObjectId()}`;
    const storage = this.requireStorage();
    try {
      await storage.put(objectKey, content, mimeType);
      return await this.unitOfWork.execute(async (writer) => {
        await writer.lockProject(access.projectId, access.workspaceId);
        const current = await requireAccess(writer, input);
        requireActive(current.projectStatus);
        return writer.create({
          taskId,
          uploaderId: actorId,
          objectKey,
          filename,
          mimeType,
          sizeBytes: content.byteLength,
        });
      });
    } catch (error) {
      try {
        await storage.delete(objectKey);
      } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], 'Attachment cleanup failed.', {
          cause: cleanupError,
        });
      }
      throw error;
    }
  }

  async download(input: { attachmentId: string; actorId: string }) {
    const attachment = await this.repository.find(input.attachmentId);
    if (!attachment) throw new CollaborationFailure('not_found', 'Attachment not found.');
    await requireAccess(this.repository, { actorId: input.actorId, taskId: attachment.taskId });
    return {
      url: await this.requireStorage().signDownload(
        attachment.objectKey,
        attachment.filename,
        DOWNLOAD_TTL_SECONDS,
      ),
      expiresIn: DOWNLOAD_TTL_SECONDS,
    };
  }

  private requireStorage() {
    if (!this.storage)
      throw new CollaborationFailure('storage_unavailable', 'Storage is unavailable.');
    return this.storage;
  }
}
