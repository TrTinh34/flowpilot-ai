import { useNavigate } from 'react-router-dom';
import { DropdownMenu } from 'radix-ui';
import { ChevronsUpDown, Plus, Building2, Check } from 'lucide-react';
import type { Workspace } from '@/features/workspace/api/workspace.api';
import { useWorkspaceStore } from '@/app/store/workspace.store';
import { cn } from '@/utils/cn.util';

const itemClass =
  'flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm outline-offset-[-2px] data-[highlighted]:bg-muted';

export function WorkspaceSwitcher({
  workspaces,
  active,
  collapsed = false,
}: {
  workspaces: Workspace[];
  active?: Workspace;
  collapsed?: boolean;
}) {
  const navigate = useNavigate();
  const setActiveId = useWorkspaceStore((state) => state.setActiveWorkspaceId);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(
          'flex h-9 w-full min-w-0 cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-2 text-left transition-colors hover:bg-muted',
          collapsed && 'justify-center px-0',
        )}
        aria-label={
          collapsed ? (active ? `${active.name}, switch workspace` : 'Switch workspace') : undefined
        }
        title={collapsed ? (active?.name ?? 'Switch workspace') : undefined}
      >
        <span
          aria-hidden="true"
          className="grid size-6 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-action text-xs font-semibold text-action-foreground"
        >
          {active?.name[0]?.toUpperCase() ?? <Building2 className="size-3.5" />}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {active?.name ?? 'Select workspace'}
            </span>
            <span className="sr-only">, switch workspace</span>
            <ChevronsUpDown
              className="size-3.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-[var(--z-popover)] w-56 max-w-[calc(100vw-2rem)] rounded-[var(--radius-md)] border border-border bg-card p-1 text-foreground shadow-[var(--shadow-popover)]"
        >
          <DropdownMenu.RadioGroup value={active?.id ?? ''}>
            {workspaces.map((workspace) => (
              <DropdownMenu.RadioItem
                key={workspace.id}
                value={workspace.id}
                className={itemClass}
                onSelect={() => {
                  setActiveId(workspace.id);
                  navigate(`/workspaces/${workspace.id}/projects`);
                }}
              >
                <span className="min-w-0 flex-1 truncate">{workspace.name}</span>
                <DropdownMenu.ItemIndicator>
                  <Check className="size-4 text-action-link" aria-hidden="true" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
          {workspaces.length > 0 && <DropdownMenu.Separator className="my-1 h-px bg-border" />}
          <DropdownMenu.Item className={itemClass} onSelect={() => navigate('/workspaces')}>
            <Building2 className="size-4" aria-hidden="true" /> Manage workspaces
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={itemClass}
            onSelect={() => navigate('/workspaces?create=1')}
          >
            <Plus className="size-4" aria-hidden="true" /> New workspace
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
