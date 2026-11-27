import { useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, Upload } from 'lucide-react';
import { useAuthStore } from '@/app/store/auth.store';
import { Button } from '@/components/ui/button';
import { extractApiErrorMessage } from '@/services/api-client';
import { getAttachmentDownload, listAttachments, uploadAttachment } from '../api/collaboration.api';

const FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
const MAX_BYTES = 10 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}

export function AttachmentUploader({ taskId, canWrite }: { taskId: string; canWrite: boolean }) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string>();
  const client = useQueryClient();
  const key = ['task-attachments', revision, taskId];
  const attachments = useInfiniteQuery({
    queryKey: key,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => listAttachments(taskId, pageParam),
    getNextPageParam: (last) => (last.data.length === last.size ? last.page + 1 : undefined),
  });
  const upload = useMutation({
    mutationFn: (file: File) => uploadAttachment(taskId, file),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  });
  const download = useMutation({
    mutationFn: (attachmentId: string) => getAttachmentDownload(attachmentId),
    onSuccess: (url) => window.location.assign(url),
  });

  function handleFiles(files: FileList | null) {
    if (!files?.length || !canWrite || upload.isPending) return;
    upload.reset();
    setValidationError(undefined);
    const file = files[0];
    if (
      files.length !== 1 ||
      !FILE_TYPES.includes(file.type) ||
      !file.size ||
      file.size > MAX_BYTES
    ) {
      setValidationError('Choose one PDF, PNG, or JPEG file up to 10 MiB.');
      return;
    }
    upload.mutate(file);
  }

  const listed = attachments.data?.pages.flatMap((page) => page.data) ?? [];
  const latest = upload.data;
  const visible =
    latest && !listed.some(({ id }) => id === latest.id) ? [...listed, latest] : listed;
  return (
    <section aria-label="Attachments" className="space-y-4">
      {canWrite && (
        <div
          className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            handleFiles(event.dataTransfer.files);
          }}
        >
          <Button
            type="button"
            variant="outline"
            disabled={upload.isPending}
            onClick={() => inputRef.current?.click()}
          >
            <Upload aria-hidden="true" /> Upload file
          </Button>
          <p className="text-xs text-[var(--foreground-muted)]">
            Drag a PDF, PNG, or JPEG here. Max 10 MiB.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={FILE_TYPES.join(',')}
            aria-label="Choose attachment"
            className="hidden"
            onChange={(event) => {
              handleFiles(event.target.files);
              event.currentTarget.value = '';
            }}
          />
        </div>
      )}
      {upload.isPending && <p role="status">Uploading {upload.variables?.name}…</p>}
      {upload.isSuccess && <p role="status">File uploaded.</p>}
      {validationError && <p role="alert">{validationError}</p>}
      {upload.isError && <p role="alert">{extractApiErrorMessage(upload.error)}</p>}
      {attachments.isPending && <p role="status">Loading attachments…</p>}
      {attachments.isError && <p role="alert">{extractApiErrorMessage(attachments.error)}</p>}
      {download.isError && <p role="alert">{extractApiErrorMessage(download.error)}</p>}
      {download.isPending && <p role="status">Preparing download…</p>}
      {attachments.isSuccess && visible.length === 0 && <p>No attachments yet.</p>}
      {visible.length > 0 && (
        <ul className="space-y-2">
          {visible.map((file) => (
            <li key={file.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="min-w-0 flex-1">
                <p className="break-words text-sm">{file.filename}</p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {formatBytes(file.sizeBytes)}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={download.isPending}
                onClick={() => download.mutate(file.id)}
                aria-label={`Download ${file.filename}`}
              >
                <Download aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}
      {attachments.hasNextPage && (
        <Button
          type="button"
          variant="outline"
          disabled={attachments.isFetchingNextPage}
          onClick={() => void attachments.fetchNextPage()}
        >
          Load more attachments
        </Button>
      )}
    </section>
  );
}
