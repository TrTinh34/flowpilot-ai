import * as React from 'react';
import { cn } from '@/utils/cn.util';

export interface InputProps extends React.ComponentProps<'input'> {
  controlSize?: 'default' | 'comfortable' | 'sm';
}

const sizeClasses: Record<NonNullable<InputProps['controlSize']>, string> = {
  sm: 'h-8 px-3 py-1 text-xs',
  default: 'h-9 px-3 py-1.5 text-sm',
  comfortable: 'h-10 px-3.5 py-2 text-sm',
};

function Input({ className, type, controlSize = 'default', ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full min-w-0 rounded-[var(--radius)] border border-input bg-card text-foreground placeholder:text-muted-foreground',
        'transition-colors duration-[var(--duration-ui)] ease-ui focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'aria-invalid:border-danger-action disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        sizeClasses[controlSize],
        className,
      )}
      {...props}
    />
  );
}

export { Input };
