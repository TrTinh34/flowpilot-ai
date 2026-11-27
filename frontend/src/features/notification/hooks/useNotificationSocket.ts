import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/app/store/auth.store';
import { isNotificationDemoEnabled } from '@/features/notification/store/notification-demo.store';
import { connectNotificationSocket, resolveSocketUrl } from '@/sockets/socket-client';

export function useNotificationSocket(options: { enabled?: boolean } = {}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const demoEnabled = isNotificationDemoEnabled();
  const active = (options.enabled ?? !demoEnabled) && Boolean(accessToken);

  useEffect(() => {
    if (!active || !accessToken) return;

    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    return connectNotificationSocket({
      url: resolveSocketUrl(),
      token: accessToken,
      onConnect: refresh,
      onNotification: refresh,
    });
  }, [active, accessToken, queryClient]);
}
