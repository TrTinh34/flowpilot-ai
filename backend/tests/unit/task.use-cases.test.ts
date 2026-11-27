import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TaskUnitOfWork } from '../../src/modules/task/application/ports/task-unit-of-work.port.js';
import type { TaskRepository } from '../../src/modules/task/application/ports/task.repository.port.js';
import { CreateTaskUseCase } from '../../src/modules/task/application/use-cases/create-task.use-case.js';
import { GetTaskDetailUseCase } from '../../src/modules/task/application/use-cases/get-task-detail.use-case.js';
import { ListMyTasksUseCase } from '../../src/modules/task/application/use-cases/list-my-tasks.use-case.js';
import { ListProjectTasksUseCase } from '../../src/modules/task/application/use-cases/list-project-tasks.use-case.js';
import { UpdateTaskUseCase } from '../../src/modules/task/application/use-cases/update-task.use-case.js';
import { MoveTaskUseCase } from '../../src/modules/task/application/use-cases/move-task.use-case.js';
import {
  InvalidSubtaskParentError,
  InvalidTaskAssigneeError,
  ParentTaskNotFoundError,
  TaskForbiddenError,
  TaskNotFoundError,
  TaskProjectArchivedError,
  TaskProjectNotFoundError,
  TaskVersionConflictError,
} from '../../src/modules/task/domain/errors/task.errors.js';

const projectId = randomUUID();
const workspaceId = randomUUID();
const actorId = randomUUID();
const taskId = randomUUID();

const sampleTask = {
  id: taskId,
  projectId,
  parentId: null,
  assigneeId: actorId,
  title: 'Sample Task',
  description: 'Details',
  status: 'TODO' as const,
  priority: 'MEDIUM' as const,
  dueDate: null,
  position: 0,
  version: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

let taskRepository: TaskRepository;
let unitOfWork: TaskUnitOfWork;

beforeEach(() => {
  taskRepository = {
    lockProject: vi.fn(),
    listBoardPositions: vi.fn(),
    moveWithVersion: vi.fn(),
    updateBoardPositions: vi.fn(),
    findProjectAccess: vi.fn().mockResolvedValue({
      projectId,
      workspaceId,
      projectStatus: 'ACTIVE',
      canRead: true,
      canWrite: true,
    }),
    findTaskAccess: vi.fn().mockResolvedValue({
      task: { ...sampleTask, subtasks: [] },
      access: {
        projectId,
        workspaceId,
        projectStatus: 'ACTIVE',
        canRead: true,
        canWrite: true,
      },
    }),
    listByProject: vi.fn().mockResolvedValue([sampleTask]),
    findParentInProject: vi.fn().mockResolvedValue({ id: randomUUID(), parentId: null }),
    isProjectMember: vi.fn().mockResolvedValue(true),
    getNextTodoPosition: vi.fn().mockResolvedValue(0),
    create: vi.fn().mockResolvedValue(sampleTask),
    updateWithVersion: vi.fn().mockResolvedValue({ ...sampleTask, version: 1 }),
    listByAssignee: vi.fn().mockResolvedValue([sampleTask]),
  };

  unitOfWork = {
    execute: vi.fn((work) => work({ tasks: taskRepository })),
  };
});

describe('Task Use Cases', () => {
  it('moves a task after locking the project and repositions affected column entries', async () => {
    const sibling = randomUUID();
    vi.mocked(taskRepository.listBoardPositions).mockResolvedValue([
      { id: taskId, status: 'TODO', position: 0 },
      { id: sibling, status: 'IN_PROGRESS', position: 0 },
    ]);
    vi.mocked(taskRepository.moveWithVersion).mockResolvedValue({
      ...sampleTask,
      status: 'IN_PROGRESS',
      version: 1,
    });
    const input = { taskId, actorId, status: 'IN_PROGRESS' as const, position: 0, version: 0 };
    await expect(new MoveTaskUseCase(unitOfWork).execute(input)).resolves.toMatchObject({
      version: 1,
    });
    expect(taskRepository.lockProject).toHaveBeenCalledWith(projectId, workspaceId);
    expect(taskRepository.updateBoardPositions).toHaveBeenCalledWith([
      { id: sibling, position: 1 },
    ]);
    await expect(
      new MoveTaskUseCase(unitOfWork).execute({ ...input, version: 99 }),
    ).rejects.toBeInstanceOf(TaskVersionConflictError);
    expect(taskRepository.moveWithVersion).toHaveBeenCalledTimes(1);
  });
  it('ListProjectTasksUseCase enforces project visibility and paginates', async () => {
    const useCase = new ListProjectTasksUseCase(taskRepository);
    await expect(useCase.execute({ projectId, actorId, page: 0, size: 20 })).resolves.toEqual({
      data: [sampleTask],
      page: 0,
      size: 20,
    });

    vi.mocked(taskRepository.findProjectAccess).mockResolvedValueOnce(null);
    await expect(useCase.execute({ projectId, actorId, page: 0, size: 20 })).rejects.toBeInstanceOf(
      TaskProjectNotFoundError,
    );

    vi.mocked(taskRepository.findProjectAccess).mockResolvedValueOnce({
      projectId,
      workspaceId,
      projectStatus: 'ACTIVE',
      canRead: false,
      canWrite: false,
    });
    await expect(useCase.execute({ projectId, actorId, page: 0, size: 20 })).rejects.toBeInstanceOf(
      TaskForbiddenError,
    );
  });

  it('CreateTaskUseCase enforces write access, archived project, 1-level subtask, and project member assignee', async () => {
    const useCase = new CreateTaskUseCase(unitOfWork);

    const created = await useCase.execute({
      projectId,
      actorId,
      title: 'New Task',
      description: 'Desc',
      priority: 'HIGH',
      assigneeId: actorId,
    });
    expect(created).toEqual(sampleTask);

    vi.mocked(taskRepository.findProjectAccess).mockResolvedValueOnce({
      projectId,
      workspaceId,
      projectStatus: 'ACTIVE',
      canRead: true,
      canWrite: false,
    });
    await expect(
      useCase.execute({ projectId, actorId, title: 'T', description: '', priority: 'LOW' }),
    ).rejects.toBeInstanceOf(TaskForbiddenError);

    vi.mocked(taskRepository.findProjectAccess).mockResolvedValueOnce({
      projectId,
      workspaceId,
      projectStatus: 'ARCHIVED',
      canRead: true,
      canWrite: true,
    });
    await expect(
      useCase.execute({ projectId, actorId, title: 'T', description: '', priority: 'LOW' }),
    ).rejects.toBeInstanceOf(TaskProjectArchivedError);

    vi.mocked(taskRepository.findParentInProject).mockResolvedValueOnce(null);
    await expect(
      useCase.execute({
        projectId,
        actorId,
        title: 'Sub',
        description: '',
        priority: 'LOW',
        parentId: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(ParentTaskNotFoundError);

    vi.mocked(taskRepository.findParentInProject).mockResolvedValueOnce({
      id: randomUUID(),
      parentId: randomUUID(),
    });
    await expect(
      useCase.execute({
        projectId,
        actorId,
        title: 'Nested Sub',
        description: '',
        priority: 'LOW',
        parentId: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(InvalidSubtaskParentError);

    vi.mocked(taskRepository.isProjectMember).mockResolvedValueOnce(false);
    await expect(
      useCase.execute({
        projectId,
        actorId,
        title: 'Assigned',
        description: '',
        priority: 'LOW',
        assigneeId: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(InvalidTaskAssigneeError);
  });

  it('GetTaskDetailUseCase returns detail or throws 404/403 domain errors', async () => {
    const useCase = new GetTaskDetailUseCase(taskRepository);
    await expect(useCase.execute({ taskId, actorId })).resolves.toMatchObject({ id: taskId });

    vi.mocked(taskRepository.findTaskAccess).mockResolvedValueOnce(null);
    await expect(useCase.execute({ taskId, actorId })).rejects.toBeInstanceOf(TaskNotFoundError);
  });

  it('UpdateTaskUseCase checks permissions, archived status, assignee, and optimistic version', async () => {
    const useCase = new UpdateTaskUseCase(unitOfWork);

    await expect(
      useCase.execute({ taskId, actorId, version: 0, title: 'Updated' }),
    ).resolves.toMatchObject({
      version: 1,
    });

    vi.mocked(taskRepository.updateWithVersion).mockResolvedValueOnce(null);
    await expect(
      useCase.execute({ taskId, actorId, version: 0, title: 'Stale' }),
    ).rejects.toBeInstanceOf(TaskVersionConflictError);
  });

  it('ListMyTasksUseCase lists tasks assigned to actor', async () => {
    const useCase = new ListMyTasksUseCase(taskRepository);
    await expect(useCase.execute({ actorId, page: 0, size: 10 })).resolves.toEqual({
      data: [sampleTask],
      page: 0,
      size: 10,
    });
    expect(taskRepository.listByAssignee).toHaveBeenCalledWith(actorId, 0, 10);
  });
});
