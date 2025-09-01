import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtTokenService } from '../jwt/jwt.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginRq, RefreshTokenRq } from './request/login-rq';
import { LoginRs } from './response/login-rs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async login(
    dto: LoginRq,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginRs> {
    const user = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // generar tokens
    const accessToken = await this.jwtTokenService.generateAccessToken(user);
    const refreshToken = await this.jwtTokenService.generateRefreshToken(user);

    // persistir refresh token
    await this.refreshTokenService.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: this.jwtTokenService.getRefreshTokenExpirationDate(),
      ipAddress,
      userAgent,
    });

    // respuesta
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(dto: RefreshTokenRq): Promise<{ accessToken: string }> {
    // validar JWT refresh
    const payload = await this.jwtTokenService.validateRefreshToken(
      dto.refreshToken,
    );
    if (!payload) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // validar persistencia en DB
    const stored = await this.refreshTokenService.findByToken(dto.refreshToken);
    if (!stored || !this.refreshTokenService.isValid(stored)) {
      throw new UnauthorizedException('Refresh token revocado o expirado');
    }

    // generar nuevo access token
    const user = await this.prisma.client.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const accessToken = await this.jwtTokenService.generateAccessToken(user);

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenService.revoke(refreshToken);
  }

  async logoutAll(userId: number): Promise<number> {
    return await this.refreshTokenService.revokeByUserId(userId);
  }
}
