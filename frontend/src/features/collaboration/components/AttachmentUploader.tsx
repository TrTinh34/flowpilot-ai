import { useRef, useState } from 'react';
import { Upload, FileText, Image, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { mockAttachments, type Attachment } from '@/mocks/fixtures/collaboration.fixtures';
import { cn } from '@/utils/cn.util';

const ALLOWED_MIME = new Set(['application/pdf', 'image/png', 'image/jpeg']);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadingFile {
  name: string;
  progress: number;
}

export function AttachmentUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>(mockAttachments);
  const [uploading, setUploading] = useState<UploadingFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function validateAndUpload(file: File) {
    setError(null);
    if (!ALLOWED_MIME.has(file.type)) {
      setError('Only PDF, PNG, and JPEG files are allowed.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`File is too large (${formatBytes(file.size)}). Maximum size is 10 MB.`);
      return;
    }

    // Simulate upload progress
    setUploading({ name: file.name, progress: 0 });
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploading({ name: file.name, progress });
      if (progress >= 100) {
        clearInterval(interval);
        setAttachments((prev) => [
          ...prev,
          {
            id: `att-${Date.now()}`,
            name: file.name,
            size: file.size,
            mimeType: file.type,
            uploadedAt: new Date().toISOString(),
          },
        ]);
        setTimeout(() => setUploading(null), 400);
      }
    }, 300);
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    validateAndUpload(files[0]!);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <section className="space-y-4" aria-label="Attachments">
      <p className="text-xs text-[var(--foreground-muted)]">
        Mock upload — backend File API coming soon.
      </p>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer',
          isDragging
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
            : 'border-[var(--border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--surface-secondary)]',
        )}
      >
        <Upload className="size-6 text-[var(--foreground-muted)]" aria-hidden="true" />
        <p className="text-sm text-[var(--foreground-secondary)]">
          Drag & drop or{' '}
          <span className="text-[var(--color-primary)] font-medium">browse</span>
        </p>
        <p className="text-xs text-[var(--foreground-muted)]">PDF, PNG, JPEG · Max 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-hidden="true"
        />
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5">
          <div className="flex-1">
            <p className="text-xs font-medium text-[var(--foreground)]">{uploading.name}</p>
            <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--border)]">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                style={{ width: `${uploading.progress}%` }}
                role="progressbar"
                aria-valuenow={uploading.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
          {uploading.progress === 100 && (
            <CheckCircle className="size-4 text-green-500" aria-hidden="true" />
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      {/* Attachment list */}
      {attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map((att) => (
            <li
              key={att.id}
              className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5"
            >
              {att.mimeType.startsWith('image/') ? (
                <Image className="size-4 shrink-0 text-blue-400" aria-hidden="true" />
              ) : (
                <FileText className="size-4 shrink-0 text-red-400" aria-hidden="true" />
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm text-[var(--foreground)]">{att.name}</p>
                <p className="text-[11px] text-[var(--foreground-muted)]">{formatBytes(att.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                aria-label={`Remove ${att.name}`}
                className="shrink-0 rounded p-1 text-[var(--foreground-muted)] hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {attachments.length === 0 && !uploading && (
        <p className="text-sm text-[var(--foreground-muted)]">No attachments yet.</p>
      )}
    </section>
  );
}
