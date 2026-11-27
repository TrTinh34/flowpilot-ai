import { compare, hash } from 'bcryptjs';
import type { PasswordHasher } from '../../application/ports/password-hasher.port.js';

const BCRYPT_COST = 12;

export class BcryptPasswordHasher implements PasswordHasher {
  hash(password: string): Promise<string> {
    return hash(password, BCRYPT_COST);
  }

  verify(password: string, passwordHash: string): Promise<boolean> {
    return compare(password, passwordHash);
  }
}
