import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, expect, it, vi } from 'vitest';
import * as api from '@/features/collaboration/api/collaboration.api';
import { AttachmentUploader } from '@/features/collaboration/components/AttachmentUploader';
import { CommentSection } from '@/features/collaboration/components/CommentSection';

vi.mock('@/features/collaboration/api/collaboration.api');

const empty = { data: [], page: 0, size: 20 };
const comment = {
  id: 'comment',
  authorId: 'me',
  authorName: 'Alex',
  body: 'Ready for review',
  createdAt: '2026-11-27T09:00:00Z',
};
const attachment = {
  id: 'file',
  filename: 'review.pdf',
  mimeType: 'application/pdf',
  sizeBytes: 8,
  createdAt: '2026-11-27T09:00:00Z',
};
const members = [{ userId: 'reviewer', role: 'MEMBER' as const, user: { displayName: 'Pat' } }];

function show(component: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(<QueryClientProvider client={client}>{component}</QueryClientProvider>);
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(api.listComments).mockResolvedValue(empty);
  vi.mocked(api.listAttachments).mockResolvedValue(empty);
});

it('posts a comment with selected project members and refreshes the thread', async () => {
  vi.mocked(api.postComment).mockResolvedValue(comment);
  show(<CommentSection taskId="task" canWrite members={members} />);
  const user = userEvent.setup();
  await screen.findByText('No comments yet.');
  vi.mocked(api.listComments).mockResolvedValue({ ...empty, data: [comment] });
  await user.type(screen.getByLabelText('Add a comment'), 'Ready for review');
  await user.tab();
  expect(screen.getByText('Mention project members')).toHaveFocus();
  await user.keyboard('{Enter}');
  await user.tab();
  expect(screen.getByRole('checkbox', { name: 'Pat' })).toHaveFocus();
  await user.keyboard(' ');
  expect(screen.getByRole('checkbox', { name: 'Pat' })).toBeChecked();
  await user.click(screen.getByRole('button', { name: 'Post comment' }));
  expect(await screen.findByText('Comment posted.')).toBeInTheDocument();
  expect(screen.getByText('Ready for review')).toBeInTheDocument();
  expect(api.postComment).toHaveBeenCalledWith('task', {
    body: 'Ready for review',
    mentionIds: ['reviewer'],
  });
  expect(api.listComments).toHaveBeenCalledTimes(2);
});

it('shows a comment failure and keeps the draft', async () => {
  vi.mocked(api.postComment).mockRejectedValue(new Error('A recipient left the project.'));
  show(<CommentSection taskId="task" canWrite members={members} />);
  const user = userEvent.setup();
  const input = screen.getByLabelText('Add a comment');
  await user.type(input, 'Keep this draft');
  await user.click(screen.getByRole('button', { name: 'Post comment' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('A recipient left the project.');
  expect(input).toHaveValue('Keep this draft');
});

it('uploads a file, refreshes the list, and reports a failed signed download', async () => {
  vi.mocked(api.uploadAttachment).mockResolvedValue(attachment);
  vi.mocked(api.getAttachmentDownload).mockRejectedValue(new Error('Storage is unavailable.'));
  show(<AttachmentUploader taskId="task" canWrite />);
  const user = userEvent.setup();
  await screen.findByText('No attachments yet.');
  vi.mocked(api.listAttachments).mockResolvedValue({ ...empty, data: [attachment] });
  const file = new File(['%PDF-1.7'], attachment.filename, { type: attachment.mimeType });
  await user.upload(screen.getByLabelText('Choose attachment'), file);
  expect(await screen.findByText('File uploaded.')).toBeInTheDocument();
  expect(api.uploadAttachment).toHaveBeenCalledWith('task', file);
  await user.click(screen.getByRole('button', { name: 'Download review.pdf' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Storage is unavailable.');
  expect(api.getAttachmentDownload).toHaveBeenCalledExactlyOnceWith(attachment.id);
});

it('shows file input validation and does not submit an unsupported file', async () => {
  show(<AttachmentUploader taskId="task" canWrite />);
  const user = userEvent.setup({ applyAccept: false });
  await user.upload(
    screen.getByLabelText('Choose attachment'),
    new File(['sample'], 'sample.txt', { type: 'text/plain' }),
  );
  expect(await screen.findByRole('alert')).toHaveTextContent('Choose one PDF, PNG, or JPEG');
  expect(api.uploadAttachment).not.toHaveBeenCalled();
});

it('shows existing collaboration data in read-only mode', async () => {
  vi.mocked(api.listComments).mockResolvedValue({ ...empty, data: [comment] });
  vi.mocked(api.listAttachments).mockResolvedValue({ ...empty, data: [attachment] });
  show(
    <>
      <CommentSection taskId="task" canWrite={false} members={members} />
      <AttachmentUploader taskId="task" canWrite={false} />
    </>,
  );
  await waitFor(() => expect(screen.getByText(comment.body)).toBeInTheDocument());
  expect(await screen.findByRole('button', { name: 'Download review.pdf' })).toBeInTheDocument();
  expect(
    within(screen.getByRole('region', { name: 'Comments' })).queryByRole('textbox'),
  ).toBeNull();
  expect(screen.queryByRole('button', { name: 'Upload file' })).toBeNull();
});

it.each([
  [413, 'File exceeds 10 MiB.'],
  [422, 'File contents do not match the selected type.'],
])('shows the server upload error %s', async (status, message) => {
  vi.mocked(api.uploadAttachment).mockRejectedValue({
    isAxiosError: true,
    response: { status, data: { message } },
  });
  show(<AttachmentUploader taskId="task" canWrite />);
  const file = new File(['sample'], 'sample.pdf', { type: 'application/pdf' });
  await userEvent.upload(screen.getByLabelText('Choose attachment'), file);
  expect(await screen.findByRole('alert')).toHaveTextContent(message);
  expect(screen.queryByText('File uploaded.')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Upload file' })).toBeEnabled();
});
