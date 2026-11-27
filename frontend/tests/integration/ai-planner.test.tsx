import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import * as aiDemo from '@/features/ai/api/ai-demo';
import { AiPlannerPage } from '@/pages/ai/AiPlannerPage';

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubEnv('DEV', true);
  vi.stubEnv('VITE_USE_MOCK_API', 'false');
});

afterEach(() => vi.unstubAllEnvs());

it('hides demo workflow when Demo is disabled or in production', () => {
  render(<AiPlannerPage />);
  expect(screen.getByRole('heading', { name: 'AI Planner' })).toBeInTheDocument();
  expect(screen.getByText('AI Planner API is not enabled')).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Generate Plan' })).not.toBeInTheDocument();

  vi.stubEnv('DEV', false);
  vi.stubEnv('VITE_USE_MOCK_API', 'true');
  expect(aiDemo.isAiDemoEnabled()).toBe(false);
});

it('runs the 4-step keyboard demo workflow, edits tasks, and confirms without creating real tasks', async () => {
  vi.stubEnv('VITE_USE_MOCK_API', 'true');
  const user = userEvent.setup();
  render(<AiPlannerPage />);

  await user.click(screen.getByRole('button', { name: 'Generate Plan' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Enter both a project name and a project description.',
  );

  await user.click(screen.getByRole('button', { name: 'SaaS MVP Launch' }));
  await user.click(screen.getByRole('button', { name: 'Generate Plan' }));

  const taskInput = await screen.findByLabelText('Edit task "Set up CI/CD pipeline"');
  await user.clear(taskInput);
  await user.type(taskInput, 'Configure GitHub Actions CI');

  await user.click(screen.getByRole('button', { name: 'Remove "Configure PostgreSQL database"' }));
  expect(screen.getByRole('button', { name: 'Confirm Plan (11 tasks)' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Confirm Plan (11 tasks)' }));
  const dialog = within(await screen.findByRole('dialog', { name: 'Confirm demo plan' }));
  await user.click(dialog.getByRole('button', { name: 'Confirm Plan (11 tasks)' }));

  expect(await screen.findByRole('heading', { name: 'Demo plan confirmed' })).toBeInTheDocument();
  expect(screen.getByText(/does not create real tasks/i)).toBeVisible();
});

it('keeps the brief draft and allows retrying when generation fails', async () => {
  vi.stubEnv('VITE_USE_MOCK_API', 'true');
  vi.spyOn(aiDemo, 'loadAiPlanDemo').mockRejectedValueOnce(new Error('Provider timeout'));
  const user = userEvent.setup();
  render(<AiPlannerPage />);

  await user.type(screen.getByLabelText('Project name *'), 'Ops Console');
  await user.type(screen.getByLabelText('Project description *'), 'Track incident SLAs');
  await user.click(screen.getByRole('button', { name: 'Generate Plan' }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Provider timeout');
  expect(screen.getByLabelText('Project name *')).toHaveValue('Ops Console');
  expect(screen.getByLabelText('Project description *')).toHaveValue('Track incident SLAs');

  await user.click(screen.getByRole('button', { name: 'Retry' }));
  expect(await screen.findByText(/12 tasks · 4 phases/)).toBeInTheDocument();
});
