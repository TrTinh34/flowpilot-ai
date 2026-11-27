import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ForbiddenPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 px-page-gutter text-center">
      <span className="grid size-12 place-items-center rounded-full border border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-error-text)]">
        <ShieldAlert className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">403</p>
        <h1 className="text-page-title text-foreground">Access denied</h1>
        <p className="max-w-md text-secondary">
          You don&apos;t have permission to view this resource in the selected workspace.
        </p>
      </div>
      <Button asChild>
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </main>
  );
}
