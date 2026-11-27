import { useState, type FormEvent } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/app/store/auth.store';
import { Button } from '@/components/ui/button';
import type { ProjectMember } from '@/features/project/api/project.api';
import { extractApiErrorMessage } from '@/services/api-client';
import { listComments, postComment } from '../api/collaboration.api';

interface Props {
  taskId: string;
  canWrite: boolean;
  members: ProjectMember[];
}

export function CommentSection({ taskId, canWrite, members }: Props) {
  const revision = useAuthStore((state) => state.sessionRevision);
  const client = useQueryClient();
  const [body, setBody] = useState('');
  const [mentionIds, setMentionIds] = useState<string[]>([]);
  const key = ['task-comments', revision, taskId];
  const comments = useInfiniteQuery({
    queryKey: key,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => listComments(taskId, pageParam),
    getNextPageParam: (last) => (last.data.length === last.size ? last.page + 1 : undefined),
  });
  const post = useMutation({
    mutationFn: (input: { body: string; mentionIds: string[] }) => postComment(taskId, input),
    onSuccess: async () => {
      setBody('');
      setMentionIds([]);
      await client.invalidateQueries({ queryKey: key });
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (canWrite && body.trim() && mentionIds.length <= 100 && !post.isPending) {
      post.mutate({ body: body.trim(), mentionIds });
    }
  }

  const thread = comments.data?.pages.flatMap((page) => page.data) ?? [];
  const latest = post.data;
  const visible =
    latest && !thread.some(({ id }) => id === latest.id) ? [...thread, latest] : thread;
  return (
    <section aria-label="Comments" className="space-y-4">
      {comments.isPending && <p role="status">Loading comments…</p>}
      {comments.isError && <p role="alert">{extractApiErrorMessage(comments.error)}</p>}
      {comments.isSuccess && visible.length === 0 && <p>No comments yet.</p>}
      {visible.length > 0 && (
        <ul className="space-y-3">
          {visible.map((comment) => (
            <li key={comment.id} className="space-y-1 rounded-xl bg-[var(--surface-secondary)] p-3">
              <div className="flex items-center gap-2 text-xs">
                <strong>{comment.authorName}</strong>
                <time className="text-[var(--foreground-muted)]" dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleString()}
                </time>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
      {comments.hasNextPage && (
        <Button
          type="button"
          variant="outline"
          disabled={comments.isFetchingNextPage}
          onClick={() => void comments.fetchNextPage()}
        >
          Load more comments
        </Button>
      )}
      {canWrite && (
        <form onSubmit={submit} className="space-y-3">
          <label className="grid gap-1">
            Add a comment
            <textarea
              className="rounded-lg border bg-[var(--surface)] p-2"
              rows={3}
              value={body}
              disabled={post.isPending}
              onChange={(event) => setBody(event.target.value)}
            />
          </label>
          {members.length > 0 && (
            <details>
              <summary className="cursor-pointer text-sm">Mention project members</summary>
              <label className="grid gap-1 text-sm">
                Recipients
                <select
                  multiple
                  className="max-h-32 rounded-lg border p-2"
                  value={mentionIds}
                  disabled={post.isPending}
                  onChange={(event) =>
                    setMentionIds(
                      Array.from(event.currentTarget.selectedOptions, ({ value }) => value),
                    )
                  }
                >
                  {members.map(({ userId, user }) => (
                    <option key={userId} value={userId}>
                      {user.displayName}
                    </option>
                  ))}
                </select>
              </label>
              {mentionIds.length > 100 && <p role="alert">Select up to 100 members.</p>}
            </details>
          )}
          <Button
            type="submit"
            disabled={!body.trim() || post.isPending || mentionIds.length > 100}
          >
            {post.isPending ? 'Posting…' : 'Post comment'}
          </Button>
        </form>
      )}
      {post.isError && <p role="alert">{extractApiErrorMessage(post.error)}</p>}
      {post.isSuccess && <p role="status">Comment posted.</p>}
    </section>
  );
}
