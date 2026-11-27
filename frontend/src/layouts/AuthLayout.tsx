import type { PropsWithChildren } from 'react';
import { Logo } from '@/components/common/Logo';
import { AuthHeroPanel } from '@/features/auth/components/AuthHeroPanel';

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="grid min-h-dvh w-full bg-card lg:grid-cols-2">
      <div className="flex min-w-0 flex-col px-page-gutter py-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col">
          <div className="mb-8">
            <Logo className="text-action-link" />
          </div>
          <div className="my-auto w-full pb-3">{children}</div>
        </div>
      </div>
      <AuthHeroPanel />
    </main>
  );
}
