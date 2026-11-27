import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, DropdownMenu } from 'radix-ui';
import {
  Bell,
  Building2,
  CheckSquare,
  ChevronRight,
  Columns3,
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
import { Avatar } from '@/components/common/Avatar';
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
  const projectShortcuts = project
    ? [
        { label: 'Tasks', to: `/projects/${project.id}/tasks`, icon: CheckSquare },
        { label: 'Board', to: `/projects/${project.id}/board`, icon: Columns3 },
        { label: 'Project settings', to: `/projects/${project.id}`, icon: Settings },
      ]
    : [];
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        to="/dashboard"
        aria-label="FlowPilot AI home"
        className="flex h-[var(--topbar-height)] shrink-0 items-center justify-center px-3"
      >
        <Logo className={cn('text-action-link', !collapsed && 'mr-auto')} showName={!collapsed} />
      </Link>
      <div className="shrink-0 border-y border-border p-2">
        <WorkspaceSwitcher workspaces={workspaces} active={workspace} collapsed={collapsed} />
      </div>
      <nav aria-label="Main navigation" className="flex-1 space-y-4 overflow-y-auto px-2 py-3">
        {groups.map(({ name, items }) => (
          <ul key={name} aria-label={name} className="space-y-0.5">
            {!collapsed && (
              <li
                aria-hidden="true"
                className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
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
                      'relative flex h-9 items-center gap-2.5 rounded-[var(--radius)] px-2.5 text-sm font-medium text-muted-foreground transition-colors duration-[var(--duration-ui)] hover:bg-muted hover:text-foreground',
                      (current || contextActive) &&
                        'bg-muted text-action-link before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-action',
                      collapsed && 'justify-center px-0',
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        ))}
        {project && !collapsed && (
          <section
            aria-label="Current project shortcuts"
            className="space-y-1 border-t border-border pt-3"
          >
            <p className="truncate px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {project.name}
            </p>
            <ul className="space-y-0.5">
              {projectShortcuts.map(({ label, to, icon: Icon }) => {
                const active = pathname === to;
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex h-8 items-center gap-2 rounded-[var(--radius)] px-2.5 text-sm text-muted-foreground transition-colors duration-[var(--duration-ui)] hover:bg-muted hover:text-foreground',
                        active && 'bg-muted font-medium text-action-link',
                      )}
                    >
                      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </nav>
      {user && (
        <div
          className={cn(
            'flex shrink-0 items-center gap-2.5 border-t border-border p-3',
            collapsed && 'justify-center p-2',
          )}
        >
          <Avatar name={user.displayName} size="sm" tone="brand" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground" title={user.displayName}>
                {user.displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground" title={user.email}>
                {user.email}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  const user = useAuthStore((state) => state.user);
  const { logout, isLoggingOut } = useLogout();
  const item =
    'flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm outline-offset-[-2px] data-[highlighted]:bg-muted';
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="User menu"
        className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-[var(--radius)] transition-colors hover:bg-muted"
      >
        <Avatar name={user?.displayName ?? 'User'} size="sm" tone="brand" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-[var(--z-popover)] w-52 max-w-[calc(100vw-2rem)] rounded-[var(--radius-md)] border border-border bg-card p-1 text-foreground shadow-[var(--shadow-popover)]"
        >
          <DropdownMenu.Label className="truncate px-2.5 py-1.5 text-sm font-semibold">
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
              className="min-w-0 truncate text-muted-foreground transition-colors hover:text-foreground hover:underline"
              title={label}
            >
              {label}
            </Link>
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          </li>
        ))}
        <li
          className="min-w-0 truncate font-semibold text-foreground"
          aria-current="page"
          title={title}
        >
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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[var(--z-skip-link)] focus:rounded-[var(--radius)] focus:border focus:border-border focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:shadow-[var(--shadow-popover)]"
      >
        Skip to content
      </a>
      <aside
        id="desktop-sidebar"
        aria-label="Sidebar"
        className={cn(
          'hidden shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-[var(--duration-ui)] ease-ui lg:block',
          sidebarOpen ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-rail-width)]',
        )}
      >
        <ShellNavigation context={context} collapsed={!sidebarOpen} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-[var(--topbar-height)] shrink-0 items-center gap-2 border-b border-border bg-card px-page-gutter sm:gap-3">
          <Dialog.Root open={drawerOpen} onOpenChange={(open) => setDrawer({ routeKey, open })}>
            <Dialog.Trigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu aria-hidden="true" />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[var(--z-drawer)] bg-black/50 lg:hidden" />
              <Dialog.Content className="fixed inset-y-0 left-0 z-[var(--z-modal)] w-72 max-w-[calc(100vw-1rem)] border-r border-border bg-sidebar shadow-[var(--shadow-dialog)] lg:hidden">
                <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Switch workspaces or open an application section.
                </Dialog.Description>
                <Dialog.Close asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-2 top-3 z-[var(--z-sticky)]"
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
