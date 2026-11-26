import type { PropsWithChildren } from 'react';
import { Logo } from '@/components/common/Logo';
import { AuthHeroPanel } from '@/features/auth/components/AuthHeroPanel';

/**
 * Split-screen layout for authentication pages.
 *
 * Layout strategy:
 *   - Outer container: flex, min-h-screen, w-full (fills #root which is flex-col)
 *   - Form side:  flex: 1 1 50%  — grows to fill left half; never fixed px width
 *   - Hero side:  flex: 1 1 50%  — grows to fill right half; hidden < lg
 *
 * This avoids the fixed-width trap (lg:w-[480px]) that caused the layout
 * to occupy only ~480px instead of the full viewport width.
 *
 * The inner form content is constrained to max-w-[420px] and centered.
 *
 * Desktop (≥ lg): 50 / 50 split-screen
 * Tablet (768–1023px): single-column, full-width form
 * Mobile (< 768px): single-column, comfortable padding
 */
export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen w-full">
      {/* ── Form side ───────────────────────────────────────────────────── */}
      {/*
       * flex-1 on mobile so it fills the full width when hero is hidden.
       * lg:basis-1/2 lg:max-w-[50%] pins it to exactly half on desktop.
       * overflow-y-auto allows the form to scroll on small screens.
       */}
      <div className="flex flex-1 flex-col justify-center bg-[var(--background)] px-6 py-10 sm:px-10 lg:basis-1/2 lg:max-w-[50%] lg:px-12 overflow-y-auto">
        <div className="mx-auto w-full max-w-[420px]">
          {/* Logo */}
          <div className="mb-8">
            <Logo className="text-[var(--color-primary)]" />
          </div>

          {/* Page content (form) */}
          {children}
        </div>
      </div>

      {/* ── Hero side ───────────────────────────────────────────────────── */}
      {/*
       * Hidden below lg. On lg+ it takes exactly half the viewport width.
       * lg:basis-1/2 lg:max-w-[50%] mirrors the form side.
       * The inner AuthHeroPanel is position:absolute inset-0 so it fills.
       */}
      <div className="relative hidden lg:flex lg:flex-col lg:basis-1/2 lg:max-w-[50%]">
        <AuthHeroPanel />
      </div>
    </div>
  );
}
