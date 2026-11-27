import { useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, FileText, Upload } from 'lucide-react';
import { useAuthStore } from '@/app/store/auth.store';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
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
  const uploadLock = useRef(false);
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
    onSettled: () => {
      uploadLock.current = false;
    },
  });
  const download = useMutation({
    mutationFn: (attachmentId: string) => getAttachmentDownload(attachmentId),
    onSuccess: (url) => window.location.assign(url),
  });

  function handleFiles(files: FileList | null) {
    if (!files?.length || !canWrite || uploadLock.current) return;
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
    uploadLock.current = true;
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
          className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-input bg-card p-5 text-center"
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = uploadLock.current ? 'none' : 'copy';
          }}
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
          <p className="text-secondary text-sm">Drag a PDF, PNG, or JPEG here. Max 10 MiB.</p>
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
      {upload.isPending && (
        <p role="status" className="text-secondary [overflow-wrap:anywhere]">
          Uploading {upload.variables?.name}…
        </p>
      )}
      {upload.isSuccess && <p role="status">File uploaded.</p>}
      {(validationError || upload.isError) && (
        <ErrorState
          title="Could not upload the file"
          message={validationError ?? extractApiErrorMessage(upload.error)}
        />
      )}
      {attachments.isPending && <LoadingState label="Loading attachments" />}
      {attachments.isError && (
        <ErrorState
          title="Could not load attachments"
          message={extractApiErrorMessage(attachments.error)}
          onRetry={() =>
            void (attachments.isFetchNextPageError
              ? attachments.fetchNextPage()
              : attachments.refetch())
          }
        />
      )}
      {download.isError && (
        <ErrorState
          title="Could not prepare the download"
          message={extractApiErrorMessage(download.error)}
        />
      )}
      {download.isPending && <p role="status">Preparing download…</p>}
      {attachments.isSuccess && visible.length === 0 && (
        <p className="text-secondary">No attachments yet.</p>
      )}
      {visible.length > 0 && (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card px-4">
          {visible.map((file) => (
            <li key={file.id} className="flex min-w-0 items-start gap-3 py-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-action-link">
                <FileText className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium [overflow-wrap:anywhere]">{file.filename}</p>
                <p className="text-secondary flex flex-wrap gap-x-2 text-xs">
                  {formatBytes(file.sizeBytes)}
                  <time dateTime={file.createdAt}>
                    {new Date(file.createdAt).toLocaleDateString()}
                  </time>
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={download.isPending}
                className="shrink-0"
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
