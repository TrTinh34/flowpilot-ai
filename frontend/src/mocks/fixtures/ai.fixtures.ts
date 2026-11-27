export interface AiPlanTask {
  id: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedDays: number;
}

export interface AiPlanPhase {
  name: string;
  tasks: AiPlanTask[];
}

export interface AiPlan {
  id: string;
  status: 'READY';
  summary: string;
  phases: AiPlanPhase[];
}

export const mockAiPlan: AiPlan = {
  id: 'mock-plan-1',
  status: 'READY',
  summary:
    'A 4-phase plan covering project setup, core API development, frontend integration, and testing & release.',
  phases: [
    {
      name: 'Phase 1: Foundation',
      tasks: [
        { id: 't1', title: 'Set up CI/CD pipeline', priority: 'HIGH', estimatedDays: 2 },
        { id: 't2', title: 'Configure PostgreSQL database', priority: 'HIGH', estimatedDays: 1 },
        { id: 't3', title: 'Initialize monorepo structure', priority: 'MEDIUM', estimatedDays: 1 },
      ],
    },
    {
      name: 'Phase 2: Core API',
      tasks: [
        { id: 't4', title: 'Implement authentication API', priority: 'URGENT', estimatedDays: 3 },
        { id: 't5', title: 'Build workspace management API', priority: 'HIGH', estimatedDays: 2 },
        { id: 't6', title: 'Create project & task APIs', priority: 'HIGH', estimatedDays: 3 },
      ],
    },
    {
      name: 'Phase 3: Frontend',
      tasks: [
        { id: 't7', title: 'Build authentication UI', priority: 'HIGH', estimatedDays: 2 },
        { id: 't8', title: 'Implement Kanban board', priority: 'HIGH', estimatedDays: 3 },
        {
          id: 't9',
          title: 'Add dashboard and notifications',
          priority: 'MEDIUM',
          estimatedDays: 2,
        },
      ],
    },
    {
      name: 'Phase 4: Release',
      tasks: [
        { id: 't10', title: 'Write integration tests', priority: 'HIGH', estimatedDays: 2 },
        { id: 't11', title: 'Security review and hardening', priority: 'URGENT', estimatedDays: 1 },
        { id: 't12', title: 'Production deployment', priority: 'HIGH', estimatedDays: 1 },
      ],
    },
  ],
};
