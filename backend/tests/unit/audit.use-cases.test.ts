import { randomUUID } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import type { AuditLoggerPort } from '../../src/modules/audit/index.js';
import type { TaskUnitOfWork } from '../../src/modules/task/application/ports/task-unit-of-work.port.js';
import type { TaskRepository } from '../../src/modules/task/application/ports/task.repository.port.js';
import { CreateTaskUseCase } from '../../src/modules/task/application/use-cases/create-task.use-case.js';
import { MoveTaskUseCase } from '../../src/modules/task/application/use-cases/move-task.use-case.js';
import { UpdateTaskUseCase } from '../../src/modules/task/application/use-cases/update-task.use-case.js';

describe('Task audit emission via AuditLoggerPort', () => {
  const workspaceId = randomUUID();
  const projectId = randomUUID();
  const actorId = randomUUID();
  const taskId = randomUUID();
  const baseTask = {
    id: taskId,
    projectId,
    parentId: null,
    assigneeId: actorId,
    title: 'Design API',
    description: '',
    status: 'TODO' as const,
    priority: 'HIGH' as const,
    dueDate: null,
    position: 0,
    version: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  function setup() {
    const audit: AuditLoggerPort = { record: vi.fn() };
    const tasks: TaskRepository = {
      lockProject: vi.fn(),
      listBoardPositions: vi.fn().mockResolvedValue([{ id: taskId, status: 'TODO', position: 0 }]),
      moveWithVersion: vi
        .fn()
        .mockResolvedValue({ ...baseTask, status: 'IN_PROGRESS', version: 1 }),
      updateBoardPositions: vi.fn(),
      findProjectAccess: vi.fn().mockResolvedValue({
        projectId,
        workspaceId,
        projectStatus: 'ACTIVE',
        canRead: true,
        canWrite: true,
      }),
      findTaskAccess: vi.fn().mockResolvedValue({
        task: { ...baseTask, subtasks: [] },
        access: {
          projectId,
          workspaceId,
          projectStatus: 'ACTIVE',
          canRead: true,
          canWrite: true,
        },
      }),
      listByProject: vi.fn(),
      findParentInProject: vi.fn(),
      isProjectMember: vi.fn().mockResolvedValue(true),
      getNextTodoPosition: vi.fn().mockResolvedValue(0),
      create: vi.fn().mockResolvedValue(baseTask),
      updateWithVersion: vi.fn().mockResolvedValue({ ...baseTask, title: 'Updated', version: 1 }),
      listByAssignee: vi.fn(),
    };
    const uow: TaskUnitOfWork = { execute: (work) => work({ tasks, audit }) };
    return { audit, tasks, uow };
  }

  it('records TASK_CREATED, TASK_UPDATED, and TASK_MOVED inside transactions', async () => {
    const { audit, uow } = setup();

    await new CreateTaskUseCase(uow).execute({
      projectId,
      actorId,
      title: 'Design API',
      description: '',
      priority: 'HIGH',
    });
    expect(audit.record).toHaveBeenLastCalledWith({
      workspaceId,
      projectId,
      actorId,
      action: 'TASK_CREATED',
      targetType: 'TASK',
      targetId: taskId,
      metadata: { title: 'Design API', priority: 'HIGH', parentId: null },
    });

    await new UpdateTaskUseCase(uow).execute({ taskId, actorId, version: 0, title: 'Updated' });
    expect(audit.record).toHaveBeenLastCalledWith({
      workspaceId,
      projectId,
      actorId,
      action: 'TASK_UPDATED',
      targetType: 'TASK',
      targetId: taskId,
      metadata: { title: 'Updated', priority: 'HIGH', assigneeId: actorId },
    });

    await new MoveTaskUseCase(uow).execute({
      taskId,
      actorId,
      status: 'IN_PROGRESS',
      position: 0,
      version: 0,
    });
    expect(audit.record).toHaveBeenLastCalledWith({
      workspaceId,
      projectId,
      actorId,
      action: 'TASK_MOVED',
      targetType: 'TASK',
      targetId: taskId,
      metadata: { fromStatus: 'TODO', toStatus: 'IN_PROGRESS', position: 0 },
    });
  });

  it('does not emit audit entry when version check fails', async () => {
    const { audit, tasks, uow } = setup();
    vi.mocked(tasks.updateWithVersion).mockResolvedValueOnce(null);

    await expect(
      new UpdateTaskUseCase(uow).execute({ taskId, actorId, version: 99, title: 'Stale' }),
    ).rejects.toThrow();
    expect(audit.record).not.toHaveBeenCalled();
  });
});
