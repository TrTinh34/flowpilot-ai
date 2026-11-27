import { cva } from 'class-variance-authority';

export const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-[var(--radius-md)] p-1 text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none data-[variant=line]:p-0',
  {
    variants: {
      variant: {
        default: 'border border-border bg-muted',
        line: 'w-full justify-start gap-4 border-b border-border bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
