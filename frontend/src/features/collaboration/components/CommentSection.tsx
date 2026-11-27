import { useRef, useState, type FormEvent } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/app/store/auth.store';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
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
  const posting = useRef(false);
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
    onSettled: () => {
      posting.current = false;
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (canWrite && body.trim() && mentionIds.length <= 100 && !posting.current) {
      posting.current = true;
      post.mutate({ body: body.trim(), mentionIds });
    }
  }

  const thread = comments.data?.pages.flatMap((page) => page.data) ?? [];
  const latest = post.data;
  const visible =
    latest && !thread.some(({ id }) => id === latest.id) ? [...thread, latest] : thread;
  return (
    <section aria-label="Comments" className="space-y-4">
      {comments.isPending && <LoadingState label="Loading comments" />}
      {comments.isError && (
        <ErrorState
          title="Could not load comments"
          message={extractApiErrorMessage(comments.error)}
          onRetry={() =>
            void (comments.isFetchNextPageError ? comments.fetchNextPage() : comments.refetch())
          }
        />
      )}
      {comments.isSuccess && visible.length === 0 && (
        <p className="text-secondary">No comments yet.</p>
      )}
      {visible.length > 0 && (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card px-4">
          {visible.map((comment) => (
            <li key={comment.id} className="flex min-w-0 items-start gap-3 py-4">
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-muted font-semibold text-action-link"
              >
                {Array.from(comment.authorName)[0]?.toLocaleUpperCase()}
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <strong className="min-w-0 [overflow-wrap:anywhere]">{comment.authorName}</strong>
                  <time className="text-secondary text-xs" dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className="whitespace-pre-wrap text-sm [overflow-wrap:anywhere]">
                  {comment.body}
                </p>
              </div>
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
        <form onSubmit={submit} className="space-y-3 rounded-xl border border-border bg-card p-4">
          <label className="grid gap-1">
            Add a comment
            <textarea
              className="w-full min-w-0 rounded-lg border border-input bg-background p-3"
              rows={3}
              value={body}
              disabled={post.isPending}
              onChange={(event) => setBody(event.target.value)}
            />
          </label>
          {members.length > 0 && (
            <details className="rounded-lg border border-border p-2">
              <summary className="cursor-pointer p-1 text-sm font-medium">
                Mention project members{mentionIds.length > 0 && ` (${mentionIds.length})`}
              </summary>
              <fieldset
                disabled={post.isPending}
                className="mt-2 max-h-44 space-y-1 overflow-y-auto p-1"
              >
                <legend className="sr-only">Mention recipients</legend>
                {members.map(({ userId, user }) => (
                  <label
                    key={userId}
                    className="flex min-w-0 items-start gap-2 rounded-md px-2 py-2 hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 shrink-0"
                      checked={mentionIds.includes(userId)}
                      onChange={(event) => {
                        const checked = event.currentTarget.checked;
                        setMentionIds((selected) =>
                          checked ? [...selected, userId] : selected.filter((id) => id !== userId),
                        );
                      }}
                    />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{user.displayName}</span>
                  </label>
                ))}
              </fieldset>
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
