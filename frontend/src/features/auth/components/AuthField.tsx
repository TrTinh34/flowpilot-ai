import type { ComponentProps } from 'react';
import { FieldLabel } from '@/components/ui/field-label';
import { Input } from '@/components/ui/input';

export type AuthFieldProps = ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: string;
};

export function AuthField({ id, label, error, ...input }: AuthFieldProps) {
  return (
    <FieldLabel htmlFor={id} label={label}>
      <Input
        {...input}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? id + '-error' : undefined}
      />
      {error && (
        <p id={id + '-error'} className="text-sm text-[var(--color-error-text)]" role="alert">
          {error}
        </p>
      )}
    </FieldLabel>
  );
}
