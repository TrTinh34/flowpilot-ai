import type { RefreshTokenRepository } from './refresh-token.repository.port.js';

export interface AuthTransactionRepositories {
  refreshTokens: RefreshTokenRepository;
}

export interface AuthUnitOfWork {
  execute<T>(work: (repos: AuthTransactionRepositories) => Promise<T>): Promise<T>;
}
