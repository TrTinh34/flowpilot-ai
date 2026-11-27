import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { NotificationBell } from '@/features/notification/components/NotificationBell';
import { useNotificationDemoStore } from '@/features/notification/store/notification-demo.store';
import { NotificationsPage } from '@/pages/notification/NotificationsPage';

beforeEach(() => {
  vi.stubEnv('DEV', true);
  vi.stubEnv('VITE_USE_MOCK_API', 'false');
  useNotificationDemoStore.getState().reset([]);
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  useNotificationDemoStore.getState().reset([]);
});

it('shows genuine empty state and hides demo fixtures when Demo is off or in production', async () => {
  render(
    <MemoryRouter>
      <NotificationBell />
      <NotificationsPage />
    </MemoryRouter>,
  );
  expect(screen.getByRole('heading', { name: 'Notifications' })).toBeInTheDocument();
  expect(screen.getByText('No notifications yet.')).toBeVisible();
  expect(screen.queryByText(/Alice assigned you/)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();

  vi.stubEnv('DEV', false);
  vi.stubEnv('VITE_USE_MOCK_API', 'true');
  cleanup();
  await useNotificationDemoStore.getState().loadDemo();
  expect(useNotificationDemoStore.getState().items).toHaveLength(0);
});

it('synchronizes unread count and read status between Bell and NotificationsPage in Demo mode', async () => {
  vi.stubEnv('VITE_USE_MOCK_API', 'true');
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <NotificationBell />
      <NotificationsPage />
    </MemoryRouter>,
  );

  expect(await screen.findByText(/Set up CI pipeline/)).toBeInTheDocument();
  const bell = screen.getByRole('button', { name: 'Notifications, 2 unread' });
  expect(bell).toBeInTheDocument();

  await user.click(bell);
  const firstReadBtn = screen.getAllByRole('button', {
    name: /Mark "Alice assigned you to "Set up CI pipeline"" as read/,
  })[0];
  await user.click(firstReadBtn);

  expect(screen.getByRole('button', { name: 'Notifications, 1 unread' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'Unread (1)' })).toBeInTheDocument();

  await user.click(screen.getByRole('tab', { name: 'Unread (1)' }));
  expect(screen.queryByText(/Charlie mentioned you/)).not.toBeInTheDocument();
  expect(screen.getByText(/Bob commented on/)).toBeInTheDocument();

  await user.click(
    within(screen.getByRole('banner')).getByRole('button', { name: 'Mark all read' }),
  );
  expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  expect(screen.getByText('No unread notifications.')).toBeVisible();
});
