import { hash } from 'bcryptjs';
import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import { createUser, emailExists, isDuplicateEmail } from './auth.repository.js';
import type { RegisterInput } from './auth.schema.js';

const bcryptCost = 12;

function emailConflict() {
  return new AppError(409, ERROR_CODES.EMAIL_ALREADY_EXISTS, 'Email is already registered');
}

export async function register({ displayName, email, password }: RegisterInput) {
  const normalizedEmail = email.trim().toLowerCase();
  if (await emailExists(normalizedEmail)) {
    throw emailConflict();
  }

  const passwordHash = await hash(password, bcryptCost);
  try {
    return await createUser({ displayName, email: normalizedEmail, passwordHash });
  } catch (error) {
    if (isDuplicateEmail(error)) {
      throw emailConflict();
    }
    throw error;
  }
}
