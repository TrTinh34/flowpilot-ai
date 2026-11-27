import { normalizeEmail } from '../../domain/entities/user.entity.js';
import { EmailAlreadyExistsError } from '../../domain/errors/auth.errors.js';
import type { PublicUserDto, RegisterUserInput } from '../dtos/auth.dtos.js';
import type { PasswordHasher } from '../ports/password-hasher.port.js';
import type { UserRepository } from '../ports/user.repository.port.js';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<PublicUserDto> {
    const normalizedEmail = normalizeEmail(input.email);
    if (await this.userRepository.emailExists(normalizedEmail)) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    return this.userRepository.create({
      displayName: input.displayName,
      email: normalizedEmail,
      passwordHash,
    });
  }
}
