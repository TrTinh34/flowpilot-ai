import { apiClient } from '@/services/api-client';

export type TaskComment = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type TaskAttachment = {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

type Page<T> = { data: T[]; page: number; size: number };

export async function listComments(taskId: string, page: number) {
  const { data } = await apiClient.get<Page<TaskComment>>(`/tasks/${taskId}/comments`, {
    params: { page },
  });
  return data;
}

export async function postComment(taskId: string, input: { body: string; mentionIds: string[] }) {
  const { data } = await apiClient.post<{ data: TaskComment }>(`/tasks/${taskId}/comments`, input);
  return data.data;
}

export async function listAttachments(taskId: string, page: number) {
  const { data } = await apiClient.get<Page<TaskAttachment>>(`/tasks/${taskId}/attachments`, {
    params: { page },
  });
  return data;
}

export async function uploadAttachment(taskId: string, file: File) {
  const payload = new FormData();
  payload.append('file', file);
  const { data } = await apiClient.post<{ data: TaskAttachment }>(
    `/tasks/${taskId}/attachments`,
    payload,
    { headers: { 'Content-Type': null }, timeout: 60_000 },
  );
  return data.data;
}

export async function getAttachmentDownload(attachmentId: string) {
  const { data } = await apiClient.get<{ data: { url: string; expiresIn: number } }>(
    `/attachments/${attachmentId}/download`,
  );
  const url = new URL(data.data.url);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid download URL.');
  return url.href;
}
