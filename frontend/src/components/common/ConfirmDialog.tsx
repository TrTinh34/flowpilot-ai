import { useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FormErrorBanner } from './FormErrorBanner';
import { extractApiErrorMessage } from '@/services/api-client';

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  danger = false,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const busy = useRef(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  function changeOpen(next: boolean) {
    if (!next) setError('');
    if (isControlled) {
      controlledOnOpenChange?.(next);
    } else {
      setInternalOpen(next);
    }
  }

  async function confirm() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError('');
    try {
      await onConfirm();
      changeOpen(false);
    } catch (cause) {
      setError(extractApiErrorMessage(cause));
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <Dialog
      title={title}
      description={description}
      open={open}
      onOpenChange={changeOpen}
      busy={pending}
      maxWidthClass="max-w-md"
      trigger={trigger}
    >
      <div className="mt-4 space-y-4">
        <FormErrorBanner message={error} />
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => changeOpen(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={danger ? 'destructive' : 'default'}
            disabled={pending}
            onClick={() => void confirm()}
          >
            {pending ? 'Saving…' : confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
