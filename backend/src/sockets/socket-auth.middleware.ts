import type { Socket } from 'socket.io';
import type { AccessTokenVerifier } from '../modules/auth/index.js';

export interface AuthenticatedSocketData {
  userId?: string;
}

function extractHandshakeToken(socket: Socket): string | null {
  const raw = socket.handshake.auth?.['token'];
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase().startsWith('bearer ')) {
    const token = trimmed.slice(7).trim();
    return token.length > 0 ? token : null;
  }
  return trimmed;
}

export function createSocketAuthMiddleware(accessTokenVerifier: AccessTokenVerifier) {
  return async (socket: Socket, next: (err?: Error) => void): Promise<void> => {
    const token = extractHandshakeToken(socket);
    if (!token) {
      next(new Error('Unauthorized'));
      return;
    }

    try {
      const payload = await accessTokenVerifier.verifyAccessToken(token);
      (socket.data as AuthenticatedSocketData).userId = payload.userId;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  };
}
