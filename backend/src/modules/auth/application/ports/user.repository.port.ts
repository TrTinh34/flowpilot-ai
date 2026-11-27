import type { PublicUser, UserCredentials } from '../../domain/entities/user.entity.js';

export interface CreateUserData {
  email: string;
  displayName: string;
  passwordHash: string;
}

export interface UserRepository {
  emailExists(email: string): Promise<boolean>;
  create(data: CreateUserData): Promise<PublicUser>;
  findCredentialsByEmail(email: string): Promise<UserCredentials | null>;
  findPublicById(id: string): Promise<PublicUser | null>;
}
