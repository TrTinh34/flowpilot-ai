import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Bell,
  FolderKanban,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { WorkspaceSwitcher } from '@/features/workspace/components/WorkspaceSwitcher';
import { NotificationBell } from '@/features/notification/components/NotificationBell';
import { useAuthStore } from '@/app/store/auth.store';
import { useUiStore } from '@/app/store/ui.store';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useWorkspaceStore } from '@/app/store/workspace.store';
import { cn } from '@/utils/cn.util';

// ─── Nav items ───────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
}

function useNavItems(): NavItem[] {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  return [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', to: '/my-tasks', icon: CheckSquare },
    { label: 'Notifications', to: '/notifications', icon: Bell },
    {
      label: 'Projects',
      to: activeWorkspaceId ? `/workspaces/${activeWorkspaceId}/projects` : '/workspaces',
      icon: FolderKanban,
    },
    { label: 'AI Planner', to: '/ai/planner', icon: Sparkles },
    { label: 'Settings', to: '/settings/profile', icon: Settings },
  ];
}

// ─── Sidebar content ─────────────────────────────────────────────────────────

function SidebarContent({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const { logout, isLoggingOut } = useLogout();
  const navItems = useNavItems();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-[var(--sidebar-border)] px-3 shrink-0">
        <Logo
          className="text-[var(--color-primary)]"
          showName={!collapsed}
        />
      </div>

      {/* Workspace switcher */}
      {!collapsed && (
        <div className="border-b border-[var(--sidebar-border)] px-2 py-2 shrink-0">
          <WorkspaceSwitcher />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Main navigation">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors',
                    'hover:bg-[var(--surface-secondary)]',
                    isActive
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-[var(--foreground-secondary)]',
                    collapsed && 'justify-center px-2',
                  )
                }
                aria-current={undefined}
              >
                <item.icon
                  className={cn('shrink-0', collapsed ? 'size-5' : 'size-4')}
                  aria-hidden="true"
                />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User account */}
      <div
        ref={userMenuRef}
        className="relative border-t border-[var(--sidebar-border)] px-2 py-2 shrink-0"
      >
        <button
          type="button"
          onClick={() => setUserMenuOpen((v) => !v)}
          aria-label="User menu"
          aria-expanded={userMenuOpen}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
            'hover:bg-[var(--surface-secondary)]',
            collapsed && 'justify-center px-1',
          )}
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold">
            {user?.displayName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-[13px] font-medium text-[var(--foreground)]">
                  {user?.displayName ?? 'User'}
                </p>
                <p className="truncate text-[11px] text-[var(--foreground-muted)]">
                  {user?.email ?? ''}
                </p>
              </div>
              <ChevronRight className="size-3.5 shrink-0 text-[var(--foreground-muted)]" />
            </>
          )}
        </button>

        {userMenuOpen && (
          <div className="absolute bottom-full left-2 right-2 mb-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg z-50">
            <Link
              to="/settings/profile"
              onClick={() => { setUserMenuOpen(false); onNavigate?.(); }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <User className="size-4" aria-hidden="true" />
              Profile
            </Link>
            <div className="my-1 border-t border-[var(--border)]" />
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={() => void logout()}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-50"
            >
              <LogOut className="size-4" aria-hidden="true" />
              {isLoggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Shell Layout ─────────────────────────────────────────────────────────

/**
 * Authenticated application shell with Sidebar + Header + content.
 *
 * Desktop (≥ lg): persistent sidebar (240px collapsed to 56px).
 * Mobile (< lg): sidebar hidden, hamburger → full-screen overlay drawer.
 */
export function AppShellLayout({ children }: PropsWithChildren) {
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--background)]">
      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0',
          'bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]',
          'transition-all duration-200',
          isSidebarOpen ? 'w-[220px]' : 'w-[52px]',
        )}
        aria-label="Sidebar"
      >
        <SidebarContent collapsed={!isSidebarOpen} />
      </aside>

      {/* ── Mobile Drawer overlay ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="absolute left-0 top-0 h-full w-72 bg-[var(--sidebar-bg)] shadow-xl z-50">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main area ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header
          className={cn(
            'flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border)]',
            'bg-[var(--surface)] px-4',
          )}
        >
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden rounded-md p-1.5 text-[var(--foreground-secondary)] hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="hidden lg:flex rounded-md p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground-secondary)] transition-colors"
          >
            {isSidebarOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Header right */}
          <NotificationBell />
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
