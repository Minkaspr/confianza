import {
  Body,
  Controller,
  Ip,
  Post,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRq, RefreshTokenRq } from './request/login-rq';
import { LoginRs } from './response/login-rs';
import type { Request } from 'express';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginRq,
    @Ip() ip: string,
    @Req() req: Request,
  ): Promise<ApiResponse<LoginRs>> {
    const data = await this.authService.login(
      dto,
      ip,
      req.headers['user-agent'] as string,
    );
    return {
      status: 'success',
      message: 'Login exitoso',
      data,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() dto: RefreshTokenRq,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    const data = await this.authService.refresh(dto);
    return {
      status: 'success',
      message: 'Access token renovado',
      data,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body() dto: RefreshTokenRq,
  ): Promise<ApiResponse<{ message: string }>> {
    await this.authService.logout(dto.refreshToken);
    return {
      status: 'success',
      message: 'Sesión cerrada correctamente',
      data: { message: 'Sesión cerrada' },
    };
  }
}
