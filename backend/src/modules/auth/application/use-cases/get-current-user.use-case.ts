import { ApplicationError } from '../../../../shared/application/errors/application-error.js';
import { ERROR_CODES } from '../../../../shared/domain/errors/error-codes.js';
import { UserNotFoundError } from '../../domain/errors/auth.errors.js';
import type { PublicUserDto } from '../dtos/auth.dtos.js';
import type { UserRepository } from '../ports/user.repository.port.js';

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<PublicUserDto> {
    let user;
    try {
      user = await this.userRepository.findPublicById(userId);
    } catch (error) {
      throw new ApplicationError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected internal error occurred',
        {
          cause: error,
        },
      );
    }

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
