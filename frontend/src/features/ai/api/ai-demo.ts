import type { AiPlan } from '@/mocks/fixtures/ai.fixtures';

export function isAiDemoEnabled() {
  return import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true';
}

export async function loadAiPlanDemo(projectName: string, description: string): Promise<AiPlan> {
  if (!import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_API !== 'true') {
    throw new Error('AI Planner demo mode is disabled.');
  }
  const { mockAiPlan } = await import('@/mocks/fixtures/ai.fixtures');
  return {
    ...mockAiPlan,
    summary: `${projectName.trim()}: ${mockAiPlan.summary} (Based on brief: ${description.trim().slice(0, 80)}${description.trim().length > 80 ? '…' : ''})`,
    phases: mockAiPlan.phases.map((phase) => ({
      ...phase,
      tasks: phase.tasks.map((task) => ({ ...task })),
    })),
  };
}
