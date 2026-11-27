import { useId, useRef, useState, type FormEvent } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/app/store/auth.store';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';
import { LoadingState } from '@/components/common/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  const inputId = useId();
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
      {comments.isPending && <LoadingState label="Loading comments" variant="list" />}
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
        <EmptyState compact icon={MessageSquare} title="No comments yet." />
      )}
      {visible.length > 0 && (
        <ul className="divide-y divide-border rounded-[var(--radius-md)] border border-border bg-card px-4">
          {visible.map((comment) => (
            <li key={comment.id} className="flex min-w-0 items-start gap-3 py-3.5">
              <Avatar name={comment.authorName} size="sm" tone="subtle" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <strong className="min-w-0 text-sm font-semibold text-foreground [overflow-wrap:anywhere]">
                    {comment.authorName}
                  </strong>
                  <time
                    className="text-xs tabular-nums text-muted-foreground"
                    dateTime={comment.createdAt}
                  >
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">
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
          size="sm"
          disabled={comments.isFetchingNextPage}
          onClick={() => void comments.fetchNextPage()}
        >
          Load more comments
        </Button>
      )}
      {canWrite && (
        <form
          onSubmit={submit}
          className="space-y-3 rounded-[var(--radius-md)] border border-border bg-card p-4"
        >
          <div className="grid gap-1.5">
            <Label htmlFor={inputId}>Add a comment</Label>
            <Textarea
              id={inputId}
              name="body"
              rows={3}
              value={body}
              disabled={post.isPending}
              placeholder="Write a comment or update…"
              onChange={(event) => setBody(event.target.value)}
            />
          </div>
          {members.length > 0 && (
            <details className="rounded-[var(--radius)] border border-border bg-muted/40 px-3 py-2">
              <summary className="flex cursor-pointer items-center justify-between gap-2 text-sm font-medium text-foreground">
                Mention project members
                {mentionIds.length > 0 && <Badge tone="primary">{mentionIds.length}</Badge>}
              </summary>
              <fieldset
                disabled={post.isPending}
                className="mt-2 max-h-44 space-y-1 overflow-y-auto pt-1"
              >
                <legend className="sr-only">Mention recipients</legend>
                {members.map(({ userId, user }) => (
                  <label
                    key={userId}
                    htmlFor={`mention-${userId}`}
                    className="flex min-w-0 cursor-pointer items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm hover:bg-card"
                  >
                    <input
                      id={`mention-${userId}`}
                      name="mentionIds"
                      type="checkbox"
                      className="size-4 shrink-0 accent-[var(--action-primary)]"
                      checked={mentionIds.includes(userId)}
                      onChange={(event) => {
                        const checked = event.currentTarget.checked;
                        setMentionIds((selected) =>
                          checked ? [...selected, userId] : selected.filter((id) => id !== userId),
                        );
                      }}
                    />
                    <Avatar name={user.displayName} size="xs" />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{user.displayName}</span>
                  </label>
                ))}
              </fieldset>
              {mentionIds.length > 100 && (
                <p role="alert" className="mt-1 text-xs text-[var(--color-error-text)]">
                  Select up to 100 members.
                </p>
              )}
            </details>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              type="submit"
              disabled={!body.trim() || post.isPending || mentionIds.length > 100}
            >
              {post.isPending ? 'Posting…' : 'Post comment'}
            </Button>
            {post.isSuccess && (
              <p role="status" className="text-xs font-medium text-[var(--success-text)]">
                Comment posted.
              </p>
            )}
          </div>
        </form>
      )}
      <FormErrorBanner message={post.isError ? extractApiErrorMessage(post.error) : undefined} />
    </section>
  );
}
