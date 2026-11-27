import type { Socket } from 'socket.io-client';
import type { NotificationItem } from '@/features/notification/types/notification.types';

export interface NotificationSocketOptions {
  url: string;
  token: string;
  onNotification: (notification: NotificationItem) => void;
  onConnect: () => void;
}

export function resolveSocketUrl(): string {
  const explicit = import.meta.env.VITE_SOCKET_URL?.trim();
  if (explicit) return explicit;
  const apiBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (apiBase && /^https?:\/\//i.test(apiBase)) {
    return apiBase.replace(/\/api\/v1\/?$/, '');
  }
  return window.location.origin;
}

export function connectNotificationSocket({
  url,
  token,
  onNotification,
  onConnect,
}: NotificationSocketOptions): () => void {
  let disposed = false;
  let socket: Socket | undefined;

  void import('socket.io-client').then(({ io }) => {
    if (disposed) return;
    const instance = io(url, {
      auth: { token },
      withCredentials: true,
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
    socket = instance;
    instance.on('connect', onConnect);
    instance.on('notification:new', onNotification);
  });

  return () => {
    disposed = true;
    socket?.off('connect', onConnect);
    socket?.off('notification:new', onNotification);
    socket?.disconnect();
  };
}
