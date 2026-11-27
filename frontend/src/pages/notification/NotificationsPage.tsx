import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockNotifications, type NotificationItem } from '@/mocks/fixtures/notification.fixtures';
import { cn } from '@/utils/cn.util';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TYPE_LABEL: Record<NotificationItem['type'], string> = {
  TASK_ASSIGNED: 'Assignment',
  TASK_COMMENT: 'Comment',
  TASK_MENTION: 'Mention',
  INVITATION: 'Invitation',
};

export function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = items.filter((n) => !n.isRead).length;

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const visible = filter === 'unread' ? items.filter((n) => !n.isRead) : items;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Notifications</h1>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Check className="size-4" aria-hidden="true" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-1 w-fit">
        {(['all', 'unread'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors capitalize',
              filter === f
                ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-xs'
                : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Mock data notice */}
      <p className="mt-4 text-xs text-[var(--foreground-muted)]">
        Mock data — real notifications will appear when backend Notification API is ready.
      </p>

      {/* List */}
      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Bell className="size-10 text-[var(--foreground-muted)]" aria-hidden="true" />
            <p className="text-sm text-[var(--foreground-secondary)]">
              {filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
            </p>
          </div>
        )}

        {visible.map((n) => (
          <div
            key={n.id}
            className={cn(
              'flex items-start gap-3 px-4 py-3.5',
              !n.isRead && 'bg-[var(--color-primary)]/5',
            )}
          >
            {/* Unread dot */}
            <div className="mt-1.5 shrink-0">
              {!n.isRead ? (
                <span
                  className="block size-2 rounded-full bg-[var(--color-primary)]"
                  aria-label="Unread"
                />
              ) : (
                <span className="block size-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm',
                  n.isRead ? 'text-[var(--foreground-secondary)]' : 'text-[var(--foreground)]',
                )}
              >
                {n.message}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[11px] text-[var(--foreground-muted)]">
                  {TYPE_LABEL[n.type]}
                </span>
                <span className="text-[var(--foreground-muted)]">·</span>
                <span className="text-[11px] text-[var(--foreground-muted)]">
                  {timeAgo(n.createdAt)}
                </span>
              </div>
              {n.taskId && (
                <Link
                  to={`/tasks/${n.taskId}`}
                  className="mt-1 inline-block text-xs text-[var(--color-primary)] hover:underline"
                >
                  View task →
                </Link>
              )}
            </div>

            {/* Mark read */}
            {!n.isRead && (
              <button
                type="button"
                onClick={() => markRead(n.id)}
                aria-label="Mark as read"
                className="shrink-0 rounded p-1 text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground-secondary)] transition-colors"
              >
                <Check className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
