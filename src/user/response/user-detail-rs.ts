import { UserRole, UserStatus } from '@prisma/client';

export interface UserDetailRs {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
