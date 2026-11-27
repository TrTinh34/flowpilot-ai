export type AuditAction =
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_ARCHIVED'
  | 'PROJECT_MEMBER_ADDED'
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_MOVED';

export type AuditTargetType = 'PROJECT' | 'PROJECT_MEMBER' | 'TASK';

export interface AuditLogInput {
  workspaceId: string;
  projectId: string | null;
  actorId: string;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogRecord {
  id: string;
  workspaceId: string;
  projectId: string | null;
  actorId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}
