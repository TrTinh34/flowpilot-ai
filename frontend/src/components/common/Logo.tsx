import { cn } from '@/utils/cn.util';

interface LogoProps {
  className?: string;
  /** Show the product name beside the icon */
  showName?: boolean;
}

/**
 * FlowPilot AI brand logo.
 * Geometric SVG — 3 stacked chevron-style lines representing flow/forward movement.
 * Uses currentColor so it adapts to any parent text color.
 */
export function Logo({ className, showName = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Three forward-moving chevron stripes */}
        <rect x="2" y="4" width="14" height="4" rx="2" fill="currentColor" opacity="0.9" />
        <rect x="6" y="12" width="16" height="4" rx="2" fill="currentColor" />
        <rect x="10" y="20" width="16" height="4" rx="2" fill="currentColor" opacity="0.75" />
        {/* Connection node — represents collaboration */}
        <circle cx="22" cy="6" r="3" fill="currentColor" opacity="0.6" />
      </svg>
      {showName && (
        <span className="text-[15px] font-semibold tracking-tight">
          FlowPilot AI
        </span>
      )}
    </div>
  );
}
