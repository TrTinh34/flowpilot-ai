import { CheckCircle2, Sparkles, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AiPlan, AiPlanTask } from '@/mocks/fixtures/ai.fixtures';

export interface DraftTaskItem {
  phaseIdx: number;
  task: AiPlanTask;
}

export function AiPlanDraftEditor({
  plan,
  projectName,
  tasks,
  confirming,
  onUpdateTitle,
  onRemoveTask,
  onConfirm,
}: {
  plan: AiPlan;
  projectName: string;
  tasks: DraftTaskItem[];
  confirming: boolean;
  onUpdateTitle: (taskId: string, title: string) => void;
  onRemoveTask: (taskId: string) => void;
  onConfirm: () => Promise<void>;
}) {
  const phasesWithTasks = plan.phases.map((phase, phaseIdx) => ({
    ...phase,
    remaining: tasks.filter((item) => item.phaseIdx === phaseIdx),
  }));

  return (
    <div className="space-y-5">
      <section className="rounded-[var(--radius-md)] border border-[var(--ai-border)] bg-[var(--ai-bg)] p-4">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--ai-text)]" aria-hidden="true" />
            <h2 className="text-card-title font-semibold text-foreground">{projectName}</h2>
          </div>
          <Badge tone="ai">
            {tasks.length} tasks · {plan.phases.length} phases
          </Badge>
        </div>
        <p className="text-sm text-foreground/90">{plan.summary}</p>
      </section>

      {phasesWithTasks.map((phase) => (
        <section
          key={phase.name}
          aria-label={phase.name}
          className="space-y-3 rounded-[var(--radius-md)] border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-card-title font-semibold text-foreground">{phase.name}</h3>
            <span className="text-xs tabular-nums text-muted-foreground">
              {phase.remaining.length} tasks
            </span>
          </div>
          {phase.remaining.length === 0 ? (
            <p className="text-xs text-muted-foreground">All tasks removed from this phase.</p>
          ) : (
            <ul className="space-y-2">
              {phase.remaining.map(({ task }) => (
                <li
                  key={task.id}
                  className="flex flex-col gap-2 rounded-[var(--radius)] border border-border bg-muted/40 p-2.5 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <Input
                      id={`ai-task-${task.id}`}
                      name={`task-${task.id}`}
                      aria-label={`Edit task "${task.title}"`}
                      controlSize="sm"
                      value={task.title}
                      disabled={confirming}
                      onChange={(event) => onUpdateTitle(task.id, event.target.value)}
                      className="min-w-0 flex-1 bg-card"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      ~{task.estimatedDays}d
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onRemoveTask(task.id)}
                      aria-label={`Remove "${task.title}"`}
                      disabled={confirming}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
        <ConfirmDialog
          title="Confirm demo plan"
          description={`Confirm ${tasks.length} draft tasks for "${projectName}"? In Demo mode, no real tasks are created in your workspace.`}
          confirmLabel={`Confirm Plan (${tasks.length} tasks)`}
          onConfirm={onConfirm}
          trigger={
            <Button type="button" disabled={tasks.length === 0 || confirming}>
              <CheckCircle2 aria-hidden="true" />
              Confirm Plan ({tasks.length} tasks)
            </Button>
          }
        />
      </div>
    </div>
  );
}
