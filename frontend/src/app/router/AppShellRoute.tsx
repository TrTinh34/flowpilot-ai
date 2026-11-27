import { Outlet } from 'react-router-dom';
import { AppShellLayout } from '@/layouts/AppShellLayout';

/** Wraps child routes in the authenticated AppShellLayout. */
export function AppShellRoute() {
  return (
    <AppShellLayout>
      <Outlet />
    </AppShellLayout>
  );
}
