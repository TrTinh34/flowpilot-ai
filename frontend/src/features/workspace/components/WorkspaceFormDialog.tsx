import { useId, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FieldLabel } from '@/components/ui/field-label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';
import { extractApiErrorMessage } from '@/services/api-client';

type Props =
  | { kind: 'create'; onSubmit: (name: string) => Promise<void>; initiallyOpen?: boolean }
  | {
      kind: 'invite';
      canInviteAdmin: boolean;
      onSubmit: (email: string, role: 'ADMIN' | 'MEMBER') => Promise<void>;
    };

export function WorkspaceFormDialog(props: Props) {
  const create = props.kind === 'create';
  const label = create ? 'Create workspace' : 'Invite member';
  const fieldId = useId();
  const roleId = useId();
  const [open, setOpen] = useState(create && Boolean(props.initiallyOpen));
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
    const value = String(values.get('value') ?? '').trim();
    if (!value) {
      setError(create ? 'Enter a workspace name.' : 'Enter an email address.');
      return;
    }
    submitting.current = true;
    setPending(true);
    setError('');
    try {
      if (create) await props.onSubmit(value);
      else
        await props.onSubmit(
          value,
          props.canInviteAdmin && values.get('role') === 'ADMIN' ? 'ADMIN' : 'MEMBER',
        );
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
      title={label}
      description={
        create
          ? 'Choose a name for your team workspace.'
          : 'Send a workspace invitation to an email address.'
      }
      open={open}
      onOpenChange={changeOpen}
      busy={pending}
      trigger={
        <Button type="button" variant={create ? 'outline' : 'default'}>
          {label}
        </Button>
      }
    >
      <form className="mt-4 space-y-4" aria-busy={pending} onSubmit={(event) => void submit(event)}>
        <FieldLabel label={create ? 'Workspace name' : 'Invite email'} htmlFor={fieldId}>
          <Input
            id={fieldId}
            name="value"
            type={create ? 'text' : 'email'}
            required
            readOnly={pending}
          />
        </FieldLabel>
        {!create && (
          <FieldLabel label="Role" htmlFor={roleId}>
            <Select id={roleId} name="role" defaultValue="MEMBER" disabled={pending}>
              <option value="MEMBER">Member</option>
              {props.canInviteAdmin && <option value="ADMIN">Admin</option>}
            </Select>
          </FieldLabel>
        )}
        <FormErrorBanner message={error} />
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : create ? label : 'Send invitation'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
