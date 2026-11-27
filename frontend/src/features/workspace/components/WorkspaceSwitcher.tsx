import { useNavigate } from 'react-router-dom';
import { DropdownMenu } from 'radix-ui';
import { ChevronsUpDown, Plus, Building2, Check } from 'lucide-react';
import type { Workspace } from '@/features/workspace/api/workspace.api';
import { useWorkspaceStore } from '@/app/store/workspace.store';
import { cn } from '@/utils/cn.util';

const itemClass =
  'flex cursor-default items-center gap-2 rounded px-2 py-2 text-sm outline-offset-[-2px] data-[highlighted]:bg-muted';

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
          'flex h-11 w-full min-w-0 items-center gap-2 rounded-md border border-border bg-card px-2 text-left hover:bg-muted',
          collapsed && 'justify-center px-0',
        )}
        aria-label="Switch workspace"
        title={collapsed ? (active?.name ?? 'Switch workspace') : undefined}
      >
        <span
          aria-hidden="true"
          className="grid size-7 shrink-0 place-items-center rounded-md bg-action text-xs font-semibold text-action-foreground"
        >
          {active?.name[0]?.toUpperCase() ?? <Building2 className="size-4" />}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {active?.name ?? 'Select workspace'}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-[60] w-56 max-w-[calc(100vw-2rem)] rounded-[var(--radius-md)] border border-border bg-card p-1 text-foreground shadow-[var(--shadow-popover)]"
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
                  <Check className="size-4" aria-hidden="true" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
          {workspaces.length > 0 && (
            <DropdownMenu.Separator className="my-1 h-px bg-[var(--border)]" />
          )}
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
