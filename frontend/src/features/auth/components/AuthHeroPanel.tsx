import { CheckCircle2, Circle, CircleDot, Columns3 } from 'lucide-react';

const preview = [
  { title: 'Write the sprint plan', status: 'Done', icon: CheckCircle2 },
  { title: 'Review onboarding flow', status: 'In progress', icon: CircleDot },
  { title: 'Publish release notes', status: 'To do', icon: Circle },
];

export function AuthHeroPanel() {
  return (
    <aside
      aria-hidden="true"
      className="hidden min-w-0 items-center justify-center border-l border-border bg-action-active px-12 py-12 text-action-foreground lg:flex xl:px-16"
    >
      <div className="w-full max-w-[440px] space-y-8">
        <div className="space-y-3">
          <p className="text-3xl font-semibold leading-tight tracking-tight">
            Plan the sprint.
            <br />
            Keep work moving.
          </p>
          <p className="max-w-sm text-base leading-relaxed">
            See tasks, decisions, and progress together in your team workspace.
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 text-card-foreground shadow-[var(--shadow-dialog)]">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Columns3 className="size-4 text-action-link" aria-hidden="true" />
            Example sprint board
          </div>
          <ul className="divide-y divide-border rounded-[var(--radius-md)] border border-border">
            {preview.map(({ title, status, icon: Icon }) => (
              <li key={title} className="flex items-center gap-2.5 px-3 py-3 text-sm">
                <Icon className="size-4 shrink-0 text-action-link" aria-hidden="true" />
                <span className="min-w-0 flex-1">{title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
