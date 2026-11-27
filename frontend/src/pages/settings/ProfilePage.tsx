import { useAuthStore } from '@/app/store/auth.store';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Profile</h1>
      <p className="mt-1 text-sm text-[var(--foreground-secondary)]">Your account information.</p>

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-xl font-bold">
            {user?.displayName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="text-base font-semibold text-[var(--foreground)]">
              {user?.displayName ?? '—'}
            </p>
            <p className="text-sm text-[var(--foreground-secondary)]">{user?.email ?? '—'}</p>
          </div>
        </div>

        {/* Fields */}
        <dl className="space-y-4 text-sm">
          <div className="flex flex-col gap-1">
            <dt className="font-medium text-[var(--foreground-secondary)]">Display name</dt>
            <dd className="text-[var(--foreground)]">{user?.displayName ?? '—'}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="font-medium text-[var(--foreground-secondary)]">Email</dt>
            <dd className="text-[var(--foreground)]">{user?.email ?? '—'}</dd>
          </div>
        </dl>

        <p className="text-xs text-[var(--foreground-muted)]">
          Profile editing will be available in a future release.
        </p>
      </div>
    </div>
  );
}
