import { Building2, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';
import { Avatar } from '@/components/common/Avatar';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto w-full max-w-[760px] space-y-6 px-page-gutter py-6">
      <PageHeader
        title="Profile"
        description="Your signed-in account details and settings links."
      />

      <section
        aria-label="Account details"
        className="space-y-5 rounded-[var(--radius-md)] border border-border bg-card p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={user?.displayName} size="lg" tone="brand" />
            <div className="min-w-0 space-y-0.5">
              <h2 className="text-section-title text-foreground">Signed-in account</h2>
              <p className="text-xs text-muted-foreground">FlowPilot AI member profile</p>
            </div>
          </div>
          <Badge tone="neutral">Read-only</Badge>
        </div>

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="min-w-0 space-y-1">
            <dt className="text-xs font-medium text-muted-foreground">Display name</dt>
            <dd className="break-words font-medium text-foreground">{user?.displayName ?? '—'}</dd>
          </div>
          <div className="min-w-0 space-y-1">
            <dt className="text-xs font-medium text-muted-foreground">Email address</dt>
            <dd className="font-medium text-foreground [overflow-wrap:anywhere]">
              {user?.email ?? '—'}
            </dd>
          </div>
        </dl>
      </section>

      <section
        aria-label="Workspace navigation"
        className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-0.5">
          <h2 className="text-card-title font-semibold text-foreground">Workspace settings</h2>
          <p className="text-secondary">
            Manage workspaces, team memberships, and pending invitations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/my-tasks">
              <CheckSquare aria-hidden="true" />
              My Tasks
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/workspaces">
              <Building2 aria-hidden="true" />
              Workspace settings
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
