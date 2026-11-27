import * as React from 'react';
import { cn } from '@/utils/cn.util';

export interface SelectProps extends Omit<React.ComponentProps<'select'>, 'size'> {
  controlSize?: 'default' | 'sm';
}

const sizeClasses: Record<NonNullable<SelectProps['controlSize']>, string> = {
  sm: 'h-8 px-2.5 text-xs',
  default: 'h-9 px-3 text-sm',
};

export function Select({ className, controlSize = 'default', children, ...props }: SelectProps) {
  return (
    <select
      data-slot="select"
      className={cn(
        'w-full min-w-0 cursor-pointer rounded-[var(--radius)] border border-input bg-card text-foreground',
        'transition-colors duration-[var(--duration-ui)] ease-ui focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'aria-invalid:border-danger-action disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
        sizeClasses[controlSize],
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
