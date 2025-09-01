import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class ChangeUserStatusRq {
  @IsNotEmpty({ message: 'El estado es requerido' })
  @IsEnum(UserStatus, {
    message: 'El estado debe ser ACTIVE, INACTIVE o SUSPENDED',
  })
  status: UserStatus;
}
