import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { mockNotifications, type NotificationItem } from '@/mocks/fixtures/notification.fixtures';
import { cn } from '@/utils/cn.util';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Notification bell icon with unread badge and inline dropdown preview */
export function NotificationBell() {
  const [items, setItems] = useState<NotificationItem[]>(mockNotifications);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const unread = items.filter((n) => !n.isRead).length;

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative flex items-center justify-center rounded-md p-2 text-[var(--foreground-secondary)] hover:bg-[var(--surface-secondary)] transition-colors"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold text-white"
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute -right-12 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border bg-card shadow-lg sm:right-0">
          {/* Dropdown header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <span className="text-sm font-semibold text-[var(--foreground)]">Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-[var(--color-primary)] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <ul className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
            {items.slice(0, 5).map((n) => (
              <li
                key={n.id}
                className={cn(
                  'flex items-start gap-3 px-4 py-3',
                  !n.isRead && 'bg-[var(--color-primary)]/5',
                )}
              >
                <span
                  className={cn(
                    'mt-1.5 block size-2 shrink-0 rounded-full',
                    n.isRead ? 'bg-transparent' : 'bg-[var(--color-primary)]',
                  )}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--foreground)]">{n.message}</p>
                  <p className="mt-0.5 text-[10px] text-[var(--foreground-muted)]">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    aria-label="Mark as read"
                    className="shrink-0 rounded p-0.5 text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Check className="size-3" aria-hidden="true" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="border-t border-[var(--border)] px-4 py-3">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs text-[var(--color-primary)] hover:underline"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
