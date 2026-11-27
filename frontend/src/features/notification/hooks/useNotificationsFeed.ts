import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/app/store/auth.store';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../api/notification.api';
import {
  isNotificationDemoEnabled,
  useNotificationDemoStore,
} from '../store/notification-demo.store';
import type { NotificationItem } from '../types/notification.types';

export function useNotificationsFeed(
  options: { page?: number; size?: number; unreadOnly?: boolean } = {},
) {
  const demoEnabled = isNotificationDemoEnabled();
  const revision = useAuthStore((state) => state.sessionRevision);
  const queryClient = useQueryClient();
  const page = options.page ?? 0;
  const size = options.size ?? 20;
  const unreadOnly = options.unreadOnly ?? false;

  const demoItems = useNotificationDemoStore((state) => state.items);
  const demoLoading = useNotificationDemoStore((state) => state.loading);
  const loadDemo = useNotificationDemoStore((state) => state.loadDemo);
  const demoMarkRead = useNotificationDemoStore((state) => state.markRead);
  const demoMarkAllRead = useNotificationDemoStore((state) => state.markAllRead);

  useEffect(() => {
    if (demoEnabled) void loadDemo();
  }, [demoEnabled, loadDemo]);

  const query = useQuery({
    queryKey: ['notifications', revision, { page, size, unreadOnly }],
    queryFn: () => listNotifications(page, size, unreadOnly),
    enabled: !demoEnabled,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  if (demoEnabled) {
    const filtered: NotificationItem[] = unreadOnly
      ? demoItems.filter((item) => !item.isRead)
      : demoItems;
    return {
      demoEnabled: true,
      items: filtered,
      allCount: demoItems.length,
      unreadCount: demoItems.filter((item) => !item.isRead).length,
      isLoading: demoLoading,
      isError: false,
      error: null as unknown,
      refetch: () => loadDemo(),
      markRead: (id: string) => demoMarkRead(id),
      markAllRead: () => demoMarkAllRead(),
      isMutating: false,
    };
  }

  return {
    demoEnabled: false,
    items: query.data?.data ?? [],
    allCount: query.data?.data.length ?? 0,
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: () => query.refetch(),
    markRead: (id: string) => void markReadMutation.mutateAsync(id),
    markAllRead: () => void markAllMutation.mutateAsync(),
    isMutating: markReadMutation.isPending || markAllMutation.isPending,
  };
}
