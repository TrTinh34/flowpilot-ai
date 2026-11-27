import type { Prisma, PrismaClient } from '../../generated/prisma/client.js';
import type { AuditLoggerPort } from './application/ports/audit.port.js';
import { PrismaAuditLogger } from './infrastructure/prisma-audit.repository.js';

export function createAuditLogger(db: Prisma.TransactionClient | PrismaClient): AuditLoggerPort {
  return new PrismaAuditLogger(db);
}
