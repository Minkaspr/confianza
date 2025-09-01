export interface TokenStatsRs {
  activeTokens: number;
  totalTokens: number;
  oldestActiveToken: Date | null;
}

export interface ActiveTokenRs {
  id: number;
  createdAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

export interface CleanupRs {
  deletedCount: number;
}

export interface CreateRefreshTokenRq {
  token: string;
  userId: number;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}
