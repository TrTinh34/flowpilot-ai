import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  isNotificationDemoEnabled,
  useNotificationDemoStore,
} from '@/features/notification/store/notification-demo.store';
import { cn } from '@/utils/cn.util';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Notification bell icon with unread badge and shared dropdown preview */
export function NotificationBell() {
  const demoEnabled = isNotificationDemoEnabled();
  const items = useNotificationDemoStore((state) => state.items);
  const loadDemo = useNotificationDemoStore((state) => state.loadDemo);
  const markRead = useNotificationDemoStore((state) => state.markRead);
  const markAllRead = useNotificationDemoStore((state) => state.markAllRead);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (demoEnabled) void loadDemo();
  }, [demoEnabled, loadDemo]);

  const unread = demoEnabled ? items.filter((n) => !n.isRead).length : 0;
  const visibleItems = demoEnabled ? items.slice(0, 5) : [];

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
      <Button
        ref={trigger}
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative"
      >
        <Bell aria-hidden="true" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-action text-[10px] font-semibold tabular-nums text-action-foreground"
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute -right-12 z-[var(--z-popover)] mt-2 w-[min(21rem,calc(100vw-2rem))] rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-popover)] sm:right-0">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Notifications</span>
              {demoEnabled && <Badge tone="ai">Demo</Badge>}
            </div>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="cursor-pointer text-xs font-medium text-action-link hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {visibleItems.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-muted-foreground">
              No notifications yet.
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {visibleItems.map((n) => (
                <li
                  key={n.id}
                  className={cn('flex items-start gap-3 px-4 py-3', !n.isRead && 'bg-action/5')}
                >
                  <span
                    className={cn(
                      'mt-1.5 block size-2 shrink-0 rounded-full',
                      n.isRead ? 'bg-transparent' : 'bg-action',
                    )}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-foreground">{n.message}</p>
                    <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      aria-label={`Mark "${n.message}" as read`}
                      className="shrink-0 cursor-pointer rounded-[var(--radius-sm)] p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-action-link"
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-border px-4 py-2.5">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-action-link hover:underline"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
