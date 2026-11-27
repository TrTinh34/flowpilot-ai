import type { PublicUser } from '../../domain/entities/user.entity.js';

export interface RegisterUserInput {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export type PublicUserDto = PublicUser;

export interface AuthSessionDto {
  refreshToken: string;
  expiresAt: Date;
  accessToken: string;
  expiresIn: number;
}
