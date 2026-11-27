import { useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { mockComments, type Comment } from '@/mocks/fixtures/collaboration.fixtures';
import { cn } from '@/utils/cn.util';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Task comment thread with mock data. Backend API will replace mock when ready. */
export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        authorName: 'You',
        content: trimmed,
        createdAt: new Date().toISOString(),
      },
    ]);
    setText('');
    textareaRef.current?.focus();
  }

  return (
    <section className="space-y-4" aria-label="Comments">
      <p className="text-xs text-[var(--foreground-muted)]">
        Mock comments — backend Collaboration API coming soon.
      </p>

      {/* Thread */}
      {comments.length === 0 ? (
        <p className="text-sm text-[var(--foreground-muted)]">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold">
                {c.authorName[0]}
              </div>
              <div className="flex-1 rounded-xl bg-[var(--surface-secondary)] px-3.5 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[var(--foreground)]">
                    {c.authorName}
                  </span>
                  <span className="text-[10px] text-[var(--foreground-muted)]">
                    {timeAgo(c.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-[var(--foreground)]">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Compose */}
      <div className="flex items-end gap-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold mt-1">
          Y
        </div>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
            }}
            placeholder="Add a comment… (Ctrl+Enter to send)"
            aria-label="Add a comment"
            className={cn(
              'w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)]',
              'px-3.5 py-2.5 text-sm placeholder:text-[var(--foreground-muted)] outline-none',
              'focus-visible:border-[var(--color-primary)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-primary)]/20',
            )}
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim()}
          aria-label="Post comment"
          className="flex items-center justify-center rounded-xl bg-[var(--color-primary)] p-2.5 text-white hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-40"
        >
          <Send className="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
