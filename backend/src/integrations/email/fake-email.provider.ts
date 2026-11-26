import { env } from '../../config/env.js';
import { AppError } from '../../errors/app-error.js';
import { ERROR_CODES } from '../../errors/error-codes.js';
import type { EmailProvider } from './email-provider.interface.js';

export const fakeEmailProvider: EmailProvider = {
  assertAvailable() {
    if (env.NODE_ENV === 'production') {
      throw new AppError(
        503,
        ERROR_CODES.SERVICE_UNAVAILABLE,
        'Invitation delivery is unavailable.',
      );
    }
  },
  async sendWorkspaceInvitation({ token }) {
    const url = new URL('/invitations/accept', env.FRONTEND_URL);
    url.hash = new URLSearchParams({ token }).toString();
    return { previewUrl: url.toString() };
  },
};
