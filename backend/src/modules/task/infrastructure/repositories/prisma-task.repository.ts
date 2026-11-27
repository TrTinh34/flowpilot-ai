import type { Prisma, PrismaClient } from '../../../../generated/prisma/client.js';
import type {
  CreateTaskRecordData,
  TaskRepository,
  UpdateTaskRecordData,
} from '../../application/ports/task.repository.port.js';
import type {
  ProjectTaskAccess,
  TaskDetailEntity,
  TaskEntity,
  TaskStatus,
} from '../../domain/entities/task.entity.js';

type PrismaDbClient = PrismaClient | Prisma.TransactionClient;

const taskSelect = {
  id: true,
  projectId: true,
  parentId: true,
  assigneeId: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  position: true,
  version: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly client: PrismaDbClient) {}

  async lockProject(projectId: string, workspaceId: string): Promise<void> {
    // Project and workspace membership mutations acquire the workspace lock first.
    await this.client
      .$queryRaw`SELECT id FROM workspaces WHERE id = ${workspaceId}::uuid FOR UPDATE`;
    await this.client.$queryRaw`SELECT id FROM projects WHERE id = ${projectId}::uuid FOR UPDATE`;
  }

  listBoardPositions(projectId: string, statuses: TaskStatus[]) {
    return this.client.task.findMany({
      where: { projectId, status: { in: statuses } },
      select: { id: true, status: true, position: true },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });
  }

  async moveWithVersion(input: {
    taskId: string;
    version: number;
    status: TaskStatus;
    position: number;
  }) {
    const result = await this.client.task.updateMany({
      where: { id: input.taskId, version: input.version },
      data: { status: input.status, position: input.position, version: { increment: 1 } },
    });
    if (result.count === 0) return null;
    return this.client.task.findUnique({ where: { id: input.taskId }, select: taskSelect });
  }

  async updateBoardPositions(changes: { id: string; position: number }[]): Promise<void> {
    if (changes.length === 0) return;
    await this.client.$executeRaw`
      UPDATE tasks AS task
      SET position = shifted.position, version = task.version + 1, updated_at = CURRENT_TIMESTAMP
      FROM jsonb_to_recordset(${JSON.stringify(changes)}::jsonb) AS shifted(id uuid, position integer)
      WHERE task.id = shifted.id
    `;
  }

  async findProjectAccess(projectId: string, actorId: string): Promise<ProjectTaskAccess | null> {
    const project = await this.client.project.findFirst({
      where: {
        id: projectId,
        workspace: { members: { some: { userId: actorId } } },
      },
      select: {
        id: true,
        workspaceId: true,
        status: true,
        workspace: {
          select: {
            members: {
              where: { userId: actorId },
              select: { role: true },
              take: 1,
            },
          },
        },
        members: {
          where: { userId: actorId },
          select: { role: true },
          take: 1,
        },
      },
    });

    if (!project || project.workspace.members.length === 0) {
      return null;
    }

    const workspaceRole = project.workspace.members[0].role;
    const projectMember = project.members[0];
    const isWorkspaceManager = workspaceRole === 'OWNER' || workspaceRole === 'ADMIN';

    return {
      projectId: project.id,
      workspaceId: project.workspaceId,
      projectStatus: project.status,
      canRead: isWorkspaceManager || Boolean(projectMember),
      canWrite: isWorkspaceManager || projectMember?.role === 'MANAGER',
    };
  }

  async findTaskAccess(
    taskId: string,
    actorId: string,
  ): Promise<{ task: TaskDetailEntity; access: ProjectTaskAccess } | null> {
    const row = await this.client.task.findFirst({
      where: {
        id: taskId,
        project: { workspace: { members: { some: { userId: actorId } } } },
      },
      select: {
        ...taskSelect,
        subtasks: {
          select: taskSelect,
          orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        },
        project: {
          select: {
            id: true,
            workspaceId: true,
            status: true,
            workspace: {
              select: {
                members: {
                  where: { userId: actorId },
                  select: { role: true },
                  take: 1,
                },
              },
            },
            members: {
              where: { userId: actorId },
              select: { role: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!row || row.project.workspace.members.length === 0) {
      return null;
    }

    const workspaceRole = row.project.workspace.members[0].role;
    const projectMember = row.project.members[0];
    const isWorkspaceManager = workspaceRole === 'OWNER' || workspaceRole === 'ADMIN';

    const { project, ...task } = row;
    return {
      task,
      access: {
        projectId: project.id,
        workspaceId: project.workspaceId,
        projectStatus: project.status,
        canRead: isWorkspaceManager || Boolean(projectMember),
        canWrite: isWorkspaceManager || projectMember?.role === 'MANAGER',
      },
    };
  }

  listByProject(projectId: string, skip: number, take: number): Promise<TaskEntity[]> {
    return this.client.task.findMany({
      where: { projectId },
      select: taskSelect,
      orderBy: [{ status: 'asc' }, { position: 'asc' }, { createdAt: 'asc' }],
      skip,
      take,
    });
  }

  findParentInProject(
    projectId: string,
    parentId: string,
  ): Promise<{ id: string; parentId: string | null } | null> {
    return this.client.task.findFirst({
      where: { id: parentId, projectId },
      select: { id: true, parentId: true },
    });
  }

  async isProjectMember(projectId: string, userId: string): Promise<boolean> {
    const member = await this.client.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { userId: true },
    });
    return Boolean(member);
  }

  async getNextTodoPosition(projectId: string): Promise<number> {
    const aggregate = await this.client.task.aggregate({
      where: { projectId, status: 'TODO' },
      _max: { position: true },
    });
    return (aggregate._max.position ?? -1) + 1;
  }

  create(data: CreateTaskRecordData): Promise<TaskEntity> {
    return this.client.task.create({
      data: {
        projectId: data.projectId,
        parentId: data.parentId,
        assigneeId: data.assigneeId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        position: data.position,
      },
      select: taskSelect,
    });
  }

  async updateWithVersion(data: UpdateTaskRecordData): Promise<TaskEntity | null> {
    const updateData: Prisma.TaskUncheckedUpdateManyInput = {
      version: { increment: 1 },
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;

    const result = await this.client.task.updateMany({
      where: { id: data.taskId, version: data.version },
      data: updateData,
    });

    if (result.count === 0) {
      return null;
    }

    return this.client.task.findUnique({
      where: { id: data.taskId },
      select: taskSelect,
    });
  }

  listByAssignee(actorId: string, skip: number, take: number): Promise<TaskEntity[]> {
    return this.client.task.findMany({
      where: {
        assigneeId: actorId,
        project: { workspace: { members: { some: { userId: actorId } } } },
      },
      select: taskSelect,
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      skip,
      take,
    });
  }
}
