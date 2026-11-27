import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Mail, MessageSquare, UserPlus } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotificationsFeed } from '@/features/notification/hooks/useNotificationsFeed';
import type {
  NotificationItem,
  NotificationType,
} from '@/features/notification/types/notification.types';
import { extractApiErrorMessage } from '@/services/api-client';
import { cn } from '@/utils/cn.util';

const PAGE_SIZE = 20;

const TYPE_META: Record<NotificationType, { label: string; tone: BadgeTone; icon: typeof Bell }> = {
  TASK_ASSIGNED: { label: 'Assignment', tone: 'info', icon: Bell },
  TASK_COMMENT: { label: 'Comment', tone: 'neutral', icon: MessageSquare },
  TASK_MENTION: { label: 'Mention', tone: 'primary', icon: Mail },
  INVITATION: { label: 'Invitation', tone: 'success', icon: UserPlus },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function isRecentGroup(iso: string, latestDay: string) {
  return iso.slice(0, 10) === latestDay;
}

export function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [page, setPage] = useState(0);
  const {
    demoEnabled,
    items,
    unreadCount,
    isLoading,
    isError,
    error,
    refetch,
    markRead,
    markAllRead,
    isMutating,
  } = useNotificationsFeed({ page, size: PAGE_SIZE, unreadOnly: filter === 'unread' });

  const latestDay = items[0]?.createdAt.slice(0, 10) ?? '';
  const todayItems = items.filter((item) => isRecentGroup(item.createdAt, latestDay));
  const earlierItems = items.filter((item) => !isRecentGroup(item.createdAt, latestDay));

  const groups: Array<{ heading: string; entries: NotificationItem[] }> = [
    ...(todayItems.length ? [{ heading: 'Latest', entries: todayItems }] : []),
    ...(earlierItems.length ? [{ heading: 'Earlier', entries: earlierItems }] : []),
  ];

  const hasNext = !demoEnabled && items.length >= PAGE_SIZE;

  return (
    <div className="mx-auto w-full max-w-[820px] space-y-6 px-page-gutter py-6">
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `${unreadCount} unread`
            : 'Inbox updates for assignments, comments, mentions, and invitations.'
        }
        badge={demoEnabled && <Badge tone="ai">Demo</Badge>}
        actions={
          unreadCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isMutating}
              onClick={() => markAllRead()}
            >
              <Check aria-hidden="true" />
              Mark all read
            </Button>
          )
        }
      />

      {isError ? (
        <ErrorState
          title="Could not load notifications"
          message={extractApiErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <LoadingState label="Loading notifications" variant="list" />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              value={filter}
              onValueChange={(value) => {
                setFilter(value as 'all' | 'unread');
                setPage(0);
              }}
            >
              <TabsList>
                <TabsTrigger value="all">
                  All{filter === 'all' ? ` (${items.length})` : ''}
                </TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              </TabsList>
            </Tabs>
            {demoEnabled && (
              <p className="text-xs text-muted-foreground">
                Sample notifications for demo preview.
              </p>
            )}
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon={Bell}
              title={filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
              description={
                filter === 'unread'
                  ? 'You have read all incoming updates.'
                  : 'Mentions, assignments, comments, and workspace invitations appear here.'
              }
            />
          ) : (
            <div className="space-y-4">
              {groups.map(({ heading, entries }) => (
                <section key={heading} aria-label={heading} className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {heading}
                  </h2>
                  <ul className="divide-y divide-border rounded-[var(--radius-md)] border border-border bg-card">
                    {entries.map((item) => {
                      const meta = TYPE_META[item.type];
                      const TypeIcon = meta.icon;
                      return (
                        <li
                          key={item.id}
                          className={cn(
                            'flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between',
                            !item.isRead && 'bg-action/5',
                          )}
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <span
                              className={cn(
                                'mt-2 block size-2 shrink-0 rounded-full',
                                item.isRead ? 'bg-transparent' : 'bg-action',
                              )}
                              aria-label={item.isRead ? undefined : 'Unread'}
                            />
                            <div className="min-w-0 space-y-1.5">
                              {!demoEnabled && item.taskId ? (
                                <Link
                                  to={`/tasks/${item.taskId}`}
                                  className={cn(
                                    'block text-sm break-words hover:text-action-link hover:underline',
                                    item.isRead
                                      ? 'text-muted-foreground'
                                      : 'font-medium text-foreground',
                                  )}
                                >
                                  {item.message}
                                </Link>
                              ) : (
                                <p
                                  className={cn(
                                    'text-sm break-words',
                                    item.isRead
                                      ? 'text-muted-foreground'
                                      : 'font-medium text-foreground',
                                  )}
                                >
                                  {item.message}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <Badge tone={meta.tone}>
                                  <TypeIcon className="size-3" aria-hidden="true" />
                                  {meta.label}
                                </Badge>
                                <time dateTime={item.createdAt} className="tabular-nums">
                                  {timeAgo(item.createdAt)}
                                </time>
                              </div>
                            </div>
                          </div>
                          {!item.isRead && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isMutating}
                              className="self-start shrink-0"
                              onClick={() => markRead(item.id)}
                              aria-label={`Mark "${item.message}" as read`}
                            >
                              <Check aria-hidden="true" />
                              Mark read
                            </Button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
              {!demoEnabled && (page > 0 || hasNext) && (
                <Pagination page={page} hasNext={hasNext} onPageChange={setPage} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
