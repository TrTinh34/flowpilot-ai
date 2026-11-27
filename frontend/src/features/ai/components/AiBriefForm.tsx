import { useId, type FormEvent } from 'react';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { FormErrorBanner } from '@/components/common/FormErrorBanner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field-label';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/cn.util';

const PROMPT_EXAMPLES = [
  {
    label: 'SaaS MVP Launch',
    name: 'FlowPilot MVP Launch',
    description:
      'Build authentication, workspace RBAC, project Kanban board, and CI/CD pipeline for a 4-person team over 6 weeks.',
  },
  {
    label: 'API Migration',
    name: 'Payments v2 Migration',
    description:
      'Migrate billing webhooks, add idempotency checks, write integration tests, and stage rollout.',
  },
];

export function AiBriefForm({
  projectName,
  description,
  busy,
  canReset,
  validationError,
  onProjectNameChange,
  onDescriptionChange,
  onGenerate,
  onReset,
}: {
  projectName: string;
  description: string;
  busy: boolean;
  canReset: boolean;
  validationError?: string;
  onProjectNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onGenerate: () => void;
  onReset: () => void;
}) {
  const nameId = useId();
  const descId = useId();
  const descChars = description.length;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!busy) onGenerate();
  }

  return (
    <form onSubmit={submit} noValidate aria-busy={busy} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[var(--ai-text)]" aria-hidden="true" />
          <h2 className="text-section-title text-foreground">Project brief</h2>
        </div>
        <Badge tone="ai">Demo</Badge>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Example briefs</p>
        <div className="flex flex-wrap gap-1.5">
          {PROMPT_EXAMPLES.map((example) => (
            <Button
              key={example.label}
              type="button"
              variant="outline"
              size="xs"
              disabled={busy}
              onClick={() => {
                onProjectNameChange(example.name);
                onDescriptionChange(example.description);
              }}
            >
              {example.label}
            </Button>
          ))}
        </div>
      </div>

      <FieldLabel label="Project name *" htmlFor={nameId}>
        <Input
          id={nameId}
          name="projectName"
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="e.g. E-commerce Platform"
          disabled={busy}
        />
      </FieldLabel>

      <div className="grid gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor={descId}>Project description *</Label>
          <span
            className={cn(
              'text-xs tabular-nums',
              descChars > 7500 ? 'text-[var(--color-error-text)]' : 'text-muted-foreground',
            )}
          >
            {descChars}/8000
          </span>
        </div>
        <Textarea
          id={descId}
          name="description"
          rows={6}
          maxLength={8000}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe your project goals, tech stack, team size, and milestones…"
          disabled={busy}
        />
      </div>

      <FormErrorBanner message={validationError} />

      <div className="flex flex-col gap-2">
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="motion-safe:animate-spin" aria-hidden="true" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles aria-hidden="true" />
              Generate Plan
            </>
          )}
        </Button>

        {canReset && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={busy}
            onClick={onReset}
          >
            <RefreshCw aria-hidden="true" />
            Start over
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Demo preview only — confirming does not create real workspace tasks.
      </p>
    </form>
  );
}
