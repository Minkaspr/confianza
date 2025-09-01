import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { JwtTokenModule } from '../jwt/jwt.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [JwtTokenModule, AuthModule],
  controllers: [TestController],
})
export class TestModule {}
