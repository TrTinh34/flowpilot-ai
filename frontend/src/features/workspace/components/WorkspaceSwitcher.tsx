import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronsUpDown, Plus, Building2, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { listWorkspaces } from '@/features/workspace/api/workspace.api';
import { useWorkspaceStore } from '@/app/store/workspace.store';
import { useAuthStore } from '@/app/store/auth.store';
import { cn } from '@/utils/cn.util';

export function WorkspaceSwitcher() {
  const revision = useAuthStore((s) => s.sessionRevision);
  const activeId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveId = useWorkspaceStore((s) => s.setActiveWorkspaceId);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['workspaces', revision, 0],
    queryFn: () => listWorkspaces(0),
  });

  const workspaces = useMemo(() => data?.data ?? [], [data?.data]);
  const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0];

  // Auto-select first workspace on load
  useEffect(() => {
    if (!activeId && workspaces.length > 0 && workspaces[0]) {
      setActiveId(workspaces[0].id);
    }
  }, [workspaces, activeId, setActiveId]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Switch workspace"
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium',
          'text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors',
        )}
      >
        <div className="flex size-6 shrink-0 items-center justify-center rounded bg-[var(--color-primary)] text-white text-[11px] font-bold uppercase">
          {active?.name?.[0] ?? '?'}
        </div>
        <span className="min-w-0 flex-1 truncate text-left">
          {active?.name ?? 'Select workspace'}
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-[var(--foreground-muted)]" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Workspaces"
          className={cn(
            'absolute left-0 z-50 mt-1 w-56 rounded-lg border border-[var(--border)]',
            'bg-[var(--surface)] shadow-lg py-1',
          )}
        >
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              role="option"
              aria-selected={ws.id === active?.id}
              type="button"
              onClick={() => {
                setActiveId(ws.id);
                setOpen(false);
                navigate(`/workspaces/${ws.id}/projects`);
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
                'hover:bg-[var(--surface-secondary)]',
                ws.id === active?.id && 'text-[var(--color-primary)]',
              )}
            >
              <div className="flex size-5 shrink-0 items-center justify-center rounded bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase">
                {ws.name[0]}
              </div>
              <span className="flex-1 truncate text-left">{ws.name}</span>
              {ws.id === active?.id && (
                <Check className="size-3.5 shrink-0" aria-hidden="true" />
              )}
            </button>
          ))}

          <div className="my-1 border-t border-[var(--border)]" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate('/workspaces');
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--foreground-secondary)] hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <Building2 className="size-4" aria-hidden="true" />
            Manage workspaces
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate('/workspaces?create=1');
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--foreground-secondary)] hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <Plus className="size-4" aria-hidden="true" />
            New workspace
          </button>
        </div>
      )}
    </div>
  );
}
