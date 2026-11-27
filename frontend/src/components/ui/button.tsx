import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn.util';
import { Slot } from 'radix-ui';

const buttonVariants = cva(
  // Base styles — single string
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors duration-[var(--duration-ui)] ease-ui select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary — indigo bg, white text (always, light + dark)
        default:
          'bg-action text-action-foreground shadow-sm hover:bg-action-hover active:bg-action-active',
        destructive:
          'bg-danger-action text-danger-foreground hover:bg-danger-hover active:bg-danger-active',
        outline: 'border border-input bg-card text-card-foreground shadow-xs hover:bg-muted',
        secondary: 'bg-muted text-foreground hover:bg-card',
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
        link: 'text-action-link underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        // default: 44px height for comfortable touch targets
        default: 'h-11 px-5 py-2.5 has-[>svg]:px-4',
        sm: 'h-9 gap-1.5 rounded-md px-3.5 has-[>svg]:px-3',
        lg: 'h-12 rounded-lg px-7 has-[>svg]:px-5 text-[15px]',
        xs: 'h-7 gap-1 rounded-md px-2.5 text-xs has-[>svg]:px-2',
        icon: 'size-11 rounded-lg',
        'icon-sm': 'size-9 rounded-md',
        'icon-xs': "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        'icon-lg': 'size-12 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
