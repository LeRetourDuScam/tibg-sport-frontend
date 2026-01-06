export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    retryAfter?: number;
    supportId?: string;
    details?: any;
  };
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  username: string;
  email: string;
  expiresAt: Date;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
