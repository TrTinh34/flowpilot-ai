import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/app/store/auth.store';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/features/notification/api/notification.api';
import { NotificationBell } from '@/features/notification/components/NotificationBell';
import { useNotificationSocket } from '@/features/notification/hooks/useNotificationSocket';
import { useNotificationDemoStore } from '@/features/notification/store/notification-demo.store';
import { NotificationsPage } from '@/pages/notification/NotificationsPage';
import { connectNotificationSocket } from '@/sockets/socket-client';

vi.mock('@/features/notification/api/notification.api');
vi.mock('@/sockets/socket-client', () => ({
  resolveSocketUrl: () => 'http://localhost:3000',
  connectNotificationSocket: vi.fn(() => vi.fn()),
}));

function renderNotifications(withSocket = false) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper() {
    useNotificationSocket({ enabled: withSocket });
    return (
      <>
        <NotificationBell />
        <NotificationsPage />
      </>
    );
  }
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Wrapper />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv('DEV', true);
  vi.stubEnv('VITE_USE_MOCK_API', 'false');
  useNotificationDemoStore.getState().reset([]);
  useAuthStore.getState().clearAuth();
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  useNotificationDemoStore.getState().reset([]);
  useAuthStore.getState().clearAuth();
});

it('loads live notifications, handles API errors with retry, and syncs mark-read mutations', async () => {
  const user = userEvent.setup();
  vi.mocked(listNotifications)
    .mockRejectedValueOnce(new Error('Network offline'))
    .mockResolvedValue({
      data: [
        {
          id: 'live-1',
          type: 'TASK_MENTION',
          message: 'Alice mentioned you in "API spec"',
          taskId: 'task-42',
          isRead: false,
          createdAt: '2026-11-28T03:00:00.000Z',
        },
        {
          id: 'live-2',
          type: 'TASK_ASSIGNED',
          message: 'Bob assigned you to "Fix bug"',
          taskId: null,
          isRead: true,
          createdAt: '2026-11-27T12:00:00.000Z',
        },
      ],
      page: 0,
      size: 20,
      unreadCount: 1,
    });
  vi.mocked(markNotificationRead).mockResolvedValue();
  vi.mocked(markAllNotificationsRead).mockResolvedValue();

  renderNotifications();

  expect(await screen.findAllByRole('alert')).not.toHaveLength(0);
  await user.click(screen.getAllByRole('button', { name: 'Retry' })[0]);

  const taskLink = await screen.findByRole('link', {
    name: 'Alice mentioned you in "API spec"',
  });
  expect(taskLink).toHaveAttribute('href', '/tasks/task-42');
  expect(screen.getByRole('button', { name: 'Notifications, 1 unread' })).toBeInTheDocument();

  await user.click(
    screen.getByRole('button', {
      name: 'Mark "Alice mentioned you in "API spec"" as read',
    }),
  );
  expect(markNotificationRead).toHaveBeenCalledWith('live-1');

  await user.click(
    within(screen.getByRole('banner')).getByRole('button', { name: 'Mark all read' }),
  );
  expect(markAllNotificationsRead).toHaveBeenCalledTimes(1);
});

it('connects Socket.IO with access token and refreshes notifications on event and reconnect', async () => {
  const disconnectSpy = vi.fn();
  let handlers:
    | {
        onConnect: () => void;
        onNotification: (item: {
          id: string;
          type: 'TASK_MENTION';
          message: string;
          isRead: boolean;
          createdAt: string;
        }) => void;
      }
    | undefined;
  vi.mocked(connectNotificationSocket).mockImplementation((opts) => {
    handlers = { onConnect: opts.onConnect, onNotification: opts.onNotification };
    return disconnectSpy;
  });
  vi.mocked(listNotifications).mockResolvedValue({
    data: [],
    page: 0,
    size: 20,
    unreadCount: 0,
  });

  useAuthStore
    .getState()
    .setAuth('jwt-access-token', 900, { id: 'u1', email: 'u1@test.local', displayName: 'U1' });

  const view = renderNotifications(true);
  expect(await screen.findByText('No notifications yet.')).toBeVisible();
  expect(connectNotificationSocket).toHaveBeenCalledWith(
    expect.objectContaining({
      url: 'http://localhost:3000',
      token: 'jwt-access-token',
    }),
  );

  const initialCalls = vi.mocked(listNotifications).mock.calls.length;
  handlers?.onNotification({
    id: 'n-live',
    type: 'TASK_MENTION',
    message: 'New live ping',
    isRead: false,
    createdAt: '2026-11-28T03:30:00.000Z',
  });
  await vi.waitFor(() => {
    expect(vi.mocked(listNotifications).mock.calls.length).toBeGreaterThan(initialCalls);
  });

  const beforeReconnect = vi.mocked(listNotifications).mock.calls.length;
  handlers?.onConnect();
  await vi.waitFor(() => {
    expect(vi.mocked(listNotifications).mock.calls.length).toBeGreaterThan(beforeReconnect);
  });

  view.unmount();
  expect(disconnectSpy).toHaveBeenCalledOnce();
});

it('blocks demo fixtures in production and synchronizes Bell and NotificationsPage in Demo mode', async () => {
  vi.stubEnv('DEV', false);
  vi.stubEnv('VITE_USE_MOCK_API', 'true');
  vi.mocked(listNotifications).mockResolvedValue({
    data: [],
    page: 0,
    size: 20,
    unreadCount: 0,
  });

  renderNotifications();
  expect(await screen.findByText('No notifications yet.')).toBeVisible();
  expect(screen.queryByText(/Alice assigned you/)).not.toBeInTheDocument();
  await useNotificationDemoStore.getState().loadDemo();
  expect(useNotificationDemoStore.getState().items).toHaveLength(0);

  cleanup();
  useNotificationDemoStore.getState().reset([]);
  vi.stubEnv('DEV', true);
  vi.stubEnv('VITE_USE_MOCK_API', 'true');
  const user = userEvent.setup();
  renderNotifications();

  expect(await screen.findByText(/Set up CI pipeline/)).toBeInTheDocument();
  const bell = screen.getByRole('button', { name: 'Notifications, 2 unread' });
  await user.click(bell);
  const firstReadBtn = screen.getAllByRole('button', {
    name: /Mark "Alice assigned you to "Set up CI pipeline"" as read/,
  })[0];
  await user.click(firstReadBtn);

  expect(screen.getByRole('button', { name: 'Notifications, 1 unread' })).toBeInTheDocument();
  await user.click(screen.getByRole('tab', { name: 'Unread (1)' }));
  expect(screen.queryByText(/Charlie mentioned you/)).not.toBeInTheDocument();
  expect(screen.getByText(/Bob commented on/)).toBeInTheDocument();

  await user.click(
    within(screen.getByRole('banner')).getByRole('button', { name: 'Mark all read' }),
  );
  expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  expect(screen.getByText('No unread notifications.')).toBeVisible();
});
