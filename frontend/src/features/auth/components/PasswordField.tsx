import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FieldLabel } from '@/components/ui/field-label';
import { Input } from '@/components/ui/input';
import type { AuthFieldProps } from './AuthField';

export function PasswordField({
  id,
  label,
  error,
  descriptionId,
  ...input
}: Omit<AuthFieldProps, 'type'> & { descriptionId?: string }) {
  const [visible, setVisible] = useState(false);
  const describedBy = [error ? id + '-error' : undefined, descriptionId].filter(Boolean).join(' ');
  const Icon = visible ? EyeOff : Eye;
  return (
    <FieldLabel label={label} htmlFor={id}>
      <div className="relative">
        <Input
          {...input}
          id={id}
          type={visible ? 'text' : 'password'}
          className="pr-12"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
        />
        <button
          type="button"
          aria-controls={id}
          disabled={input.readOnly || input.disabled}
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-md text-muted-foreground hover:text-action-link focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring disabled:opacity-50"
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p id={id + '-error'} className="text-sm text-[var(--color-error-text)]" role="alert">
          {error}
        </p>
      )}
    </FieldLabel>
  );
}
