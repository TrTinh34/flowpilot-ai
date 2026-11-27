import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, Trash2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockAiPlan, type AiPlan, type AiPlanTask } from '@/mocks/fixtures/ai.fixtures';
import { cn } from '@/utils/cn.util';

const PRIORITY_COLORS: Record<AiPlanTask['priority'], string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-yellow-50 text-yellow-700',
  HIGH: 'bg-orange-50 text-orange-700',
  URGENT: 'bg-red-50 text-red-700',
};

type State = 'empty' | 'generating' | 'preview' | 'confirming' | 'success' | 'error';

export function AiPlannerPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<State>('empty');
  const [plan, setPlan] = useState<AiPlan | null>(null);
  const [tasks, setTasks] = useState<{ phaseIdx: number; task: AiPlanTask }[]>([]);
  const [description, setDescription] = useState('');
  const [projectName, setProjectName] = useState('');
  const [errorMsg] = useState('');
  const descChars = description.length;
  const descRef = useRef<HTMLTextAreaElement>(null);

  function generate() {
    if (!description.trim() || !projectName.trim()) return;
    setState('generating');

    // Simulate AI generation with 2.5s delay
    setTimeout(() => {
      const p = { ...mockAiPlan };
      setPlan(p);
      setTasks(
        p.phases.flatMap((ph, phaseIdx) =>
          ph.tasks.map((task) => ({ phaseIdx, task: { ...task } })),
        ),
      );
      setState('preview');
    }, 2500);
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.task.id !== id));
  }

  async function confirmPlan() {
    if (!plan) return;
    setState('confirming');
    // Simulate confirm API call
    await new Promise((r) => setTimeout(r, 1000));
    // In production: POST /ai/plan/:id/confirm
    setState('success');
    setTimeout(() => navigate('/my-tasks'), 2000);
  }

  function regenerate() {
    setState('empty');
    setPlan(null);
    setTasks([]);
  }

  const phasesWithTasks =
    plan?.phases.map((ph, phaseIdx) => ({
      ...ph,
      remaining: tasks.filter((t) => t.phaseIdx === phaseIdx),
    })) ?? [];

  return (
    <div className="flex h-full flex-col lg:flex-row overflow-hidden">
      {/* ── Input Panel ─────────────────────────────────────────────────── */}
      <div className="w-full border-b border-[var(--border)] bg-[var(--surface)] p-6 lg:w-80 lg:border-b-0 lg:border-r lg:overflow-y-auto shrink-0">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="size-5 text-[var(--color-accent-ai)]" aria-hidden="true" />
          <h1 className="text-lg font-semibold text-[var(--foreground)]">AI Planner</h1>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="ai-project-name"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Project name <span className="text-red-500">*</span>
            </label>
            <input
              id="ai-project-name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. E-commerce Platform"
              disabled={state === 'generating' || state === 'confirming'}
              className={cn(
                'h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm',
                'placeholder:text-slate-400 focus-visible:border-[var(--color-primary)]',
                'focus-visible:ring-[3px] focus-visible:ring-[var(--color-primary)]/20 outline-none',
                'disabled:opacity-60 disabled:bg-slate-50',
              )}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="ai-description"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Project description <span className="text-red-500">*</span>
              </label>
              <span
                className={cn(
                  'text-xs',
                  descChars > 7500 ? 'text-red-500' : 'text-[var(--foreground-muted)]',
                )}
              >
                {descChars}/8000
              </span>
            </div>
            <textarea
              id="ai-description"
              ref={descRef}
              rows={8}
              maxLength={8000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project goals, tech stack, team size, and any specific requirements…"
              disabled={state === 'generating' || state === 'confirming'}
              className={cn(
                'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm resize-none',
                'placeholder:text-slate-400 focus-visible:border-[var(--color-primary)]',
                'focus-visible:ring-[3px] focus-visible:ring-[var(--color-primary)]/20 outline-none',
                'disabled:opacity-60 disabled:bg-slate-50',
              )}
            />
          </div>

          <Button
            type="button"
            className="w-full"
            disabled={
              !description.trim() ||
              !projectName.trim() ||
              state === 'generating' ||
              state === 'confirming'
            }
            onClick={generate}
            aria-busy={state === 'generating'}
          >
            {state === 'generating' ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden="true" />
                Generate Plan
              </>
            )}
          </Button>

          {state !== 'empty' && state !== 'generating' && (
            <Button type="button" variant="outline" className="w-full" onClick={regenerate}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Start over
            </Button>
          )}
        </div>

        <p className="mt-6 text-xs text-[var(--foreground-muted)]">
          Mock AI response — real AI generation will use the backend AI module.
        </p>
      </div>

      {/* ── Preview Panel ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 bg-[var(--background)]">
        {/* Empty */}
        {state === 'empty' && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center py-20">
            <div className="rounded-full bg-[var(--color-accent-ai)]/10 p-4">
              <Sparkles className="size-8 text-[var(--color-accent-ai)]" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Describe your project to get started
            </h2>
            <p className="max-w-sm text-sm text-[var(--foreground-secondary)]">
              Enter your project name and description, then click &ldquo;Generate Plan&rdquo; to get
              an AI-powered task breakdown.
            </p>
          </div>
        )}

        {/* Generating skeleton */}
        {state === 'generating' && (
          <div className="space-y-6" aria-label="Generating plan" role="status">
            <div className="flex items-center gap-2 text-[var(--color-accent-ai)]">
              <Loader2 className="size-5 animate-spin" />
              <span className="text-sm font-medium">AI is generating your plan…</span>
            </div>
            {[3, 2, 4].map((count, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2"
              >
                <div className="h-5 w-32 rounded bg-[var(--surface-secondary)] animate-pulse" />
                {[...Array(count)].map((_, j) => (
                  <div
                    key={j}
                    className="h-10 rounded-lg bg-[var(--surface-secondary)] animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Preview / editing */}
        {(state === 'preview' || state === 'confirming') && plan && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="rounded-xl border border-[var(--color-accent-ai)]/30 bg-[var(--color-accent-ai)]/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="size-4 text-[var(--color-accent-ai)]" aria-hidden="true" />
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  {projectName}
                </span>
              </div>
              <p className="text-sm text-[var(--foreground-secondary)]">{plan.summary}</p>
              <p className="mt-2 text-xs text-[var(--foreground-muted)]">
                {tasks.length} tasks across {plan.phases.length} phases
              </p>
            </div>

            {/* Phases */}
            {phasesWithTasks.map((phase, phaseIdx) => (
              <div
                key={phaseIdx}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">
                  {phase.name}
                </h3>
                {phase.remaining.length === 0 && (
                  <p className="text-xs text-[var(--foreground-muted)]">
                    All tasks removed from this phase.
                  </p>
                )}
                <ul className="space-y-2">
                  {phase.remaining.map(({ task }) => (
                    <li
                      key={task.id}
                      className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2"
                    >
                      <span
                        className={cn(
                          'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase',
                          PRIORITY_COLORS[task.priority],
                        )}
                      >
                        {task.priority}
                      </span>
                      <span className="flex-1 text-sm text-[var(--foreground)]">{task.title}</span>
                      <span className="shrink-0 text-xs text-[var(--foreground-muted)]">
                        ~{task.estimatedDays}d
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        aria-label={`Remove "${task.title}"`}
                        disabled={state === 'confirming'}
                        className="shrink-0 rounded p-1 text-[var(--foreground-muted)] hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-30"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                className="flex-1"
                disabled={tasks.length === 0 || state === 'confirming'}
                onClick={() => void confirmPlan()}
                aria-busy={state === 'confirming'}
              >
                {state === 'confirming' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Confirming…
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-4" />
                    Confirm Plan ({tasks.length} tasks)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Success */}
        {state === 'success' && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center py-20">
            <div className="rounded-full bg-green-50 p-4">
              <CheckCircle className="size-10 text-green-500" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Plan confirmed!</h2>
            <p className="text-sm text-[var(--foreground-secondary)]">Redirecting to My Tasks…</p>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center py-20">
            <AlertCircle className="size-10 text-red-400" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Generation failed</h2>
            <p className="text-sm text-[var(--foreground-secondary)]">{errorMsg}</p>
            <Button variant="outline" onClick={regenerate}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
