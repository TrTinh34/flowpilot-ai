import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type {
  AuthTransactionRepositories,
  AuthUnitOfWork,
} from '../../application/ports/auth-unit-of-work.port.js';
import { PrismaRefreshTokenRepository } from '../repositories/prisma-refresh-token.repository.js';

export class PrismaAuthUnitOfWork implements AuthUnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  execute<T>(work: (repos: AuthTransactionRepositories) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(
      (tx) => work({ refreshTokens: new PrismaRefreshTokenRepository(tx) }),
      { isolationLevel: 'ReadCommitted' },
    );
  }
}
