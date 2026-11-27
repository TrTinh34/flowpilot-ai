import type { ReactNode } from 'react';
import { Dialog as Primitive } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn.util';
import { Button } from './button';

export function Dialog({
  trigger,
  title,
  description,
  open,
  onOpenChange,
  busy = false,
  maxWidthClass = 'max-w-lg',
  children,
}: {
  trigger?: ReactNode;
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy?: boolean;
  maxWidthClass?: string;
  children: ReactNode;
}) {
  return (
    <Primitive.Root
      open={open}
      onOpenChange={(next) => {
        if (next || !busy) onOpenChange(next);
      }}
    >
      {trigger && <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>}
      <Primitive.Portal>
        <Primitive.Overlay className="fixed inset-0 z-[var(--z-drawer)] bg-black/50" />
        <Primitive.Content
          className={cn(
            'fixed inset-x-4 top-1/2 z-[var(--z-modal)] mx-auto max-h-[calc(100dvh-2rem)] w-auto -translate-y-1/2 overflow-y-auto overflow-x-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5 text-card-foreground shadow-[var(--shadow-dialog)]',
            maxWidthClass,
          )}
        >
          <div className="min-w-0 space-y-1 pr-8">
            <Primitive.Title className="text-section-title">{title}</Primitive.Title>
            <Primitive.Description className="text-secondary">{description}</Primitive.Description>
          </div>
          {children}
          <Primitive.Close asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Close dialog"
              disabled={busy}
              className="absolute right-4 top-4"
            >
              <X aria-hidden="true" />
            </Button>
          </Primitive.Close>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
