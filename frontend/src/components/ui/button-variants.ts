import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius)] text-sm font-medium whitespace-nowrap transition-colors duration-[var(--duration-ui)] ease-ui select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-action text-action-foreground shadow-xs hover:bg-action-hover active:bg-action-active',
        destructive:
          'bg-danger-action text-danger-foreground shadow-xs hover:bg-danger-hover active:bg-danger-active',
        outline:
          'border border-border bg-card text-card-foreground shadow-xs hover:bg-muted hover:text-foreground',
        secondary: 'bg-muted text-foreground hover:bg-muted/80',
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
        link: 'text-action-link underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        comfortable: 'h-10 px-5 py-2.5 has-[>svg]:px-4',
        sm: 'h-8 gap-1.5 rounded-[var(--radius)] px-3 text-xs has-[>svg]:px-2.5',
        lg: 'h-11 rounded-[var(--radius-md)] px-6 has-[>svg]:px-4 text-[15px]',
        xs: 'h-7 gap-1 rounded-[var(--radius-sm)] px-2 text-xs has-[>svg]:px-1.5',
        icon: 'size-9 rounded-[var(--radius)]',
        'icon-sm': 'size-8 rounded-[var(--radius)]',
        'icon-xs': "size-7 rounded-[var(--radius-sm)] [&_svg:not([class*='size-'])]:size-3.5",
        'icon-lg': 'size-10 rounded-[var(--radius-md)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
