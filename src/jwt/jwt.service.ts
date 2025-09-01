import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { JwtPayloadRs } from './jwt.interface';

@Injectable()
export class JwtTokenService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    this.jwtRefreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    this.accessTokenExpiresIn = Number(
      this.configService.get('JWT_ACCESS_EXPIRES_IN', 900),
    );
    this.refreshTokenExpiresIn = Number(
      this.configService.get('JWT_REFRESH_EXPIRES_IN', 604800),
    );
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayloadRs = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenExpiresIn,
      secret: this.jwtSecret,
    });
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload: JwtPayloadRs = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: this.refreshTokenExpiresIn,
      secret: this.jwtRefreshSecret,
    });
  }

  async validateAccessToken(token: string): Promise<JwtPayloadRs | null> {
    try {
      return await this.jwtService.verifyAsync<JwtPayloadRs>(token, {
        secret: this.jwtSecret,
      });
    } catch {
      return null;
    }
  }

  async validateRefreshToken(token: string): Promise<JwtPayloadRs | null> {
    try {
      return await this.jwtService.verifyAsync<JwtPayloadRs>(token, {
        secret: this.jwtRefreshSecret,
      });
    } catch {
      return null;
    }
  }

  getRefreshTokenExpirationDate(): Date {
    return new Date(Date.now() + this.refreshTokenExpiresIn * 1000);
  }
}
