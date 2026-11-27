import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PageHeader({
  title,
  description,
  actions,
  backLink,
  badge,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  backLink?: { to: string; label: string };
  badge?: ReactNode;
}) {
  return (
    <header className="space-y-2">
      {backLink && (
        <Link
          to={backLink.to}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-action-link"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          <span>{backLink.label}</span>
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-page-title break-words">{title}</h1>
            {badge}
          </div>
          {description && <p className="text-secondary">{description}</p>}
        </div>
        {actions && <div className="flex max-w-full flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
