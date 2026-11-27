import type { Prisma, PrismaClient } from '../../../../generated/prisma/client.js';
import type {
  RefreshTokenRepository,
  SaveRefreshTokenData,
} from '../../application/ports/refresh-token.repository.port.js';
import type { RefreshTokenRecord } from '../../domain/entities/refresh-token.entity.js';

type PrismaDbClient = PrismaClient | Prisma.TransactionClient;

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly client: PrismaDbClient) {}

  async save(data: SaveRefreshTokenData): Promise<void> {
    await this.client.refreshToken.create({ data, select: { id: true } });
  }

  findByTokenHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    return this.client.refreshToken.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true, familyId: true, expiresAt: true, revokedAt: true },
    });
  }

  async lockFamily(familyId: string): Promise<void> {
    // Serialize all rotations and reuse checks within a family, including different generations.
    await this.client.$queryRaw`
      SELECT 1 FROM pg_advisory_xact_lock(hashtextextended(${familyId}, 0))
    `;
  }

  async revokeToken(id: string, revokedAt: Date): Promise<void> {
    await this.client.refreshToken.update({
      where: { id },
      data: { revokedAt },
      select: { id: true },
    });
  }

  async revokeFamily(familyId: string, revokedAt: Date): Promise<void> {
    await this.client.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt },
    });
  }
}
