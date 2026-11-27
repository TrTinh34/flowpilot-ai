import { create } from 'zustand';
import type { NotificationItem } from '@/mocks/fixtures/notification.fixtures';

export function isNotificationDemoEnabled() {
  return import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true';
}

interface NotificationDemoState {
  items: NotificationItem[];
  initialized: boolean;
  loading: boolean;
  loadDemo: () => Promise<void>;
  markRead: (id: string) => void;
  markAllRead: () => void;
  reset: (items?: NotificationItem[]) => void;
}

export const useNotificationDemoStore = create<NotificationDemoState>((set, get) => ({
  items: [],
  initialized: false,
  loading: false,
  loadDemo: async () => {
    if (!import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_API !== 'true') {
      set({ items: [], initialized: true, loading: false });
      return;
    }
    if (get().initialized || get().loading) return;
    set({ loading: true });
    const { mockNotifications } = await import('@/mocks/fixtures/notification.fixtures');
    set({
      items: mockNotifications.map((item) => ({ ...item })),
      initialized: true,
      loading: false,
    });
  },
  markRead: (id) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    })),
  markAllRead: () =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, isRead: true })),
    })),
  reset: (items = []) => set({ items, initialized: items.length > 0, loading: false }),
}));
