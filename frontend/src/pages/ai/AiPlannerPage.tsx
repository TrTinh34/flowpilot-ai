import { useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingState } from '@/components/common/LoadingState';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isAiDemoEnabled, loadAiPlanDemo } from '@/features/ai/api/ai-demo';
import { AiBriefForm } from '@/features/ai/components/AiBriefForm';
import { AiPlanDraftEditor, type DraftTaskItem } from '@/features/ai/components/AiPlanDraftEditor';
import type { AiPlan } from '@/mocks/fixtures/ai.fixtures';
import { cn } from '@/utils/cn.util';

type WorkflowState = 'brief' | 'generating' | 'preview' | 'confirming' | 'confirmed' | 'error';

const STEPS = [
  { key: 'brief', label: '1. Brief' },
  { key: 'generating', label: '2. Generate' },
  { key: 'preview', label: '3. Review & Edit' },
  { key: 'confirmed', label: '4. Confirmed' },
] as const;

function resolveStepIndex(state: WorkflowState) {
  if (state === 'brief' || state === 'error') return 0;
  if (state === 'generating') return 1;
  if (state === 'preview' || state === 'confirming') return 2;
  return 3;
}

export function AiPlannerPage() {
  const demoEnabled = isAiDemoEnabled();
  const [state, setState] = useState<WorkflowState>('brief');
  const [plan, setPlan] = useState<AiPlan | null>(null);
  const [tasks, setTasks] = useState<DraftTaskItem[]>([]);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState<string>();
  const [errorMsg, setErrorMsg] = useState('');

  async function generate() {
    if (!projectName.trim() || !description.trim()) {
      setValidationError('Enter both a project name and a project description.');
      return;
    }
    setValidationError(undefined);
    setErrorMsg('');
    setState('generating');
    try {
      const loaded = await loadAiPlanDemo(projectName, description);
      setPlan(loaded);
      setTasks(
        loaded.phases.flatMap((phase, phaseIdx) =>
          phase.tasks.map((task) => ({ phaseIdx, task: { ...task } })),
        ),
      );
      setState('preview');
    } catch (cause) {
      setErrorMsg(cause instanceof Error ? cause.message : 'Could not generate a plan.');
      setState('error');
    }
  }

  function updateTaskTitle(id: string, title: string) {
    setTasks((prev) =>
      prev.map((item) => (item.task.id === id ? { ...item, task: { ...item.task, title } } : item)),
    );
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((item) => item.task.id !== id));
  }

  async function confirmPlan() {
    if (!plan) return;
    setState('confirming');
    setState('confirmed');
  }

  function reset() {
    setState('brief');
    setPlan(null);
    setTasks([]);
    setValidationError(undefined);
    setErrorMsg('');
  }

  if (!demoEnabled) {
    return (
      <div className="w-full min-w-0 space-y-6 px-page-gutter py-6">
        <PageHeader
          title="AI Planner"
          description="Generate structured project phases and draft tasks from a brief."
        />
        <EmptyState
          icon={Sparkles}
          title="AI Planner API is not enabled"
          description="Server-side AI plan generation is not active in this environment. Enable DEV demo mode to preview the 4-step workflow."
        />
      </div>
    );
  }

  const activeStep = resolveStepIndex(state);

  return (
    <div className="w-full min-w-0 space-y-6 px-page-gutter py-6">
      <PageHeader
        title="AI Planner"
        description="Draft project phases from a brief, refine tasks, and confirm in Demo mode."
        badge={<Badge tone="ai">Demo</Badge>}
      />

      <nav aria-label="AI workflow steps">
        <ol className="grid gap-2 sm:grid-cols-4">
          {STEPS.map((step, index) => {
            const current = index === activeStep;
            const completed = index < activeStep;
            return (
              <li
                key={step.key}
                aria-current={current ? 'step' : undefined}
                className={cn(
                  'rounded-[var(--radius)] border px-3 py-2 text-xs font-medium',
                  current
                    ? 'border-[var(--ai-border)] bg-[var(--ai-bg)] text-[var(--ai-text)]'
                    : completed
                      ? 'border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--success-text)]'
                      : 'border-border bg-card text-muted-foreground',
                )}
              >
                {step.label}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(19rem,24rem)_minmax(0,1fr)]">
        <section
          aria-label="Brief input"
          className="rounded-[var(--radius-md)] border border-border bg-card p-5"
        >
          <AiBriefForm
            projectName={projectName}
            description={description}
            busy={state === 'generating' || state === 'confirming'}
            canReset={state !== 'brief'}
            validationError={validationError}
            onProjectNameChange={setProjectName}
            onDescriptionChange={setDescription}
            onGenerate={() => void generate()}
            onReset={reset}
          />
        </section>

        <section aria-label="Plan workspace" className="min-w-0">
          {state === 'brief' && (
            <EmptyState
              icon={Sparkles}
              title="Describe your project to get started"
              description="Enter a project name and description, or pick an example brief, then click Generate Plan."
            />
          )}

          {state === 'generating' && (
            <div className="space-y-3" role="status" aria-live="polite">
              <p className="text-sm font-medium text-[var(--ai-text)]">
                AI is generating your draft plan…
              </p>
              <LoadingState label="Generating AI project plan" variant="cards" />
            </div>
          )}

          {(state === 'preview' || state === 'confirming') && plan && (
            <AiPlanDraftEditor
              plan={plan}
              projectName={projectName}
              tasks={tasks}
              confirming={state === 'confirming'}
              onUpdateTitle={updateTaskTitle}
              onRemoveTask={removeTask}
              onConfirm={confirmPlan}
            />
          )}

          {state === 'confirmed' && (
            <section
              role="status"
              className="space-y-4 rounded-[var(--radius-md)] border border-[var(--color-success-border)] bg-[var(--color-success-bg)] p-6"
            >
              <div className="flex items-start gap-3 text-[var(--success-text)]">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div className="space-y-1">
                  <h2 className="text-section-title">Demo plan confirmed</h2>
                  <p className="text-sm">
                    Reviewed {tasks.length} draft tasks for &ldquo;{projectName}&rdquo;. Demo
                    confirmation updates preview state only and does not create real tasks.
                  </p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={reset}>
                Create another draft
              </Button>
            </section>
          )}

          {state === 'error' && (
            <ErrorState
              title="Could not generate plan"
              message={errorMsg}
              onRetry={() => void generate()}
            />
          )}
        </section>
      </div>
    </div>
  );
}
