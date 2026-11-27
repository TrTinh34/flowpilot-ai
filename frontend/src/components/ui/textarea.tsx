import * as React from 'react';
import { cn } from '@/utils/cn.util';

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'min-h-24 w-full min-w-0 rounded-[var(--radius)] border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
        'transition-colors duration-[var(--duration-ui)] ease-ui focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'aria-invalid:border-danger-action disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
}
