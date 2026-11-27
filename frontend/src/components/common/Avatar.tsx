import { cn } from '@/utils/cn.util';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
export type AvatarTone = 'brand' | 'subtle';

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'size-6 text-[11px]',
  sm: 'size-8 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-14 text-xl',
};

const toneClasses: Record<AvatarTone, string> = {
  brand: 'bg-action text-action-foreground',
  subtle: 'bg-muted text-action-link border border-border',
};

export function Avatar({
  name,
  size = 'sm',
  tone = 'subtle',
  className,
}: {
  name?: string | null;
  size?: AvatarSize;
  tone?: AvatarTone;
  className?: string;
}) {
  const initial = Array.from(name?.trim() || 'U')[0]?.toLocaleUpperCase() ?? 'U';
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center rounded-full font-semibold select-none',
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
    >
      {initial}
    </span>
  );
}
