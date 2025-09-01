import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [RefreshTokenService, PrismaService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
