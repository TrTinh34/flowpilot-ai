import { expect, it, vi } from 'vitest';
import type { AttachmentWriter } from '../../src/modules/collaboration/application/ports/attachments.port.js';
import { TaskAttachments } from '../../src/modules/collaboration/application/use-cases/task-attachments.js';

const access = {
  projectId: 'p',
  workspaceId: 'w',
  canRead: true,
  projectStatus: 'ACTIVE' as const,
};
const upload = {
  taskId: 'task',
  actorId: 'user',
  filename: 'example.pdf',
  mimeType: 'application/pdf',
  content: Buffer.from('%PDF-1.7'),
};

function setup() {
  const writer = {
    findAccess: vi.fn().mockResolvedValue(access),
    lockProject: vi.fn(),
    create: vi
      .fn<AttachmentWriter['create']>()
      .mockRejectedValue(new Error('database write failed')),
  };
  const repository = {
    findAccess: vi.fn().mockResolvedValue(access),
    list: vi.fn(),
    find: vi.fn(),
  };
  const storage = { put: vi.fn(), delete: vi.fn(), signDownload: vi.fn() };
  return {
    writer,
    storage,
    service: new TaskAttachments(
      repository,
      { execute: (work) => work(writer) },
      storage,
      () => 'id',
    ),
  };
}

it('removes the uploaded object when metadata persistence fails', async () => {
  const { service, storage, writer } = setup();
  await expect(service.upload(upload)).rejects.toThrow('database write failed');
  expect(storage.put).toHaveBeenCalledWith('attachments/task/id', upload.content, upload.mimeType);
  expect(writer.lockProject).toHaveBeenCalledWith('p', 'w');
  expect(storage.delete).toHaveBeenCalledExactlyOnceWith('attachments/task/id');
});

it('rejects a mismatched MIME and signature before contacting storage', async () => {
  const { service, storage } = setup();
  await expect(service.upload({ ...upload, mimeType: 'image/png' })).rejects.toMatchObject({
    kind: 'invalid_file',
  });
  expect(storage.put).not.toHaveBeenCalled();
});
