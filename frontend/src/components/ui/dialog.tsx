import type { ReactNode } from 'react';
import { Dialog as Primitive } from 'radix-ui';
import { X } from 'lucide-react';
import { Button } from './button';

export function Dialog({
  trigger,
  title,
  description,
  open,
  onOpenChange,
  busy = false,
  children,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy?: boolean;
  children: ReactNode;
}) {
  return (
    <Primitive.Root
      open={open}
      onOpenChange={(next) => {
        if (next || !busy) onOpenChange(next);
      }}
    >
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Primitive.Content className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[calc(100dvh-2rem)] w-auto max-w-lg -translate-y-1/2 overflow-y-auto overflow-x-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5 text-card-foreground shadow-[var(--shadow-dialog)]">
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
