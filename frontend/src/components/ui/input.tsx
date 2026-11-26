import * as React from 'react';
import { cn } from '@/utils/cn.util';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Size: 44px height for comfortable touch targets
        'h-11 w-full min-w-0 rounded-lg border bg-white px-3.5 py-2.5 text-sm shadow-none transition-[color,box-shadow] outline-none',
        // Border: slate-200 — subtle in light mode, not too dark
        'border-slate-200 placeholder:text-slate-400 text-[var(--foreground)]',
        // Focus: indigo ring
        'focus-visible:border-[var(--color-primary)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-primary)]/20',
        // Error state
        'aria-invalid:border-red-400 aria-invalid:ring-[3px] aria-invalid:ring-red-400/20',
        // Disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60',
        // File input
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--foreground)]',
        // Dark mode
        'dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder:text-zinc-500 dark:text-zinc-100',
        'dark:focus-visible:border-[var(--ring)] dark:focus-visible:ring-[var(--ring)]/20',
        'dark:aria-invalid:border-red-500 dark:aria-invalid:ring-red-500/20',
        'dark:disabled:bg-zinc-800',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
