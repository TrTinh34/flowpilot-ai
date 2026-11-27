import { Prisma, type PrismaClient } from '../../../../generated/prisma/client.js';
import type {
  CreateUserData,
  UserRepository,
} from '../../application/ports/user.repository.port.js';
import type { PublicUser, UserCredentials } from '../../domain/entities/user.entity.js';
import { EmailAlreadyExistsError } from '../../domain/errors/auth.errors.js';

const publicUserSelect = {
  id: true,
  email: true,
  displayName: true,
  createdAt: true,
  updatedAt: true,
} as const;

function isDuplicateEmailError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
    return false;
  }

  const driverError = error.meta?.driverAdapterError as
    | { cause?: { constraint?: { index?: string } } }
    | undefined;
  return driverError?.cause?.constraint?.index === 'users_email_lower_uidx';
}

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async emailExists(email: string): Promise<boolean> {
    const [result] = await this.prisma.$queryRaw<[{ exists: boolean }]>`
      SELECT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = LOWER(${email}))
    `;
    return result.exists;
  }

  async create(data: CreateUserData): Promise<PublicUser> {
    try {
      return await this.prisma.user.create({
        data,
        select: publicUserSelect,
      });
    } catch (error) {
      if (isDuplicateEmailError(error)) {
        throw new EmailAlreadyExistsError();
      }
      throw error;
    }
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    const [user] = await this.prisma.$queryRaw<UserCredentials[]>`
      SELECT id, password_hash AS "passwordHash"
      FROM users
      WHERE LOWER(email) = LOWER(${email})
    `;
    return user ?? null;
  }

  findPublicById(id: string): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }
}
