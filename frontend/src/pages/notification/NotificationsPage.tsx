import { useEffect, useState } from 'react';
import { Bell, Check, Mail, MessageSquare, UserPlus } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  isNotificationDemoEnabled,
  useNotificationDemoStore,
} from '@/features/notification/store/notification-demo.store';
import type { NotificationItem, NotificationType } from '@/mocks/fixtures/notification.fixtures';
import { cn } from '@/utils/cn.util';

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
  const demoEnabled = isNotificationDemoEnabled();
  const items = useNotificationDemoStore((state) => state.items);
  const loading = useNotificationDemoStore((state) => state.loading);
  const loadDemo = useNotificationDemoStore((state) => state.loadDemo);
  const markRead = useNotificationDemoStore((state) => state.markRead);
  const markAllRead = useNotificationDemoStore((state) => state.markAllRead);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (demoEnabled) void loadDemo();
  }, [demoEnabled, loadDemo]);

  const activeItems = demoEnabled ? items : [];
  const unreadCount = activeItems.filter((n) => !n.isRead).length;
  const visible = filter === 'unread' ? activeItems.filter((n) => !n.isRead) : activeItems;
  const latestDay = activeItems[0]?.createdAt.slice(0, 10) ?? '';
  const todayItems = visible.filter((item) => isRecentGroup(item.createdAt, latestDay));
  const earlierItems = visible.filter((item) => !isRecentGroup(item.createdAt, latestDay));

  const groups: Array<{ heading: string; entries: NotificationItem[] }> = [
    ...(todayItems.length ? [{ heading: 'Latest', entries: todayItems }] : []),
    ...(earlierItems.length ? [{ heading: 'Earlier', entries: earlierItems }] : []),
  ];

  return (
    <div className="mx-auto w-full max-w-[820px] space-y-6 px-page-gutter py-6">
      <PageHeader
        title="Notifications"
        description={
          demoEnabled
            ? unreadCount > 0
              ? `${unreadCount} unread`
              : 'All caught up'
            : 'Inbox updates for assignments, comments, mentions, and invitations.'
        }
        badge={demoEnabled && <Badge tone="ai">Demo</Badge>}
        actions={
          demoEnabled &&
          unreadCount > 0 && (
            <Button type="button" variant="outline" size="sm" onClick={markAllRead}>
              <Check aria-hidden="true" />
              Mark all read
            </Button>
          )
        }
      />

      {!demoEnabled ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet."
          description="Live notification delivery will appear here once the notification service is enabled."
        />
      ) : loading ? (
        <LoadingState label="Loading notifications" variant="list" />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'unread')}>
              <TabsList>
                <TabsTrigger value="all">All ({activeItems.length})</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-xs text-muted-foreground">Sample notifications for demo preview.</p>
          </div>

          {visible.length === 0 ? (
            <EmptyState
              compact
              icon={Bell}
              title={filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
