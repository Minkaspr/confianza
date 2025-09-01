import { UserRole } from '@prisma/client';

export interface JwtPayloadRs {
  sub: number; // ID del usuario
  email: string;
  role: UserRole;
  iat?: number; // issued at (automático por JWT)
  exp?: number; // expiration (automático por JWT)
}

export interface JwtConfigRq {
  secret: string;
  refreshSecret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}
