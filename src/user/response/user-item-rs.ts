import { UserRole, UserStatus } from '@prisma/client';

export interface UserItemRs {
  id: number;
  firstname: string;
  lastname: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}
