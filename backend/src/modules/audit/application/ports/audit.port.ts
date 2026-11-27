import type { AuditLogInput, AuditLogRecord } from '../../domain/audit-log.js';

export interface AuditLoggerPort {
  record(entry: AuditLogInput): Promise<void>;
}

export interface AuditProjectAccess {
  workspaceId: string;
  canReadAudit: boolean;
}

export interface AuditLogReaderPort {
  findProjectAccess(projectId: string, actorId: string): Promise<AuditProjectAccess | null>;
  listByProject(projectId: string, page: number, size: number): Promise<AuditLogRecord[]>;
}
