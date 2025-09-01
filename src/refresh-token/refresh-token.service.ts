import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateRefreshTokenRq,
  TokenStatsRs,
  ActiveTokenRs,
  CleanupRs,
} from './refresh-token.interface';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createData: CreateRefreshTokenRq): Promise<RefreshToken> {
    return await this.prisma.client.refreshToken.create({
      data: {
        token: createData.token,
        userId: createData.userId,
        expiresAt: createData.expiresAt,
        ipAddress: createData.ipAddress,
        userAgent: createData.userAgent,
      },
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return await this.prisma.client.refreshToken.findUnique({
      where: { token },
    });
  }

  isValid(refreshToken: RefreshToken): boolean {
    return !refreshToken.revoked && refreshToken.expiresAt > new Date();
  }

  async isTokenValid(token: string): Promise<boolean> {
    const refreshToken = await this.findByToken(token);
    if (!refreshToken) {
      return false;
    }
    return this.isValid(refreshToken);
  }

  async revoke(token: string): Promise<void> {
    const result = await this.prisma.client.refreshToken.updateMany({
      where: {
        token,
        revoked: false,
      },
      data: {
        revoked: true,
        revokedAt: new Date(),
      },
    });

    if (result.count === 0) {
      throw new UnauthorizedException(
        'Refresh token no encontrado o ya revocado',
      );
    }
  }

  async revokeByUserId(userId: number): Promise<number> {
    const result = await this.prisma.client.refreshToken.updateMany({
      where: {
        userId,
        revoked: false,
      },
      data: {
        revoked: true,
        revokedAt: new Date(),
      },
    });

    return result.count;
  }

  async findAllByUserId(userId: number): Promise<RefreshToken[]> {
    return await this.prisma.client.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActiveByUserId(userId: number): Promise<ActiveTokenRs[]> {
    return await this.prisma.client.refreshToken.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        createdAt: true,
        ipAddress: true,
        userAgent: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTokenStats(userId: number): Promise<TokenStatsRs> {
    const [activeCount, totalCount, oldestActive] = await Promise.all([
      this.prisma.client.refreshToken.count({
        where: {
          userId,
          revoked: false,
          expiresAt: { gt: new Date() },
        },
      }),
      this.prisma.client.refreshToken.count({
        where: { userId },
      }),
      this.prisma.client.refreshToken.findFirst({
        where: {
          userId,
          revoked: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      activeTokens: activeCount,
      totalTokens: totalCount,
      oldestActiveToken: oldestActive?.createdAt || null,
    };
  }

  async cleanupExpired(): Promise<CleanupRs> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await this.prisma.client.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          {
            revoked: true,
            revokedAt: { lt: thirtyDaysAgo },
          },
        ],
      },
    });

    return { deletedCount: result.count };
  }

  async countAll(): Promise<number> {
    return await this.prisma.client.refreshToken.count();
  }

  async countByUserId(userId: number): Promise<number> {
    return await this.prisma.client.refreshToken.count({
      where: { userId },
    });
  }

  async countActiveByUserId(userId: number): Promise<number> {
    return await this.prisma.client.refreshToken.count({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });
  }
}
