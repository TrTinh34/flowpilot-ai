import { useId, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FieldLabel } from '@/components/ui/field-label';
import { Input } from '@/components/ui/input';
import type { WorkspaceMember } from '@/features/workspace/api/workspace.api';
import { extractApiErrorMessage } from '@/services/api-client';

export function CreateProjectDialog({
  members,
  onCreate,
}: {
  members: WorkspaceMember[];
  onCreate: (input: { name: string; managerId: string }) => Promise<void>;
}) {
  const nameId = useId();
  const managerId = useId();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);

  function changeOpen(next: boolean) {
    setOpen(next);
    if (!next) setError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const values = new FormData(event.currentTarget);
    submitting.current = true;
    setPending(true);
    setError('');
    try {
      await onCreate({
        name: String(values.get('name') ?? ''),
        managerId: String(values.get('managerId') ?? ''),
      });
      changeOpen(false);
    } catch (cause) {
      setError(extractApiErrorMessage(cause));
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={changeOpen}
      busy={pending}
      trigger={<Button type="button">Create project</Button>}
      title="Create project"
      description="Give the project a name and choose its manager."
    >
      <form className="mt-4 space-y-4" onSubmit={(event) => void submit(event)} aria-busy={pending}>
        <FieldLabel label="Project name" htmlFor={nameId}>
          <Input id={nameId} name="name" required readOnly={pending} />
        </FieldLabel>
        <FieldLabel label="Project manager" htmlFor={managerId}>
          <select
            id={managerId}
            name="managerId"
            required
            disabled={pending}
            defaultValue=""
            className="h-11 w-full min-w-0 rounded-[var(--radius)] border border-input bg-card px-3 text-sm text-foreground"
          >
            <option value="" disabled>
              Select a member
            </option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.user.displayName}
              </option>
            ))}
          </select>
        </FieldLabel>
        {error && (
          <p role="alert" className="break-words text-sm text-[var(--color-error-text)]">
            {error}
          </p>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? 'Creating…' : 'Create project'}
        </Button>
      </form>
    </Dialog>
  );
}
