import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, DropdownMenu } from 'radix-ui';
import {
  Bell,
  Building2,
  CheckSquare,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/app/store/auth.store';
import { useUiStore } from '@/app/store/ui.store';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { NotificationBell } from '@/features/notification/components/NotificationBell';
import { WorkspaceSwitcher } from '@/features/workspace/components/WorkspaceSwitcher';
import { cn } from '@/utils/cn.util';
import { useShellContext } from './useShellContext';

type ShellContext = ReturnType<typeof useShellContext>;

function ShellNavigation({
  context,
  collapsed = false,
}: {
  context: ShellContext;
  collapsed?: boolean;
}) {
  const { pathname } = useLocation();
  const { workspaces, workspace, workspaceId, project, inProject } = context;
  const projectsLink = workspaceId ? `/workspaces/${workspaceId}/projects` : '/workspaces';
  const groups = [
    {
      name: 'Workspace',
      items: [
        { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { label: 'My Tasks', to: '/my-tasks', icon: CheckSquare },
        { label: 'Projects', to: projectsLink, icon: FolderKanban, contextActive: inProject },
        { label: 'Notifications', to: '/notifications', icon: Bell },
      ],
    },
    { name: 'Tools', items: [{ label: 'AI Planner', to: '/ai/planner', icon: Sparkles }] },
    {
      name: 'Settings',
      items: [
        { label: 'Workspace settings', to: '/workspaces', icon: Building2 },
        { label: 'Profile', to: '/settings/profile', icon: Settings },
      ],
    },
  ];
  const user = useAuthStore((state) => state.user);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        to="/dashboard"
        aria-label="FlowPilot AI home"
        className="flex h-16 shrink-0 items-center justify-center px-3"
      >
        <Logo className={cn('text-action-link', !collapsed && 'mr-auto')} showName={!collapsed} />
      </Link>
      <div className="shrink-0 border-y border-border p-2">
        <WorkspaceSwitcher workspaces={workspaces} active={workspace} collapsed={collapsed} />
      </div>
      <nav aria-label="Main navigation" className="flex-1 space-y-4 overflow-y-auto px-2 py-4">
        {groups.map(({ name, items }) => (
          <ul key={name} aria-label={name} className="space-y-1">
            {!collapsed && (
              <li
                aria-hidden="true"
                className="px-2 pb-1 text-caption font-semibold uppercase tracking-wide"
              >
                {name}
              </li>
            )}
            {items.map(({ label, icon: Icon, to, contextActive }) => {
              const current = pathname === to && (label !== 'Projects' || Boolean(workspaceId));
              return (
                <li key={label}>
                  <Link
                    to={to}
                    aria-label={label}
                    title={collapsed ? label : undefined}
                    aria-current={current ? 'page' : contextActive ? 'location' : undefined}
                    className={cn(
                      'relative flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground hover:bg-muted',
                      (current || contextActive) &&
                        'bg-muted text-action-link before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-action',
                      collapsed && 'justify-center px-0',
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        ))}
        {project && !collapsed && (
          <section
            aria-label="Current project shortcuts"
            className="space-y-1 border-t border-border px-2 pt-3"
          >
            <p className="truncate text-caption font-semibold">{project.name}</p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                to={`/projects/${project.id}/tasks`}
                className="text-action-link hover:underline"
              >
                Tasks
              </Link>
              <Link
                to={`/projects/${project.id}/board`}
                className="text-action-link hover:underline"
              >
                Board
              </Link>
            </div>
          </section>
        )}
      </nav>
      {user && (
        <div
          className={cn(
            'flex shrink-0 items-center gap-2 border-t border-border p-3',
            collapsed && 'justify-center p-2',
          )}
        >
          <Avatar name={user.displayName} />
          {!collapsed && (
            <span className="min-w-0 truncate text-sm font-semibold" title={user.displayName}>
              {user.displayName}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-8 shrink-0 place-items-center rounded-full bg-action text-xs font-semibold text-action-foreground"
    >
      {name[0]?.toUpperCase() ?? 'U'}
    </span>
  );
}

function AccountMenu() {
  const user = useAuthStore((state) => state.user);
  const { logout, isLoggingOut } = useLogout();
  const item =
    'flex cursor-default items-center gap-2 rounded px-2 py-2 text-sm outline-offset-[-2px] data-[highlighted]:bg-muted';
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="User menu"
        className="grid size-10 shrink-0 place-items-center rounded-md hover:bg-muted"
      >
        <Avatar name={user?.displayName ?? 'User'} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-[60] w-52 max-w-[calc(100vw-2rem)] rounded-[var(--radius-md)] border border-border bg-card p-1 text-foreground shadow-[var(--shadow-popover)]"
        >
          <DropdownMenu.Label className="truncate px-2 py-1.5 text-sm font-semibold">
            {user?.displayName ?? 'User'}
          </DropdownMenu.Label>
          <DropdownMenu.Item asChild className={item}>
            <Link to="/settings/profile">
              <User className="size-4" aria-hidden="true" />
              Profile
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            disabled={isLoggingOut}
            onSelect={(event) => {
              event.preventDefault();
              void logout();
            }}
            className={cn(item, 'text-[var(--color-error-text)]')}
          >
            <LogOut className="size-4" aria-hidden="true" />
            {isLoggingOut ? 'Signing out…' : 'Sign out'}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function Breadcrumbs({ context }: { context: ShellContext }) {
  const { workspace, project, title } = context;
  const { pathname } = useLocation();
  const crumbs = [
    ...(workspace && pathname !== '/workspaces'
      ? [{ label: workspace.name, path: `/workspaces?workspace=${workspace.id}` }]
      : []),
    ...(project && pathname !== `/projects/${project.id}`
      ? [{ label: project.name, path: `/projects/${project.id}` }]
      : []),
  ];
  return (
    <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        {crumbs.map(({ label, path }) => (
          <li key={path} className="hidden min-w-0 max-w-44 items-center gap-1.5 sm:flex">
            <Link
              to={path}
              className="min-w-0 truncate text-muted-foreground hover:underline"
              title={label}
            >
              {label}
            </Link>
            <ChevronRight className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
          </li>
        ))}
        <li className="min-w-0 truncate font-semibold" aria-current="page" title={title}>
          {title}
        </li>
      </ol>
    </nav>
  );
}

export function AppShellLayout({ children }: PropsWithChildren) {
  const context = useShellContext();
  const { key: routeKey } = useLocation();
  const sidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const [drawer, setDrawer] = useState({ routeKey, open: false });
  if (drawer.routeKey !== routeKey) setDrawer({ routeKey, open: false });
  const drawerOpen = drawer.routeKey === routeKey && drawer.open;
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 64rem)');
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setDrawer((current) => ({ ...current, open: false }));
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-card focus:p-3"
      >
        Skip to content
      </a>
      <aside
        id="desktop-sidebar"
        aria-label="Sidebar"
        className={cn(
          'hidden shrink-0 border-r border-border bg-card lg:block',
          sidebarOpen ? 'w-60' : 'w-16',
        )}
      >
        <ShellNavigation context={context} collapsed={!sidebarOpen} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card px-page-gutter sm:gap-3">
          <Dialog.Root open={drawerOpen} onOpenChange={(open) => setDrawer({ routeKey, open })}>
            <Dialog.Trigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu aria-hidden="true" />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
              <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-72 max-w-[calc(100vw-1rem)] bg-card shadow-[var(--shadow-dialog)] lg:hidden">
                <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Switch workspaces or open an application section.
                </Dialog.Description>
                <Dialog.Close asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-2 top-3 z-10"
                    aria-label="Close navigation menu"
                  >
                    <X aria-hidden="true" />
                  </Button>
                </Dialog.Close>
                <ShellNavigation context={context} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="hidden lg:inline-flex"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={sidebarOpen}
            aria-controls="desktop-sidebar"
          >
            {sidebarOpen ? (
              <PanelLeftClose aria-hidden="true" />
            ) : (
              <PanelLeftOpen aria-hidden="true" />
            )}
          </Button>
          <Breadcrumbs context={context} />
          <NotificationBell />
          <AccountMenu />
        </header>
        <main
          id="main-content"
          ref={main}
          tabIndex={-1}
          className="min-w-0 flex-1 overflow-y-auto focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
