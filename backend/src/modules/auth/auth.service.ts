import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import { hashPassword, verifyPassword } from '../../utils/crypto.util.js';
import {
  createUser,
  emailExists,
  findUserCredentials,
  isDuplicateEmail,
} from './auth.repository.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

// A cost-12 bcrypt fixture keeps the comparison step for unknown accounts.
const dummyPasswordHash = '$2b$12$ZpRRYp15G9YIZ7vnuyqEM.eEVo9OzWa0nwdw9fFXXtSP8KCDgz8Iu';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function emailConflict() {
  return new AppError(409, ERROR_CODES.EMAIL_ALREADY_EXISTS, 'Email is already registered');
}

export async function register({ displayName, email, password }: RegisterInput) {
  const normalizedEmail = normalizeEmail(email);
  if (await emailExists(normalizedEmail)) {
    throw emailConflict();
  }

  const passwordHash = await hashPassword(password);
  try {
    return await createUser({ displayName, email: normalizedEmail, passwordHash });
  } catch (error) {
    if (isDuplicateEmail(error)) {
      throw emailConflict();
    }
    throw error;
  }
}

export async function verifyLoginCredentials({
  email,
  password,
}: LoginInput): Promise<{ userId: string }> {
  let user;
  let passwordMatches: boolean;
  try {
    user = await findUserCredentials(normalizeEmail(email));
    passwordMatches = await verifyPassword(password, user?.passwordHash ?? dummyPasswordHash);
  } catch {
    throw new AppError(500, ERROR_CODES.INTERNAL_ERROR, 'An unexpected internal error occurred');
  }

  if (!user || !passwordMatches) {
    throw new AppError(401, ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email or password.');
  }

  return { userId: user.id };
}
