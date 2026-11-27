import type { RefreshTokenRecord } from '../../domain/entities/refresh-token.entity.js';

export interface SaveRefreshTokenData {
  userId: string;
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface RefreshTokenRepository {
  save(data: SaveRefreshTokenData): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<RefreshTokenRecord | null>;
  lockFamily(familyId: string): Promise<void>;
  revokeToken(id: string, revokedAt: Date): Promise<void>;
  revokeFamily(familyId: string, revokedAt: Date): Promise<void>;
}
