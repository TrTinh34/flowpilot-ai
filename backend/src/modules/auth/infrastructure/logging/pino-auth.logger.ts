import type { Logger } from 'pino';
import type { AuthLogger } from '../../application/ports/auth-logger.port.js';

export class PinoAuthLogger implements AuthLogger {
  constructor(private readonly logger: Logger) {}

  warnRefreshTokenReuse(): void {
    this.logger.warn({ event: 'refresh_token_reuse' }, 'Refresh token family revoked');
  }
}
