import * as React from 'react';
import { cn } from '@/utils/cn.util';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-11 w-full min-w-0 rounded-[var(--radius)] border border-input bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground',
        'transition-colors duration-[var(--duration-ui)] ease-ui focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'aria-invalid:border-danger-action disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
