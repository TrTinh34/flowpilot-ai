export interface AccessTokenIssuer {
  readonly accessTokenLifetimeSeconds: number;
  issueAccessToken(userId: string): Promise<string>;
}

export interface AccessTokenVerifier {
  verifyAccessToken(token: string): Promise<{ userId: string }>;
}

export interface RefreshTokenService {
  readonly refreshTokenLifetimeMs: number;
  generateRefreshToken(): string;
  hashRefreshToken(token: string): string;
}
